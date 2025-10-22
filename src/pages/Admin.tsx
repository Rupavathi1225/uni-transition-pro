import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Home, FileText, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface ContentForm {
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

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ContentForm | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await fetchContent();
  };

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("homepage_content")
        .update({
          title: content.title,
          description: content.description,
          box_1_title: content.box_1_title,
          box_1_link: content.box_1_link,
          box_2_title: content.box_2_title,
          box_2_link: content.box_2_link,
          box_3_title: content.box_3_title,
          box_3_link: content.box_3_link,
          box_4_title: content.box_4_title,
          box_4_link: content.box_4_link,
          box_5_title: content.box_5_title,
          box_5_link: content.box_5_link,
          updated_at: new Date().toISOString(),
        })
        .eq("id", content.id);

      if (error) throw error;
      toast.success("Content updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update content");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Logged out successfully");
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
        <div className="text-foreground text-xl">No content found</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-primary text-lg font-bold px-4 py-4">
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-muted"
                        }
                      >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-muted"
                        }
                      >
                        <FileText className="w-4 h-4" />
                        <span>Content Page</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/admin/actions"
                        className={({ isActive }) =>
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-muted"
                        }
                      >
                        <FileText className="w-4 h-4" />
                        <span>Action Page</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/20 hover:text-destructive">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Content Page Manager</h1>

            <Card className="bg-card border-2 border-border">
              <CardHeader>
                <CardTitle>Edit Homepage Content</CardTitle>
                <CardDescription>Update the main page content and related search boxes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Main Title</Label>
                    <Input
                      id="title"
                      value={content.title}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={content.description}
                      onChange={(e) => setContent({ ...content, description: e.target.value })}
                      required
                      rows={4}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Related Search Boxes</h3>
                    
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="p-4 border border-border rounded-lg space-y-2">
                        <Label htmlFor={`box${num}-title`}>Box {num} Title</Label>
                        <Input
                          id={`box${num}-title`}
                          value={content[`box_${num}_title` as keyof ContentForm] as string}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              [`box_${num}_title`]: e.target.value,
                            })
                          }
                          required
                          className="bg-background border-border"
                        />
                        <Label htmlFor={`box${num}-link`}>Box {num} Link</Label>
                        <Input
                          id={`box${num}-link`}
                          value={content[`box_${num}_link` as keyof ContentForm] as string}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              [`box_${num}_link`]: e.target.value,
                            })
                          }
                          required
                          placeholder="/page1"
                          className="bg-background border-border"
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
