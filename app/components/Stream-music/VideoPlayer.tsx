"use client"

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack, Music } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  addedBy: string;
}

interface VideoPlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  currentSong, 
  onNext, 
  onPrevious 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(233); // 3:53 in seconds

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  if (!currentSong) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-2xl p-8 mb-6">
        <div className="text-center">
          <div className="w-32 h-24 bg-gray-800 border border-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Music className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">No Song Playing</h2>
          <p className="text-gray-400">Add some songs to the queue to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-2xl p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video/Thumbnail Section */}
        <div className="flex-shrink-0">
          <div className="relative w-full lg:w-80 h-48 bg-black rounded-lg overflow-hidden border border-gray-700">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1&controls=0&modestbranding=1`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={currentSong.thumbnail}
                  alt={`${currentSong.title} thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 bg-green-400 text-black rounded-full flex items-center justify-center hover:bg-green-300 transition-colors shadow-lg shadow-green-400/25"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1 text-white truncate">{currentSong.title}</h2>
            <p className="text-gray-400 mb-2 truncate">{currentSong.artist}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{currentSong.duration}</span>
              <span>•</span>
              <span>Added by {currentSong.addedBy}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2 cursor-pointer">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 rounded-full h-2 transition-all duration-1000 shadow-lg shadow-green-400/25"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onPrevious}
                className="w-10 h-10 bg-gray-800 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-green-400 text-black rounded-full flex items-center justify-center hover:bg-green-300 transition-colors shadow-lg shadow-green-400/25"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
              
              <button 
                onClick={onNext}
                className="w-10 h-10 bg-gray-800 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-green-400"
              />
              <span className="text-sm text-gray-400 w-8">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};