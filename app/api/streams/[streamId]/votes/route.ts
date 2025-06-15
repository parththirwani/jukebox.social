// /api/streams/[streamId]/votes/route.ts
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Get vote count (net score)
export async function GET(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const streamId = params.streamId;

    const stream = await prismaClient.stream.findFirst({
      where: { id: streamId }
    });

    if (!stream) {
      return NextResponse.json({
        message: "Stream not found"
      }, { status: 404 });
    }

    // Get upvote and downvote counts
    const upvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "UPVOTE"
      }
    });

    const downvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "DOWNVOTE"
      }
    });

    const netScore = upvoteCount - downvoteCount;

    return NextResponse.json({
      streamId,
      upvoteCount,
      downvoteCount,
      netScore
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching vote count:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}

// POST - Add or update vote
export async function POST(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({
      message: "Unauthenticated"
    }, { status: 403 });
  }

  const userId = session.user.id;
  const streamId = params.streamId;
  
  try {
    const body = await req.json();
    const { voteType } = body; // "UPVOTE" or "DOWNVOTE"

    if (!voteType || !["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      return NextResponse.json({
        message: "Invalid vote type. Must be UPVOTE or DOWNVOTE"
      }, { status: 400 });
    }

    // Check if stream exists
    const stream = await prismaClient.stream.findFirst({
      where: { id: streamId }
    });

    if (!stream) {
      return NextResponse.json({
        message: "Stream not found"
      }, { status: 404 });
    }

    // Check for existing vote
    const existingVote = await prismaClient.vote.findFirst({
      where: {
        userId: userId,
        streamId: streamId
      }
    });

    let action: string;
    let vote;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        return NextResponse.json({
          message: `Already ${voteType.toLowerCase()}d`
        }, { status: 409 });
      }
      
      // Update existing vote (change from upvote to downvote or vice versa)
      vote = await prismaClient.vote.update({
        where: { id: existingVote.id },
        data: { voteType: voteType }
      });
      action = "updated";
    } else {
      // Create new vote
      vote = await prismaClient.vote.create({
        data: {
          userId: userId,
          streamId: streamId,
          voteType: voteType
        }
      });
      action = "added";
    }

    // Get updated counts
    const upvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "UPVOTE"
      }
    });

    const downvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "DOWNVOTE"
      }
    });

    const netScore = upvoteCount - downvoteCount;

    return NextResponse.json({
      message: `Vote ${action} successfully`,
      vote,
      upvoteCount,
      downvoteCount,
      netScore,
      action
    }, { status: action === "added" ? 201 : 200 });

  } catch (error) {
    console.error("Error creating/updating vote:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}

// DELETE - Remove vote  
export async function DELETE(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({
      message: "Unauthenticated"
    }, { status: 403 });
  }

  const userId = session.user.id;
  const streamId = params.streamId;

  try {
    // Check if stream exists
    const stream = await prismaClient.stream.findFirst({
      where: { id: streamId }
    });

    if (!stream) {
      return NextResponse.json({
        message: "Stream not found"
      }, { status: 404 });
    }

    // Find existing vote
    const existingVote = await prismaClient.vote.findFirst({
      where: {
        userId: userId,
        streamId: streamId
      }
    });

    if (!existingVote) {
      return NextResponse.json({
        message: "No vote found to remove"
      }, { status: 404 });
    }

    // Delete vote
    await prismaClient.vote.delete({
      where: { id: existingVote.id }
    });

    // Get updated counts
    const upvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "UPVOTE"
      }
    });

    const downvoteCount = await prismaClient.vote.count({
      where: { 
        streamId: streamId,
        voteType: "DOWNVOTE"
      }
    });

    const netScore = upvoteCount - downvoteCount;

    return NextResponse.json({
      message: "Vote removed successfully",
      upvoteCount,
      downvoteCount,
      netScore,
      action: "removed"
    }, { status: 200 });

  } catch (error) {
    console.error("Error removing vote:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}