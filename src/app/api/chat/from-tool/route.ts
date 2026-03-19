import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  createOrResumeToolChat,
  isToolChatMode,
  isToolChatSurface,
} from '@/shared/services/chat-tool-link';

export async function POST(req: Request) {
  try {
    const {
      chatId,
      prompt,
      surface,
      mode,
      model,
      toolModel,
      toolOptions,
      appendPrompt,
    } = await req.json();

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

    const result = await createOrResumeToolChat({
      chatId,
      userId: user.id,
      prompt,
      surface,
      mode,
      model,
      toolModel,
      toolOptions,
      appendPrompt: appendPrompt !== false,
    });

    return respData({
      id: result.chat.id,
      title: result.chat.title,
      created: result.created,
      appendedPrompt: result.appendedPrompt,
      path: `/chat/${result.chat.id}`,
      metadata: result.chat.metadata ? JSON.parse(result.chat.metadata) : null,
    });
  } catch (e: any) {
    console.log('create tool chat failed:', e);
    return respErr(`create tool chat failed: ${e.message}`);
  }
}
