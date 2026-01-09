import { Link, useLocation } from "react-router-dom";
import { Pickaxe, ListTodo, Users, Send } from "lucide-react";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: Pickaxe,
      label: "Mine",
      active: location.pathname === "/",
    },
    {
      path: "/tasks",
      icon: ListTodo,
      label: "Tasks",
      active: location.pathname === "/tasks",
    },
    {
      path: "/referrals",
      icon: Users,
      label: "Refer",
      active: location.pathname === "/referrals",
    },
    {
      path: "/withdraw",
      icon: Send,
      label: "Withdraw",
      active: location.pathname === "/withdraw",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 px-4 w-full transition-colors ${
                item.active
                  ? "text-blue-600 border-t-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
