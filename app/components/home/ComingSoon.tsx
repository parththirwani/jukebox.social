import { Card, CardContent } from "@/components/ui/card";

import { Badge, Crown, Gamepad2, Radio } from "lucide-react";

export const ComingSoonSection = () => {
  const comingSoonFeatures = [
    {
      icon: <Crown className="w-5 h-5 text-yellow-400" />,
      title: "Priority Play",
      description: "Pay to skip the queue with Razorpay integration",
      badge: "Coming Soon"
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      title: "Songless Integration",
      description: "Guess the song games powered by lessgames.com",
      badge: "Coming Soon"
    },
    {
      icon: <Radio className="w-5 h-5 text-red-400" />,
      title: "Stream Integration",
      description: "Connect with Twitch, Kick, and YouTube streams",
      badge: "Coming Soon"
    }
  ];

  return (
    <section id="coming-soon" className="px-4 py-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
            Coming Soon
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Next-Level Features
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We're building the future of social music. Here's what's coming next.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {comingSoonFeatures.map((feature, index) => (
            <Card key={index} className="glass-card border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden opacity-75">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1">
                  {feature.badge}
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300 opacity-75">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
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