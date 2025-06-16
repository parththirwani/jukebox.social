import React from 'react';
import { Music } from 'lucide-react';
import { QueueItem } from './QueueItem';

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

interface QueueListProps {
  songs: Song[];
  onVote: (songId: string, type: 'upvote' | 'downvote') => void;
  userVotes: Record<string, 'upvote' | 'downvote' | null>;
}

export const QueueList: React.FC<QueueListProps> = ({ songs, onVote, userVotes }) => {
  if (songs.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center shadow-lg">
        <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Queue is Empty</h3>
        <p className="text-gray-500">Add some songs to get the party started!</p>
      </div>
    );
  }

  const sortedSongs = [...songs].sort((a, b) => {
    const scoreA = a.votes.upvotes - a.votes.downvotes;
    const scoreB = b.votes.upvotes - b.votes.downvotes;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <Music className="w-5 h-5 text-green-400" />
        Song Queue ({songs.length})
      </h2>
      {sortedSongs.map((song, index) => (
        <QueueItem
          key={song.id}
          song={song}
          index={index}
          onVote={onVote}
          userVotes={userVotes}
        />
      ))}
    </div>
  );
};