import { prismaClient } from "@/app/lib/db";
import { transformStreamWithVotes } from "@/app/lib/StreamCreation";
import { ErrorResponse, GetStreamsResponse, StreamWithVotes } from "@/app/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<GetStreamsResponse | ErrorResponse>> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Authentication required. Please log in to view streams."
      }, { status: 401 });
    }

    const userId = session.user.id;

    const streams: StreamWithVotes[] = await prismaClient.stream.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        votes: {
          select: {
            id: true,
            voteType: true,
            userId: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    // Transform streams with vote statistics
    const streamsWithStats = streams.map(stream => transformStreamWithVotes(stream));

    return NextResponse.json({
      message: "Streams fetched successfully",
      streams: streamsWithStats,
      totalStreams: streamsWithStats.length
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json({
      message: "Internal server error while fetching streams"
    }, { status: 500 });
  }
}