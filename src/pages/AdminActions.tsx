import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Home, FileText, LogOut } from "lucide-react";
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
import { NavLink } from "react-router-dom";

interface Action {
  id: string;
  title: string;
  link: string;
  description: string;
  button_text: string;
}

const AdminActions = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    button_text: "Visit Website",
  });

  useEffect(() => {
    checkAuth();
    fetchActions();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

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
      toast.error("Failed to load actions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAction) {
        const { error } = await supabase
          .from("actions")
          .update(formData)
          .eq("id", editingAction.id);

        if (error) throw error;
        toast.success("Action updated successfully");
      } else {
        const { error } = await supabase.from("actions").insert([formData]);

        if (error) throw error;
        toast.success("Action created successfully");
      }

      setIsDialogOpen(false);
      setEditingAction(null);
      setFormData({ title: "", link: "", description: "", button_text: "Visit Website" });
      fetchActions();
    } catch (error) {
      console.error("Error saving action:", error);
      toast.error("Failed to save action");
    }
  };

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setFormData({
      title: action.title,
      link: action.link,
      description: action.description,
      button_text: action.button_text,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this action?")) return;

    try {
      const { error } = await supabase.from("actions").delete().eq("id", id);

      if (error) throw error;
      toast.success("Action deleted successfully");
      fetchActions();
    } catch (error) {
      console.error("Error deleting action:", error);
      toast.error("Failed to delete action");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAction(null);
    setFormData({ title: "", link: "", description: "", button_text: "Visit Website" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
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
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Manage Actions</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingAction(null);
                      setFormData({
                        title: "",
                        link: "",
                        description: "",
                        button_text: "Visit Website",
                      });
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Action
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAction ? "Edit Action" : "Add New Action"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">Link</Label>
                      <Input
                        id="link"
                        type="url"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="button_text">Button Text</Label>
                      <Input
                        id="button_text"
                        value={formData.button_text}
                        onChange={(e) =>
                          setFormData({ ...formData, button_text: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDialogClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingAction ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Button Text</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium">{action.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={action.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {action.link}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {action.description}
                      </TableCell>
                      <TableCell>{action.button_text}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(action)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(action.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminActions;
