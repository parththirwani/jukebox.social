// app/lib/streamHelpers.ts

import { prismaClient } from "@/app/lib/db";
import { SPOTIFY_REGEX, YT_REGEX } from "@/app/regex";
import { StreamType, VoteType, StreamWithVotes, StreamResponse } from "@/app/types";

// Use CommonJS require - ES6 import returns undefined
const youtubesearchapi = require("youtube-search-api");

// YouTube API types
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

export interface ExtractedStreamData {
  extractedId: string;
  type: StreamType;
  title: string | null;
  bigThumbnail: string | null;
  smallThumbnail: string | null;
}

export interface UrlValidation {
  isValid: boolean;
  isYt: boolean;
  isSpotify: boolean;
}

/**
 * Validates if URL is supported (YouTube or Spotify)
 */
export function validateUrl(url: string): UrlValidation {
  const isYt = YT_REGEX.test(url);
  const isSpotify = SPOTIFY_REGEX.test(url);
  return {
    isValid: isYt || isSpotify,
    isYt,
    isSpotify
  };
}

/**
 * Extracts video ID from YouTube URL
 */
export function extractYouTubeId(url: string): string {
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    return url.split("?v=")[1].split("&")[0];
  } else {
    throw new Error("Invalid YouTube URL format");
  }
}

/**
 * Extracts track ID from Spotify URL
 */
export function extractSpotifyId(url: string): string {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]{22})/);
  if (match) {
    return match[1];
  } else {
    throw new Error("Invalid Spotify URL format");
  }
}

/**
 * Safely fetches YouTube video details
 */
export async function getYouTubeVideoDetails(videoId: string): Promise<VideoDetails | null> {
  try {
    const details = await youtubesearchapi.GetVideoDetails(videoId);
    console.log(details)
    return details;
  } catch (error) {
    console.error("Error fetching YouTube video details:", error);
    return null;
  }
}

/**
 * Extracts last two thumbnails from YouTube API response
 */
export function extractThumbnails(thumbnailData: any): { bigThumbnail: string | null; smallThumbnail: string | null } {
  if (!thumbnailData?.thumbnails || !Array.isArray(thumbnailData.thumbnails) || thumbnailData.thumbnails.length === 0) {
    return { bigThumbnail: null, smallThumbnail: null };
  }

  const thumbnails = thumbnailData.thumbnails;
  const length = thumbnails.length;

  return {
    bigThumbnail: length > 0 ? thumbnails[length - 1]?.url || null : null,
    smallThumbnail: length > 1 ? thumbnails[length - 2]?.url || null : null
  };
}

/**
 * Processes URL and extracts all necessary data
 */
export async function extractStreamData(url: string): Promise<ExtractedStreamData> {
  const { isValid, isYt, isSpotify } = validateUrl(url);
  
  if (!isValid) {
    throw new Error("Link is not correct should be a spotify or yt link");
  }

  let extractedId: string;
  let type: StreamType;
  let title: string | null = null;
  let bigThumbnail: string | null = null;
  let smallThumbnail: string | null = null;

  if (isYt) {
    extractedId = extractYouTubeId(url);
    type = "Youtube";
    
    const videoDetails = await getYouTubeVideoDetails(extractedId);
    if (videoDetails) {
      title = videoDetails.title || null;
      const thumbnails = extractThumbnails(videoDetails.thumbnail);
      bigThumbnail = thumbnails.bigThumbnail;
      smallThumbnail = thumbnails.smallThumbnail;
    }
  } else if (isSpotify) {
    extractedId = extractSpotifyId(url);
    type = "Spotify";
  } else {
    throw new Error("Unsupported URL format");
  }

  return { extractedId, type, title, bigThumbnail, smallThumbnail };
}

/**
 * Checks if stream already exists for user
 */
export async function checkDuplicateStream(userId: string, extractedId: string): Promise<boolean> {
  const existingStream = await prismaClient.stream.findFirst({
    where: {
      userId,
      extractedId,
      active: true
    }
  });
  return !!existingStream;
}

/**
 * Creates new stream in database
 */
export async function createStream(userId: string, url: string, streamData: ExtractedStreamData) {
  return await prismaClient.stream.create({
    data: {
      userId,
      url,
      extractedId: streamData.extractedId,
      type: streamData.type,
      title: streamData.title,
      bigThumbnail: streamData.bigThumbnail,
      smallThumbnail: streamData.smallThumbnail
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
}

/**
 * Transforms stream data for API response
 */
export function transformStreamResponse(stream: any) {
  return {
    id: stream.id,
    extractedId: stream.extractedId,
    type: stream.type,
    url: stream.url,
    title: stream.title,
    bigThumbnail: stream.bigThumbnail,
    smallThumbnail: stream.smallThumbnail,
    creator: stream.user
  };
}

/**
 * Calculates vote statistics for streams
 */
export function calculateVoteStats(votes: any[]) {
  const upvoteCount = votes.filter(vote => vote.voteType === VoteType.UPVOTE).length;
  const downvoteCount = votes.filter(vote => vote.voteType === VoteType.DOWNVOTE).length;
  
  return {
    upvoteCount,
    downvoteCount,
    netScore: upvoteCount - downvoteCount,
    totalVoters: votes.length
  };
}

/**
 * Transforms stream with votes for GET response
 */
export function transformStreamWithVotes(stream: StreamWithVotes): StreamResponse {
  const voteStats = calculateVoteStats(stream.votes);
  
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
    votes: voteStats
  };
}