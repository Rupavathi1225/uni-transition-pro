import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ContentCardProps {
  title: string;
  link: string;
}

const ContentCard = ({ title, link }: ContentCardProps) => {
  return (
    <Link to={link} className="block group">
      <Card className="p-6 bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-neon">
        <h3 className="text-lg font-semibold text-center text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      </Card>
    </Link>
  );
};

export default ContentCard;
