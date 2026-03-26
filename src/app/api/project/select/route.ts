import { respData, respErr } from '@/shared/lib/resp';
import {
  ChatStatus,
  findChatById,
  findLatestChatByProjectId,
} from '@/shared/models/chat';
import { findProjectById } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

export async function POST(req: Request) {
  try {
    const { chatId, projectId } = await req.json();

    if (!chatId || !projectId) {
      return respErr('chatId and projectId are required');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const chat = await findChatById(chatId);
    if (!chat) {
      return respErr('chat not found');
    }

    if (chat.userId !== user.id) {
      return respErr('no permission to access this chat');
    }

    const project = await findProjectById(projectId);
    if (!project) {
      return respErr('project not found');
    }

    if (project.userId !== user.id) {
      return respErr('no permission to access this project');
    }

    const targetChat = await findLatestChatByProjectId({
      projectId,
      userId: user.id,
      status: ChatStatus.CREATED,
    });

    if (targetChat && targetChat.id !== chat.id) {
      return respData({
        chat: targetChat,
        project,
      });
    }

    return respData({
      chat: targetChat ?? null,
      project,
    });
  } catch (e: any) {
    console.log('select project failed:', e);
    return respErr(`select project failed: ${e.message}`);
  }
}
