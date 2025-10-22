import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ContentCard from "@/components/ContentCard";
import { toast } from "sonner";

interface HomepageContent {
  id: string;
  title: string;
  description: string;
  box_1_title: string;
  box_1_link: string;
  box_2_title: string;
  box_2_link: string;
  box_3_title: string;
  box_3_link: string;
  box_4_title: string;
  box_4_link: string;
  box_5_title: string;
  box_5_link: string;
}

const Index = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("homepage-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "homepage_content",
        },
        (payload) => {
          setContent(payload.new as HomepageContent);
          toast.success("Content updated!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
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

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">No content available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
            {content.title}
          </h1>
          <p className="text-lg text-foreground/90 mb-8 text-center leading-relaxed max-w-4xl mx-auto">
            {content.description}
          </p>
          
          <div className="mt-12">
            <div className="inline-block px-4 py-2 bg-white/90 text-gray-700 text-sm font-medium rounded-md mb-6">
              Related searches
            </div>
            <div className="space-y-4 max-w-3xl">
              <ContentCard title={content.box_1_title} link={content.box_1_link} />
              <ContentCard title={content.box_2_title} link={content.box_2_link} />
              <ContentCard title={content.box_3_title} link={content.box_3_link} />
              <ContentCard title={content.box_4_title} link={content.box_4_link} />
              <ContentCard title={content.box_5_title} link={content.box_5_link} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
