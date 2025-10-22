import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="w-full py-6 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Top<span className="relative">
            College
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
          </span>
        </Link>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Search className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
