import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface VoteButtonProps {
  type: 'upvote' | 'downvote';
  count: number;
  onVote: (type: 'upvote' | 'downvote') => void;
  userVote?: 'upvote' | 'downvote' | null;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ type, count, onVote, userVote }) => {
  const isUpvote = type === 'upvote';
  const Icon = isUpvote ? ChevronUp : ChevronDown;
  const isActive = userVote === type;
  
  const baseClasses = "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border";
  const activeClasses = isUpvote 
    ? "bg-green-400 text-black border-green-400 shadow-lg shadow-green-400/25" 
    : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25";
  const inactiveClasses = "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500";
  
  return (
    <button
      onClick={() => onVote(type)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-4 h-4" />
      <span>{count}</span>
    </button>
  );
};