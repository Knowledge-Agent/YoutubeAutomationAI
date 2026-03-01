import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { db } from '@/core/db';
import { envConfigs } from '@/config';
import { config } from '@/config/db/schema';
import { respErr, respJson } from '@/shared/lib/resp';

export const runtime = 'nodejs';

function isJsonRequest(contentType: string) {
  return contentType.includes('application/json');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function persistToDatabase(payload: {
  email: string;
  createdAt: string;
  source: string;
}) {
  if (!envConfigs.database_url) {
    return false;
  }

  const key = `waitlist:${payload.email}`;

  try {
    await db()
      .insert(config)
      .values({
        name: key,
        value: JSON.stringify(payload),
      })
      .onConflictDoUpdate({
        target: config.name,
        set: {
          value: JSON.stringify(payload),
        },
      });

    return true;
  } catch (error) {
    console.log('[subscribe] persisted to database failed:', error);
    return false;
  }
}

async function persistToFile(payload: {
  email: string;
  createdAt: string;
  source: string;
}) {
  try {
    const dir = path.join(process.cwd(), 'data');
    const file = path.join(dir, 'waitlist-signups.ndjson');
    await mkdir(dir, { recursive: true });
    await appendFile(file, `${JSON.stringify(payload)}\n`, 'utf8');
    return true;
  } catch (error) {
    console.log('[subscribe] persisted to file failed:', error);
    return false;
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let email = '';

  try {
    if (isJsonRequest(contentType)) {
      const body = await req.json();
      email = String(body?.email || '')
        .trim()
        .toLowerCase();
    } else {
      const formData = await req.formData();
      email = String(formData.get('email') || '')
        .trim()
        .toLowerCase();
    }
  } catch (error) {
    return respErr('invalid request body');
  }

  if (!email) {
    return respErr('email is required');
  }

  if (!isValidEmail(email)) {
    return respErr('invalid email');
  }

  const createdAt = new Date().toISOString();
  const payload = {
    email,
    createdAt,
    source: 'homepage_waitlist',
  };

  let persisted = await persistToDatabase(payload);

  if (!persisted) {
    persisted = await persistToFile(payload);
  }

  console.log('[subscribe] new waitlist lead:', {
    email,
    createdAt,
    persisted,
  });

  if (isJsonRequest(contentType)) {
    return respJson(0, 'Thanks! You are on the waitlist.', { persisted });
  }

  const referer = req.headers.get('referer');
  if (referer) {
    const url = new URL(referer);
    url.searchParams.set('waitlist', 'success');
    return Response.redirect(url, 303);
  }

  return new Response('Thanks! You are on the waitlist.', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
