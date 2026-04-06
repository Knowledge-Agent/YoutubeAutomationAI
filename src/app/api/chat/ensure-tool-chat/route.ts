import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  ensureToolChat,
  isToolChatMode,
  isToolChatSurface,
} from '@/shared/services/chat-tool-link';

export async function POST(req: Request) {
  try {
    const { chatId, surface, mode, model, toolModel, toolOptions } =
      await req.json();

    if (!surface || !isToolChatSurface(surface)) {
      throw new Error('invalid tool surface');
    }

    if (!mode || !isToolChatMode(mode)) {
      throw new Error('invalid tool mode');
    }

    if (!model) {
      throw new Error('model is required');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    const chat = await ensureToolChat({
      chatId,
      userId: user.id,
      surface,
      mode,
      model,
      toolModel,
      toolOptions,
    });

    return respData({
      id: chat.id,
      path: `/chat/${chat.id}`,
      title: chat.title,
      metadata: chat.metadata ? JSON.parse(chat.metadata) : null,
    });
  } catch (e: any) {
    console.log('ensure tool chat failed:', e);
    return respErr(`ensure tool chat failed: ${e.message}`);
  }
}
