import { 
  CreateUserSchema, 
  CreateStreamResponse, 
  GetStreamsResponse, 
  ErrorResponse,
  StreamWithVotes,
} from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  extractStreamData,
  checkDuplicateStream,
  createStream,
  transformStreamResponse,
  transformStreamWithVotes
} from "@/app/lib/StreamCreation";

export async function POST(req: NextRequest): Promise<NextResponse<CreateStreamResponse | ErrorResponse>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Authentication required. Please log in to add streams."
      }, { status: 401 });
    }

    const data = CreateUserSchema.parse(await req.json());
    const userId = session.user.id;

    // Extract and validate stream data
    const streamData = await extractStreamData(data.url);

    // Check for duplicates
    const isDuplicate = await checkDuplicateStream(userId, streamData.extractedId);
    if (isDuplicate) {
      return NextResponse.json({
        message: "You have already added this song to the queue"
      }, { status: 409 });
    }

    // Create new stream
    const newStream = await createStream(userId, data.url, streamData);
    
    return NextResponse.json({
      message: "Stream added successfully",
      stream: transformStreamResponse(newStream)
    }, { status: 201 });
    
  } catch (e) {
    console.error("Error adding stream:", e);
    
    if (e instanceof Error) {
      if (e.message.includes("Invalid") || e.message.includes("Unsupported") || e.message.includes("Link is not correct")) {
        return NextResponse.json({
          message: e.message
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      message: "Internal server error while adding stream"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<GetStreamsResponse | ErrorResponse>> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Authentication required. Please log in to view streams."
      }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch streams with votes
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