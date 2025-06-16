import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Vote } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      title: "Create Your Space",
      description: "Set up public or private rooms where your community can gather and share music together."
    },
    {
      icon: <Music className="w-5 h-5 text-emerald-400" />,
      title: "Social Queuing",
      description: "Paste any song link and let the community decide what plays next through upvotes and downvotes."
    },
    {
      icon: <Vote className="w-5 h-5 text-emerald-400" />,
      title: "Democratic Playlist",
      description: "The most upvoted tracks rise to the top. It's democracy in action, but for your favorite tunes."
    }
  ];

  return (
    <section id="features" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Simple, social, and incredibly fun. Here's how JukeBox.Social transforms music sharing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};