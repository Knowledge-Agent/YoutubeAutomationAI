import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { db } from '@/core/db';
import { envConfigs } from '@/config';
import { config } from '@/config/db/schema';
import { guessLocaleFromAcceptLanguage, getCookieFromHeader } from '@/shared/lib/cookie';
import { respErr, respJson } from '@/shared/lib/resp';

export const runtime = 'nodejs';

type WaitlistPayload = {
  email: string;
  createdAt: string;
  source: string;
  pagePath: string;
  referer: string;
  utmSource: string;
  locale: string;
  userAgent: string;
};

function isJsonRequest(contentType: string) {
  return contentType.includes('application/json');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(value: string, maxLength = 240) {
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function sanitizePath(value: string) {
  return sanitizeText(value, 300).replace(/[^/\w\-.:?=&%#]/g, '');
}

function sanitizeUtmSource(value: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();

  return decoded
    .trim()
    .replace(/[^\w\-.:]/g, '')
    .slice(0, 100);
}

function getReferer(req: Request) {
  return sanitizeText(req.headers.get('referer') || '', 500);
}

function getPagePath(pagePath: string, referer: string) {
  const sanitizedPagePath = sanitizePath(pagePath);
  if (sanitizedPagePath) {
    return sanitizedPagePath;
  }

  if (!referer) {
    return '';
  }

  try {
    const url = new URL(referer);
    return sanitizePath(`${url.pathname}${url.search}`);
  } catch {
    return '';
  }
}

function getUtmSource(req: Request, referer: string, bodyUtmSource: string) {
  const candidateValues = [
    bodyUtmSource,
    getCookieFromHeader(req.headers.get('cookie'), 'utm_source') || '',
  ];

  if (referer) {
    try {
      const url = new URL(referer);
      candidateValues.push(url.searchParams.get('utm_source') || '');
    } catch {
      // ignore invalid referer
    }
  }

  for (const candidate of candidateValues) {
    const sanitized = sanitizeUtmSource(candidate);
    if (sanitized) {
      return sanitized;
    }
  }

  return '';
}

async function persistToDatabase(payload: WaitlistPayload) {
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

async function persistToFile(payload: WaitlistPayload) {
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
  let source = '';
  let pagePath = '';
  let locale = '';
  let utmSource = '';

  try {
    if (isJsonRequest(contentType)) {
      const body = await req.json();
      email = String(body?.email || '')
        .trim()
        .toLowerCase();
      source = String(body?.source || '');
      pagePath = String(body?.pagePath || '');
      locale = String(body?.locale || '');
      utmSource = String(body?.utmSource || '');
    } else {
      const formData = await req.formData();
      email = String(formData.get('email') || '')
        .trim()
        .toLowerCase();
      source = String(formData.get('source') || '');
      pagePath = String(formData.get('pagePath') || '');
      locale = String(formData.get('locale') || '');
      utmSource = String(formData.get('utmSource') || '');
    }
  } catch {
    return respErr('invalid request body');
  }

  if (!email) {
    return respErr('email is required');
  }

  if (!isValidEmail(email)) {
    return respErr('invalid email');
  }

  const referer = getReferer(req);
  const createdAt = new Date().toISOString();
  const payload: WaitlistPayload = {
    email,
    createdAt,
    source: sanitizeText(source, 100) || 'homepage_waitlist',
    pagePath: getPagePath(pagePath, referer),
    referer,
    utmSource: getUtmSource(req, referer, utmSource),
    locale:
      sanitizeText(locale, 20) ||
      guessLocaleFromAcceptLanguage(req.headers.get('accept-language') || undefined),
    userAgent: sanitizeText(req.headers.get('user-agent') || '', 200),
  };

  let persisted = await persistToDatabase(payload);

  if (!persisted) {
    persisted = await persistToFile(payload);
  }

  console.log('[subscribe] new waitlist lead:', {
    email: payload.email,
    source: payload.source,
    pagePath: payload.pagePath,
    utmSource: payload.utmSource,
    locale: payload.locale,
    persisted,
  });

  if (isJsonRequest(contentType)) {
    return respJson(0, 'Thanks! You are on the waitlist.', { persisted });
  }

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
