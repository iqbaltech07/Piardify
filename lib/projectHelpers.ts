import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Finds a project that belongs to the given user, using a typed `findFirst`
 * (instead of `(prisma.project as any).findUnique`) so we never lose type safety.
 *
 * Using `findFirst` with `{ id, userId }` guarantees ownership AND avoids
 * abusing a unique index with a non-unique filter.
 */
export async function getOwnedProject<
  T extends Prisma.ProjectSelect,
>(userId: string, projectId: string, select: T) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
    select,
  });
}