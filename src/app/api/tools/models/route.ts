import { respData, respErr } from '@/shared/lib/resp';
import { getToolCatalog } from '@/shared/services/apimart/catalog';
import { ToolSurface } from '@/shared/types/ai-tools';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const surface = searchParams.get('surface') as ToolSurface | null;

    if (
      surface &&
      surface !== 'chat' &&
      surface !== 'image' &&
      surface !== 'video'
    ) {
      return respErr('invalid surface');
    }

    return respData(getToolCatalog(surface ?? undefined));
  } catch (e: any) {
    console.log('get tool models failed:', e);
    return respErr(`get tool models failed: ${e.message}`);
  }
}
