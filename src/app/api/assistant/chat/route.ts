import { UIMessage } from 'ai';

import { getUserInfo } from '@/shared/models/user';
import { streamApimartUIResponse } from '@/shared/services/ai-chat';

export async function POST(req: Request) {
  try {
    const {
      messages,
      config,
    }: {
      messages: UIMessage[];
      config?: {
        modelName?: string;
      };
    } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('messages are required');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    return await streamApimartUIResponse({
      messages,
      model: config?.modelName || 'gpt-4o',
    });
  } catch (e: any) {
    console.log('assistant chat failed:', e);
    return new Response(e.message, { status: 500 });
  }
}
