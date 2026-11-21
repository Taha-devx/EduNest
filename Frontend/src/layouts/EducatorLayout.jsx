
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  LogOut,
  PlusCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    path: "/educator/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    path: "/educator/courses",
    icon: BookOpen,
  },
];

const EducatorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap size={22} />
          </div>

          <span className="text-xl font-bold text-slate-900">
            EduNest
          </span>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Educator Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}

          <NavLink
            to="/educator/courses/new"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <PlusCircle size={19} />
            Create Course
          </NavLink>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 px-2">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.username || "Educator"}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default EducatorLayout;
