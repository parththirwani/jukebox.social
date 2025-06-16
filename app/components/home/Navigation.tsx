"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();

  return (
    <nav className="relative z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            JukeBox.Social
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Features
          </a>
          <a 
            href="#coming-soon" 
            className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('coming-soon')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Coming Soon
          </a>
          
          {session.data?.user ? (
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          ) : (
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-card mt-2 mx-4 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
                setIsMenuOpen(false);
              }}
            >
              Features
            </a>
            <a 
              href="#coming-soon" 
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('coming-soon')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
                setIsMenuOpen(false);
              }}
            >
              Coming Soon
            </a>
            
            {session.data?.user ? (
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 w-full"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 w-full"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};