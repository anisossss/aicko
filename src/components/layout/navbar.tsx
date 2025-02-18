import { Tv, Film, FolderOpen, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { href: "/tv", label: "TV", icon: Tv },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/shows", label: "Shows", icon: FolderOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navigation() {
  const activePath = window.location.pathname;
  const isActive = (href: string) => activePath === href;
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-center space-x-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }: { isActive: boolean }) =>
              `w-[150px] flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <item.icon className="w-8 h-8 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
