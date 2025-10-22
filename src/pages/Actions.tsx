import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Action {
  id: string;
  title: string;
  link: string;
  description: string;
  button_text: string;
  created_at: string;
}

const Actions = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("actions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "actions",
        },
        () => {
          fetchActions();
          toast.success("Content updated!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from("actions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error("Error fetching actions:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="animate-fade-in space-y-6">
          {actions.map((action) => (
            <div
              key={action.id}
              className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-neon"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {action.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Sponsored</span>
                  <span>•</span>
                  <a
                    href={action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {action.link}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">
                {action.description}
              </p>

              <a
                href={action.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="outline"
                  className="bg-primary/10 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-base rounded-full shadow-neon hover:shadow-neon-strong transition-all duration-300"
                >
                  ▶ {action.button_text}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Actions;
