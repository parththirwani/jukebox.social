// data/mockData.ts

import { Song } from "./types";


export const mockQueue: Song[] = [
  {
    id: '1',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg',
    url: 'https://youtube.com/watch?v=JGwWNGJdvx8',
    videoId: 'JGwWNGJdvx8',
    votes: { upvotes: 15, downvotes: 2 },
    duration: '3:53',
    addedBy: 'John Doe'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    thumbnail: 'https://img.youtube.com/vi/4NRXx6U8ABQ/mqdefault.jpg',
    url: 'https://youtube.com/watch?v=4NRXx6U8ABQ',
    videoId: '4NRXx6U8ABQ',
    votes: { upvotes: 12, downvotes: 1 },
    duration: '3:20',
    addedBy: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    thumbnail: 'https://img.youtube.com/vi/orJSJGHjBLI/mqdefault.jpg',
    url: 'https://youtube.com/watch?v=orJSJGHjBLI',
    videoId: 'orJSJGHjBLI',
    votes: { upvotes: 8, downvotes: 3 },
    duration: '3:51',
    addedBy: 'Mike Johnson'
  }
];