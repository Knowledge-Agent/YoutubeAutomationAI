import { AIMediaType } from '@/extensions/ai';
import { respData, respErr, respJson } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getToolModelById } from '@/shared/services/apimart/catalog';
import {
  isToolChatMode,
  isToolChatSurface,
  startToolChatSession,
} from '@/shared/services/chat-tool-link';
import { GenerationQuotaExceededError } from '@/shared/services/generation-quota';
import { validateToolTaskInput } from '@/shared/services/tool-tasks';

export async function POST(req: Request) {
  const startedAt = Date.now();
  let lastMark = startedAt;
  const mark = (label: string) => {
    const now = Date.now();
    console.log(
      `[tool-session] ${label}: +${now - lastMark}ms (total ${now - startedAt}ms)`
    );
    lastMark = now;
  };

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
    mark('parsed request');

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
    mark('resolved user');
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
    mark('validated input');

    const result = await startToolChatSession({
      chatId,
      userId: user.id,
      prompt: String(prompt),
      surface,
      mode,
      model,
      toolModel,
      toolOptions,
      appendPrompt: appendPrompt !== false,
    });
    mark('startToolChatSession');

    mark('ready response');
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
    if (e instanceof GenerationQuotaExceededError) {
      console.log(
        `[tool-session] quota exceeded after ${Date.now() - startedAt}ms`
      );
      return respJson(-2, 'daily_generation_limit_reached', {
        mediaType: e.mediaType,
        limit: e.limit,
        currentCount: e.currentCount,
      });
    }

    console.log(
      `[tool-session] failed after ${Date.now() - startedAt}ms:`,
      e
    );
    return respErr(`create tool session failed: ${e.message}`);
  }
}
