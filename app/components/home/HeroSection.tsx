import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          {/* Animated pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-400/30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-emerald-400/20 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-emerald-400/10 rounded-full animate-beat"></div>
          </div>
          
          {/* Main music icon */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-beat-icon">
            <Music className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">
            The Modern Jukebox,
          </span>
          <br />
          <span className="text-emerald-400 text-shadow-neon-emerald animate-neon-pulse">
            Powered by Friends
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed text-shadow-neon-subtle">
          Create rooms, share music, and let your community decide what plays next.
          Democracy meets music in the most social way possible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-neon-emerald hover:shadow-neon-emerald-hover transition-all duration-300"
          >
            Start Your Room
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 hover:text-white px-8 py-6 text-lg rounded-xl shadow-neon-outline hover:shadow-neon-outline-hover transition-all duration-300"
          >
            Explore Rooms
          </Button>
        </div>
      </div>
    </section>
  );
};