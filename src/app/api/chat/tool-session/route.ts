import { AIMediaType } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getToolModelById } from '@/shared/services/apimart/catalog';
import {
  isToolChatMode,
  isToolChatSurface,
  startToolChatSession,
} from '@/shared/services/chat-tool-link';
import { validateToolTaskInput } from '@/shared/services/tool-tasks';

export async function POST(req: Request) {
  try {
    const { chatId, prompt, surface, mode, model, toolModel, toolOptions } =
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

    if (!toolModel) {
      throw new Error('toolModel is required');
    }

    if (!prompt || !String(prompt).trim()) {
      throw new Error('prompt is required');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    const modelDefinition = getToolModelById(toolModel);
    if (!modelDefinition) {
      throw new Error('unsupported tool model');
    }

    if (modelDefinition.surface !== surface) {
      throw new Error('tool model does not match surface');
    }

    validateToolTaskInput({
      mediaType: surface === 'image' ? AIMediaType.IMAGE : AIMediaType.VIDEO,
      scene: mode,
      model: toolModel,
      options: toolOptions || {},
    });

    const result = await startToolChatSession({
      chatId,
      userId: user.id,
      prompt: String(prompt),
      surface,
      mode,
      model,
      toolModel,
      toolOptions,
    });

    return respData({
      id: result.chat.id,
      path: `/chat/${result.chat.id}`,
      title: result.chat.title,
      created: result.created,
      appendedPrompt: result.appendedPrompt,
      task: result.task,
      metadata: result.chat.metadata ? JSON.parse(result.chat.metadata) : null,
    });
  } catch (e: any) {
    console.log('create tool session failed:', e);
    return respErr(`create tool session failed: ${e.message}`);
  }
}
