import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ContentCardProps {
  title: string;
  link: string;
}

const ContentCard = ({ title, link }: ContentCardProps) => {
  return (
    <Link to={link} className="block group">
      <div className="w-full px-6 py-5 bg-white/95 border-4 border-primary rounded-2xl hover:border-primary hover:shadow-neon-strong transition-all duration-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        <ChevronRight className="w-6 h-6 text-gray-900 flex-shrink-0" />
      </div>
    </Link>
  );
};

export default ContentCard;
