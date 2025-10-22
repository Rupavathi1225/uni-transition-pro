import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PlaceholderPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-8 py-12">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Page {id?.replace("page", "")}
          </h1>
          <p className="text-lg text-muted-foreground">
            This is a placeholder page. Content coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
