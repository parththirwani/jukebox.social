import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card rounded-2xl p-12 border-emerald-500/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Ready to Start the Party?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and music lovers who are already using JukeBox.Social to power their communities.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all">
            Get Early Access
          </Button>
        </div>
      </div>
    </section>
  );
};