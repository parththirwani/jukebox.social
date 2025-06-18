"use client"

import React, { useEffect, useState } from 'react';
import { VideoInput } from '@/app/components/Stream-music/VideoInput';
import { VideoPlayer } from '@/app/components/Stream-music/VideoPlayer';
import { QueueList } from '@/app/components/Stream-music/QueueList';
import { mockQueue } from '../components/Stream-music/mock-data';
import { Song, UserVotes } from '../components/Stream-music/types';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const REFRESH_INTERVAL_MS= 10*1000;

const StreamsPage: React.FC = () => {
  const [queue, setQueue] = useState<Song[]>(mockQueue);
  const [currentSong, setCurrentSong] = useState<Song | null>(mockQueue[0]);
  const [userVotes, setUserVotes] = useState<UserVotes>({});

async function refreshStreams() {
  const response = await axios.get("/api/streams");
  console.log("Reponse returneed by fe is",response.data.streams)
}

useEffect(() => {
  refreshStreams();

  const interval = setInterval(() => {
    refreshStreams(); 
  }, REFRESH_INTERVAL_MS);

  return () => clearInterval(interval);
}, []);


  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddVideo = (url: string) => {
    const videoId = extractVideoId(url);
    const newSong: Song = {
      id: Date.now().toString(),
      title: 'New Song',
      artist: 'New Artist',
      thumbnail: `https://img.youtube.com/vi/${videoId || 'dQw4w9WgXcQ'}/mqdefault.jpg`,
      url,
      videoId: videoId || 'dQw4w9WgXcQ',
      votes: { upvotes: 0, downvotes: 0 },
      duration: '3:30',
      addedBy: 'You'
    };
    setQueue(prev => [...prev, newSong]);
  };

  const handleVote = (songId: string, voteType: 'upvote' | 'downvote') => {
    const currentVote = userVotes[songId];
    
    setUserVotes(prev => ({
      ...prev,
      [songId]: currentVote === voteType ? null : voteType
    }));

    setQueue(prev => prev.map(song => {
      if (song.id === songId) {
        const votes = { ...song.votes };
        
        if (currentVote === 'upvote') votes.upvotes -= 1;
        if (currentVote === 'downvote') votes.downvotes -= 1;
        
        if (currentVote !== voteType) {
          if (voteType === 'upvote') votes.upvotes += 1;
          if (voteType === 'downvote') votes.downvotes += 1;
        }
        
        return { ...song, votes };
      }
      return song;
    }));
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const nextSong = queue[currentIndex + 1];
    if (nextSong) {
      setCurrentSong(nextSong);
    }
  };

  const handlePrevious = () => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const previousSong = queue[currentIndex - 1];
    if (previousSong) {
      setCurrentSong(previousSong);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Music Voting <span className="text-green-400">Dashboard</span>
          </h1>
          <p className="text-gray-400">Vote for the next song and add your favorites to the queue!</p>
        </header>

        <VideoPlayer 
          currentSong={currentSong}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VideoInput onAddVideo={handleAddVideo} />
          </div>
          
          <div className="lg:col-span-2">
            <QueueList 
              songs={queue} 
              onVote={handleVote}
              userVotes={userVotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;