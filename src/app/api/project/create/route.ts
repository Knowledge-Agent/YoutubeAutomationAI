import { respData, respErr } from '@/shared/lib/resp';
import { updateChat, findChatById } from '@/shared/models/chat';
import { createUserProject } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

export async function POST(req: Request) {
  try {
    const { chatId, title } = await req.json();

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const project = await createUserProject({
      userId: user.id,
      title: String(title || '').trim(),
    });

    if (chatId) {
      const chat = await findChatById(chatId);
      if (!chat) {
        return respErr('chat not found');
      }

      if (chat.userId !== user.id) {
        return respErr('no permission to access this chat');
      }

      await updateChat(chat.id, {
        projectId: project.id,
        updatedAt: new Date(),
      });
    }

    return respData(project);
  } catch (e: any) {
    console.log('create project failed:', e);
    return respErr(`create project failed: ${e.message}`);
  }
}
