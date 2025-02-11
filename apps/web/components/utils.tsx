"use server";
import { MCQQuestion, Prisma, Problem, Track, TrackProblems } from "@prisma/client";
import db from "@repo/db/client";
import { cache } from "../../../packages/db/Cache";
import { revalidateTag, unstable_cache as nextCache } from "next/cache";

interface Tracks extends Track {
  problems: { problem: Problem }[];
}
interface AllTracks extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export async function getProblem(problemId: string | null) {
  if (!problemId) {
    return null;
  }
  const value: Problem = await cache.get("problems", [problemId.toString()]);
  if (value) {
    return value;
  }
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    await cache.set("problems", [problemId.toString()], problem);
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getFirstProblemForTrack(trackId: string) {
  const value = await cache.get("tracks", [trackId.toString()]);
  if (value) {
    return value?.problems[0]?.problemId || null;
  }

  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      select: {
        problems: true,
      },
    });
    await cache.set("tracks", [trackId.toString()], track);
    return track?.problems[0]?.problemId || null;
  } catch (err) {
    return null;
  }
}

export async function getAllProblems() {
  const value = await cache.get("getAllProblems", []);
  if (value) {
    return value;
  }
  try {
    const problems = await db.problem.findMany({
      orderBy: {
        id: "desc",
      },
    });
    await cache.set("getAllProblems", [], problems);
    return problems;
  } catch (e) {
    return [];
  }
}

export async function updateProblem(problemId: string, data: Problem) {
  try {
    const problem = await db.problem.update({
      where: {
        id: problemId,
      },
      data,
    });
    return problem;
  } catch (e) {
    return null;
  }
}

export async function createProblem(data: Omit<Problem, "id">) {
  try {
    const problem = await db.problem.create({
      data,
    });
    return problem;
  } catch (e) {
    return null;
  }
}

export async function createTrackProblems(data: TrackProblems) {
  try {
    const trackProblems = await db.trackProblems.create({
      data: {
        trackId: data.trackId,
        problemId: data.problemId,
        sortingOrder: data.sortingOrder,
      },
    });
    return trackProblems;
  } catch (e) {
    return null;
  }
}

