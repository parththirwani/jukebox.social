import { Music } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="px-4 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              JukeBox.Social
            </span>
          </div>
          <p className="text-slate-400 text-center md:text-right">
            © 2024 JukeBox.Social. Building the future of social music.
          </p>
        </div>
      </div>
    </footer>
  );
};