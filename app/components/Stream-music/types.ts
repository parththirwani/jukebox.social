// types/music.ts

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  videoId: string;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  duration: string;
  addedBy: string;
}

export interface UserVotes {
  [songId: string]: 'upvote' | 'downvote' | null;
}

export interface VideoPreview {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
}

export type VoteType = 'upvote' | 'downvote';