export async function getTrack(trackId: string) {
  const value: Tracks = await cache.get("Track", [trackId.toString()]);
  if (value) {
    return {
      ...value,
      problems: value.problems.map((problem: { problem: Problem }) => ({ ...problem.problem })),
    };
  }
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      include: {
        problems: {
          select: {
            problem: true,
          },
          orderBy: [
            {
              sortingOrder: "desc",
            },
          ],
        },
      },
    });
    if (track) {
      await cache.set("Track", [trackId.toString()], track);
      return {
        ...track,
        problems: track.problems.map((problem: any) => ({ ...problem.problem })),
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export const getAllTracks = nextCache(
  async () => {
    try {
      const tracks = await db.track.findMany({
        where: {
          hidden: false,
        },
        include: {
          problems: {
            select: {
              problemId: true,
              problem: true,
            },
            orderBy: [
              {
                sortingOrder: "desc",
              },
            ],
          },
          categories: {
            select: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      await cache.set("getAllTracks", [], tracks);
      return tracks.map((track: any) => ({
        ...track,
        problems: track.problems.map((problem: any) => ({ ...problem.problem })),
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  ["tracks"],
  { tags: ["tracks"] }
);

export async function createTrack(data: {
  id: string;
  title: string;
  description: string;
  image: string;
  selectedCategory?: string[];
  problems: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[];
  hidden: boolean;
  cohort?: number;
  canvaLink?: string;
  trackType: "NOTION" | "CANVA";
}) {
  try {
    await db.problem.createMany({
      data: data.problems.map((x) => x.problem),
    });

    const track = await db.track.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        cohort: data.cohort,
        canvaLink: data.canvaLink,
        trackType: data.trackType,
        hidden: data.hidden,
        problems: {
          createMany: {
            data: data.problems.map((problem) => ({
              problemId: problem.problem.id!,
              sortingOrder: problem.sortingOrder!,
            })),
          },
        },
      },
    });

    if (data.selectedCategory) {
      data.selectedCategory.forEach(async (category) => {
        await db.trackCategory.create({
          data: {
            trackId: data.id,
            categoryId: category,
          },
        });
      });
    }
    revalidateTag("tracks");
    revalidateTag("categories");
    return track;
  } catch (e) {
    return new Error("Failed to create track");
  }
}

export async function updateTrack(
  trackId: string,
  data: {
    id: string;
    title: string;
    description: string;
    image: string;
    selectedCategory?: string[];
    problems?: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[];
    hidden: boolean;
    cohort?: number;
    canvaLink?: string;
    trackType: "NOTION" | "CANVA";
  }
) {
  try {
    const track = await db.track.update({
      where: {
        id: trackId,
      },
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        hidden: data.hidden,
        cohort: data.cohort,
        canvaLink: data.canvaLink,
        trackType: data.trackType,
      },
    });
    await db.trackCategory.deleteMany({
      where: {
        trackId: trackId,
      },
    });
    if (data.selectedCategory) {
      data.selectedCategory.forEach(async (category) => {
        await db.trackCategory.create({
          data: {
            trackId: trackId,
            categoryId: category,
          },
        });
      });
    }

    await cache.evict("getAllTracks", []);
    await getAllTracks();

    return track;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const getAllCategories = nextCache(
  async () => {
    try {
      const categories = await db.categories.findMany({
        select: {
          id: true,
          category: true,
        },
        distinct: ["category"],
      });
      await cache.set("getAllCategories", [], categories);
      return categories;
    } catch (e) {
      return [];
    }
  },
  ["categories"],
  { tags: ["categories"] }
);

export async function getAllMCQs() {
  const value = await cache.get("getAllMCQs", []);
  if (value) {
    return value;
  }
  try {
    const mcqs = await db.problem.findMany({
      where: {
        type: "MCQ",
      },
      include: {
        mcqQuestions: true,
      },
    });
    await cache.set("getAllMCQs", [], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQQuestion(problemId: string) {
  const value = await cache.get("getAllMCQQuestion", [problemId.toString()]);
  if (value) {
    return value;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    await cache.set("getAllMCQQuestion", [problemId.toString()], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createMCQ(data: Omit<MCQQuestion, "id">) {
  try {
    const mcq = await db.mCQQuestion.create({
      data,
    });
    return mcq;
  } catch (e) {
    return null;
  }
}

export async function updateMCQ(id: string, data: MCQQuestion) {
  try {
    const mcq = await db.mCQQuestion.update({
      where: {
        id: id,
      },
      data,
    });
    return mcq;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function deleteMCQ(id: string) {
  try {
    const mcq = await db.mCQQuestion.delete({
      where: {
        id: id,
      },
    });
    return mcq;
  } catch (e) {
    return null;
  }
}
export async function getAllMCQsForProblem(problemId: string) {
  const value = await cache.get("getAllMCQsForProblem", [problemId.toString()]);
  if (value) {
    return value;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    await cache.set("getAllMCQsForProblem", [problemId.toString()], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createQuizScore(data: { userId: string; score: number; problemId: string }) {
  const submission = await db.quizScore.create({
    data,
  });
  return submission;
}

export async function getQuizScore({ userId, problemId }: { userId: string; problemId: string }) {
  const value = await cache.get("getQuizScore", [userId.toString(), problemId.toString()]);
  if (value) {
    return value;
  }
  try {
    const submissions = await db.quizScore.findMany({
      where: {
        userId,
        problemId,
      },
    });
    await cache.set("getQuizScore", [userId.toString(), problemId.toString()], submissions);
    return submissions;
  } catch (e) {
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        category: true,
      },
      distinct: ["category"],
    });
    return categories;
  } catch (e) {
    return [];
  }
}

export async function addCategory(category: string) {
  const newCategory = await db.categories.create({
    data: {
      category,
    },
  });
  return newCategory;
}

export async function deleteCategory(categoryId: string) {
  await db.categories.delete({
    where: {
      id: categoryId,
    },
  });
}
