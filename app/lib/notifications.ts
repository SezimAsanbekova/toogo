import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  title: string,
  message: string
) {
  await prisma.notification.create({
    data: {
      user_id: BigInt(userId),
      title,
      message,
    },
  });
}
