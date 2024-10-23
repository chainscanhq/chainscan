import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <div className="flex flex-col gap-4 p-6">
        <div className="w-full max-w-sm min-w-[200px]">
          <input
            type="email"
            className="w-full bg-white placeholder:text-black text-white text-sm border border-slate-200 rounded-md px-12 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Email address"
          />
        </div>

        <div className="w-full max-w-sm min-w-[200px]">
          <input
            type="password"
            className="w-full bg-white placeholder:text-black text-white text-sm border border-slate-200 rounded-md px-12 sm:px-12 md:px-12 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Password"
          />
        </div>
      </div>

      <div className="p-12 pt-0">
        <button
          className="w-full rounded-full bg-bgreen py-2 px-4 border border-white text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Log In
        </button>
        <p className="flex justify-center mt-6 text-sm text-white">
          Don&apos;t have an account?
          <Link
            to="/signup"
            className="ml-1 text-sm font-semibold text-black underline"
          >
            Sign up
          </Link>
        </p>
        <button
          className="w-full rounded-md py-2 px-4 border border-bgreen text-center text-sm text-bgreen transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

export default Login;
