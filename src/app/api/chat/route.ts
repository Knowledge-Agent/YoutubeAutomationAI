import { UIMessage } from 'ai';

import { getUserInfo } from '@/shared/models/user';
import { streamPersistedChatResponse } from '@/shared/services/ai-chat';

export async function POST(req: Request) {
  try {
    const {
      chatId,
      message,
      model,
      webSearch,
      reasoning,
    }: {
      chatId: string;
      message: UIMessage;
      model: string;
      webSearch?: boolean;
      reasoning?: boolean;
    } = await req.json();

    if (!chatId || !model) {
      throw new Error('invalid params');
    }

    if (
      !message ||
      !Array.isArray(message.parts) ||
      message.parts.length === 0
    ) {
      throw new Error('invalid message');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    return await streamPersistedChatResponse({
      chatId,
      message,
      model,
      user,
      metadata: {
        model,
        webSearch: Boolean(webSearch),
        reasoning: Boolean(reasoning),
      },
    });
  } catch (e: any) {
    console.log('chat failed:', e);
    return new Response(e.message, { status: 500 });
  }
}
