import { and, desc, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { comment, commentToLightnovel, commentToLightnovelChapter, lightnovelChapter, lightnovelVolume } from "@/drizzle/schema";
import { formatNumber } from "@/lib/formatNumber";
import { findChapterCharge } from "@/lib/findChapterCharge";

export const findChapter = async (chapterId: string, userId?: string): Promise<LightnovelChapterDetail | null> => {
  try {
    const existingChapter = await db.query.lightnovelChapter.findFirst({
      where: and(
        eq(lightnovelChapter.id, chapterId), eq(lightnovelChapter.deleted, false)
      ),
      with: {
        comments: {
          columns: {
            commentId: true
          },
          where: inArray(
            commentToLightnovelChapter.commentId,
            db.select({ id: comment.id })
              .from(comment)
              .where(isNull(comment.parentId))
          )
        },
        volume: {
          columns: {
            id: true,
          },
          with: {
            lightnovel: {
              columns: {
                id: true,
                userId: true,
                name: true
              },
              with: {
                volumes: {
                  columns: {
                    id: true,
                    image: true,
                    name: true
                  },
                  orderBy: desc(lightnovelVolume.createdAt),
                  with: {
                    chapters: {
                      columns: {
                        id: true,
                        charge: true,
                        name: true,
                      },
                      orderBy: desc(lightnovelChapter.createdAt)
                    }
                  }
                }
              }
            },
          }
        }
      }
    })

    if (!existingChapter) return null

    let charge: boolean;

    charge = await findChapterCharge(existingChapter.charge ?? false, chapterId, existingChapter.volume.lightnovel.userId, userId)

    const volPromises = existingChapter.volume.lightnovel.volumes.map(async (vol) => {
      const chapterPromises = vol.chapters.map(async (chap) => ({
        id: chap.id,
        name: chap.name,
        charge: await findChapterCharge(chap.charge ?? false, chap.id, existingChapter.volume.lightnovel.userId, userId)
      }));

      const chapters = await Promise.all(chapterPromises);

      return {
        id: vol.id,
        name: vol.name,
        image: vol.image as {
          key: string,
          url: string
        },
        chapters: chapters
      };
    });

    const volumes = await Promise.all(volPromises);

    const result: LightnovelChapterDetail = {
      id: existingChapter.id,
      name: existingChapter.name,
      authorId: existingChapter.volume.lightnovel.userId,
      novelId: existingChapter.volume.lightnovel.id!,
      novelName: existingChapter.volume.lightnovel.name,
      charge: charge,
      content: existingChapter.content,
      volumes: volumes,
      comments: existingChapter.comments.length,
      createdAt: existingChapter.createdAt ? existingChapter.createdAt.toISOString() : "",
      updateAt: existingChapter.updatedAt ? existingChapter.updatedAt.toISOString() : "",
      viewed: formatNumber(existingChapter.viewed || 0),
      words: formatNumber(existingChapter.words || 0)
    }

    return result
  } catch (error) {
    console.log(error)
    return null
  }
}