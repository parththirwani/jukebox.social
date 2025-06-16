import React from 'react';
import { Clock, Users, ExternalLink } from 'lucide-react';
import { VoteButton } from './VoteButton';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  duration: string;
  addedBy: string;
}

interface QueueItemProps {
  song: Song;
  index: number;
  onVote: (songId: string, type: 'upvote' | 'downvote') => void;
  userVotes: Record<string, 'upvote' | 'downvote' | null>;
}

export const QueueItem: React.FC<QueueItemProps> = ({ 
  song, 
  index, 
  onVote, 
  userVotes 
}) => {
  const netScore = song.votes.upvotes - song.votes.downvotes;
  const userVote = userVotes[song.id];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200 shadow-lg">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-full flex items-center justify-center shadow-lg shadow-green-400/25">
          <span className="text-sm font-bold">#{index + 1}</span>
        </div>

        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={song.thumbnail}
            alt={`${song.title} thumbnail`}
            className="w-20 h-15 object-cover rounded-lg border border-gray-700"
          />
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{song.title}</h3>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {song.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {song.addedBy}
            </span>
          </div>

          {/* Voting Controls */}
          <div className="flex items-center gap-3 mt-3">
            <VoteButton
              type="upvote"
              count={song.votes.upvotes}
              onVote={(type) => onVote(song.id, type)}
              userVote={userVote}
            />
            <VoteButton
              type="downvote"
              count={song.votes.downvotes}
              onVote={(type) => onVote(song.id, type)}
              userVote={userVote}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-sm font-medium ${netScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netScore >= 0 ? '+' : ''}{netScore}
              </span>
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};