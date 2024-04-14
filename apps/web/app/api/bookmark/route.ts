import prisma from "@repo/db/client";

export async function POST(req: Request) {
  const { userid, trackid } = await req.json();

  try {
    const userBookmarks = await prisma.bookmark.findFirst({
      where: {
        user: userid,
        track: trackid,
      },
    });

    if (userBookmarks) {
      await prisma.bookmark.delete({
        where: {
          id: userBookmarks.id,
        },
      });
      return Response.json(
        {
          success: true,
          data: "deleted",
        },
        {
          status: 200,
        }
      );
    } else {
      await prisma.bookmark.create({
        data: {
          user: userid,
          track: trackid,
        },
      });
      return Response.json(
        {
          success: true,
          data: "created",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
      },
      {
        status: 400,
      }
    );
  }
}
