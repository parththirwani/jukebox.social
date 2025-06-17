"use client"

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface VideoInputProps {
  onAddVideo: (url: string) => void;
}

interface VideoPreview {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
}

export const VideoInput: React.FC<VideoInputProps> = ({ onAddVideo }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<VideoPreview | null>(null);

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = async (value: string) => {
    setUrl(value);
    const videoId = extractVideoId(value);
    
    if (videoId) {
      setPreview({
        id: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        title: 'Loading...',
        artist: 'Loading...'
      });
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAddVideo(url);
      setUrl('');
      setPreview(null);
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 shadow-2xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <Plus className="w-5 h-5 text-green-400" />
        Add a Song to Queue
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-2">
            YouTube Video URL
          </label>
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-400 transition-all"
          />
        </div>

        {preview && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Preview:</h3>
            <div className="flex items-center gap-3">
              <img
                src={preview.thumbnail}
                alt="Video thumbnail"
                className="w-16 h-12 object-cover rounded border border-gray-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{preview.title}</p>
                <p className="text-sm text-gray-400 truncate">{preview.artist}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim()}
          className="w-full bg-gradient-to-r from-green-400 to-green-500 text-black py-3 px-4 rounded-lg hover:from-green-300 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
        >
          {isLoading ? 'Adding...' : 'Add to Queue'}
        </button>
      </div>
    </div>
  );
};