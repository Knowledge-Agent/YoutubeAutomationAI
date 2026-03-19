import { AIMediaType } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getToolModelById } from '@/shared/services/apimart/catalog';
import { createToolTask, getCreditCost } from '@/shared/services/tool-tasks';

export async function POST(req: Request) {
  try {
    const { mediaType, scene, model, prompt, options } = await req.json();

    if (!mediaType || !scene || !model) {
      return respErr('invalid params');
    }

    if (!Object.values(AIMediaType).includes(mediaType)) {
      return respErr('invalid mediaType');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const modelDefinition = getToolModelById(model);
    if (!modelDefinition) {
      return respErr('unsupported model');
    }

    if (!modelDefinition.modeSupport.includes(scene)) {
      return respErr('unsupported scene');
    }

    if (modelDefinition.mediaType !== mediaType) {
      return respErr('model does not match mediaType');
    }

    const task = await createToolTask({
      userId: user.id,
      mediaType,
      scene,
      model,
      prompt: String(prompt || ''),
      options: options || {},
    });

    return respData({
      ...task,
      creditCost: getCreditCost({ modelId: model, scene }),
    });
  } catch (e: any) {
    console.log('create tool task failed:', e);
    return respErr(e.message);
  }
}
