import { GraduationCap } from "lucide-react";

const currentYear = new Date().getFullYear();

const AuthLayout = ({ children }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <GraduationCap size={27} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            EduNest
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your journey to knowledge starts here.
          </p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-slate-400">
          © {currentYear} EduNest. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
