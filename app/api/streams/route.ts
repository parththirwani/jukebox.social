import { 
  CreateUserSchema, 
  CreateStreamResponse, 
  GetStreamsResponse, 
  ErrorResponse,
  StreamWithVotes,
  StreamResponse,
  StreamType,
  VoteType,
} from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { SPOTIFY_REGEX, YT_REGEX } from "@/app/regex";
import { getServerSession } from "next-auth";
import { Prisma } from "@/app/generated/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Use CommonJS require - ES6 import returns undefined
const youtubesearchapi = require("youtube-search-api");

// Helper function to safely get video details
async function getYouTubeVideoDetails(videoId: string): Promise<VideoDetails | null> {
  try {
    const details = await youtubesearchapi.GetVideoDetails(videoId);
    return details;
  } catch (error) {
    console.error("Error fetching YouTube video details:", error);
    return null;
  }
}

// Helper function to extract thumbnails (last two from thumbnail.thumbnails array)
function extractThumbnails(thumbnailData: any): { bigThumbnail: string | null, smallThumbnail: string | null } {
  // Check if thumbnail.thumbnails exists and is an array
  if (!thumbnailData || !thumbnailData.thumbnails || !Array.isArray(thumbnailData.thumbnails) || thumbnailData.thumbnails.length === 0) {
    return { bigThumbnail: null, smallThumbnail: null };
  }

  const thumbnails = thumbnailData.thumbnails;
  const length = thumbnails.length;

  // Get the last thumbnail (biggest) and second last (smaller)
  const bigThumbnail = length > 0 ? thumbnails[length - 1]?.url || null : null;
  const smallThumbnail = length > 1 ? thumbnails[length - 2]?.url || null : null;

  return { bigThumbnail, smallThumbnail };
}

// YouTube API types (based on the types you provided)
interface VideoDetails {
  id: string;
  title: string;
  thumbnail: any;
  isLive: boolean;
  channel: string;
  channelId: string;
  description: string;
  keywords: string[];
  suggestion: any[];
}

// Define proper types for our API responses
export async function POST(req: NextRequest): Promise<NextResponse<CreateStreamResponse | ErrorResponse>> {
  try {
    const session = await getServerSession(authOptions);
    console.log("Stream API - Session:", session);    

    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Authentication required. Please log in to add streams."
      }, {
        status: 401 
      });
    }

    const authenticatedUserId: string = session.user.id;
    const data = CreateUserSchema.parse(await req.json());
    const creatorId: string = authenticatedUserId;

    const isYt: boolean = YT_REGEX.test(data.url);
    const isSpotify: boolean = SPOTIFY_REGEX.test(data.url);
    
    if (!isYt && !isSpotify) {
      return NextResponse.json({
        message: "Link is not correct should be a spotify or yt link"
      }, {
        status: 400 
      });
    }
    
    let extractedId: string;
    let type: StreamType;
    let videoDetails: VideoDetails | null = null;
    let title: string | null = null;
    let bigThumbnail: string | null = null;
    let smallThumbnail: string | null = null;
    
    if (isYt) {
      if (data.url.includes("youtu.be/")) {
        extractedId = data.url.split("youtu.be/")[1].split("?")[0];
      } else if (data.url.includes("watch?v=")) {
        extractedId = data.url.split("?v=")[1].split("&")[0];
      } else {
        throw new Error("Invalid YouTube URL format");
      }
      type = "Youtube";
      
      // Try to get video details using the helper function
      videoDetails = await getYouTubeVideoDetails(extractedId);
      if (videoDetails) {
        title = videoDetails.title || null;
        
        // Extract thumbnails
        const thumbnails = extractThumbnails(videoDetails.thumbnail);
        bigThumbnail = thumbnails.bigThumbnail;
        smallThumbnail = thumbnails.smallThumbnail;
        
      }
      
    } else if (isSpotify) {
      const match = data.url.match(/spotify\.com\/track\/([a-zA-Z0-9]{22})/);
      if (match) {
        extractedId = match[1];
      } else {
        throw new Error("Invalid Spotify URL format");
      }
      type = "Spotify";
    } else {
      throw new Error("Unsupported URL format");
    }

    // Check for duplicates with proper typing
    const existingStream = await prismaClient.stream.findFirst({
      where: {
        userId: creatorId,
        extractedId: extractedId,
        active: true
      }
    });

    if (existingStream) {
      return NextResponse.json({
        message: "You have already added this song to the queue"
      }, {
        status: 409 
      });
    }

    // Create stream with proper typing
    const newStream = await prismaClient.stream.create({
      data: {
        userId: creatorId, 
        url: data.url,
        extractedId,
        type,
        title,
        bigThumbnail,
        smallThumbnail
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({
      message: "Stream added successfully",
      stream: {
        id: newStream.id,
        extractedId: newStream.extractedId,
        type: newStream.type,
        url: newStream.url,
        title: newStream.title,
        bigThumbnail: newStream.bigThumbnail,
        smallThumbnail: newStream.smallThumbnail,
        creator: newStream.user
      }
    }, {
      status: 201
    });
    
  } catch (e) {
    console.error("Error adding stream:", e);
    
    if (e instanceof Error) {
      if (e.message.includes("Invalid") || e.message.includes("Unsupported")) {
        return NextResponse.json({
          message: e.message
        }, {
          status: 400 
        });
      }
    }
    
    return NextResponse.json({
      message: "Internal server error while adding stream"
    }, {
      status: 500 
    });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<GetStreamsResponse | ErrorResponse>> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Authentication required. Please log in to view streams."
      }, {
        status: 401 
      });
    }

    const authenticatedUserId: string = session.user.id;

    // Properly typed where clause
    const whereClause: Prisma.StreamWhereInput = {
      userId: authenticatedUserId 
    };

    // Get streams with proper typing
    const streams: StreamWithVotes[] = await prismaClient.stream.findMany({
      where: whereClause,
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
      orderBy: {
        id: 'desc'
      }
    });

    // Process streams with proper typing
    const streamsWithStats: StreamResponse[] = streams.map((stream: StreamWithVotes): StreamResponse => {
      const upvoteCount: number = stream.votes.filter(vote => vote.voteType === VoteType.UPVOTE).length;
      const downvoteCount: number = stream.votes.filter(vote => vote.voteType === VoteType.DOWNVOTE).length;
      const netScore: number = upvoteCount - downvoteCount;

      return {
        id: stream.id,
        type: stream.type,
        active: stream.active,
        url: stream.url,
        extractedId: stream.extractedId,
        title: stream.title,
        bigThumbnail: stream.bigThumbnail,
        smallThumbnail: stream.smallThumbnail,
        creator: stream.user,
        votes: {
          upvoteCount,
          downvoteCount,
          netScore,
          totalVoters: stream.votes.length
        }
      };
    });

    const response: GetStreamsResponse = {
      message: "Streams fetched successfully",
      streams: streamsWithStats,
      totalStreams: streamsWithStats.length
    };

    return NextResponse.json(response, {
      status: 200
    });
    
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json({
      message: "Internal server error while fetching streams"
    }, {
      status: 500 
    });
  }
}