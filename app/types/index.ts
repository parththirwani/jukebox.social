import { z } from "zod";
import { Prisma, StreamType, VoteType } from "@/app/generated/prisma";

// Zod Schemas for API validation
export const CreateUserSchema = z.object({
  url: z.string()
});

export const UpvoteSchema = z.object({
  streamId: z.string()
});

export const VoteSchema = z.object({
  voteType: z.enum(["UPVOTE", "DOWNVOTE"])
});

// Infer types from Zod schemas
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpvoteRequest = z.infer<typeof UpvoteSchema>;
export type VoteRequest = z.infer<typeof VoteSchema>;

// Prisma payload types for complex queries
export type StreamWithVotes = Prisma.StreamGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
      };
    };
    votes: {
      select: {
        id: true;
        voteType: true;
        userId: true;
      };
    };
  };
}>;

export type StreamWithUser = Prisma.StreamGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
      };
    };
  };
}>;

export type VoteWithUser = Prisma.VoteGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
      };
    };
  };
}>;

// API Response Types
export type StreamResponse = {
  id: string;
  type: StreamType;
  active: boolean;
  url: string;
  extractedId: string;
  bigThumbnail: string | null,
  smallThumbnail: string | null,
  title: string | null,
  creator: {
    id: string;
    email: string;
  };
  votes: {
    upvoteCount: number;
    downvoteCount: number;
    netScore: number;
    totalVoters: number;
  };
};

export type CreateStreamResponse = {
  message: string;
  stream: {
    id: string;
    extractedId: string;
    type: StreamType;
    url: string;
    creator: {
      id: string;
      email: string;
    };
  };
};

export type GetStreamsResponse = {
  message: string;
  streams: StreamResponse[];
  totalStreams: number;
};

export type VoteResponse = {
  streamId: string;
  upvoteCount: number;
  downvoteCount: number;
  netScore: number;
  currentUserVote?: VoteType | null;
  totalVoters: number;
};

export type CreateVoteResponse = {
  message: string;
  vote: {
    id: string;
    voteType: VoteType;
  };
  upvoteCount: number;
  downvoteCount: number;
  netScore: number;
  action: "added" | "updated";
};

export type DeleteVoteResponse = {
  message: string;
  upvoteCount: number;
  downvoteCount: number;
  netScore: number;
  action: "removed";
};

// Error Response Type
export type ErrorResponse = {
  message: string;
  error?: string;
};

// User types (for session/auth)
export type UserSession = {
  id: string;
  email: string;
};

// Stream creation data (internal use)
export type StreamCreateData = {
  userId: string;
  url: string;
  extractedId: string;
  type: StreamType;
};

// Vote creation data (internal use)
export type VoteCreateData = {
  userId: string;
  streamId: string;
  voteType: VoteType;
};

// Query filter types
export type StreamFilters = {
  active?: boolean;
  type?: StreamType;
  userId?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: "netScore" | "upvotes" | "createdAt";
  order?: "asc" | "desc";
};

// Re-export Prisma enums for convenience
export { StreamType, VoteType } from "@/app/generated/prisma";