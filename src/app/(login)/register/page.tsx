import React from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-block w-2 h-2 bg-foreground rounded-sm mr-2" />
            <Link href="/home" className="hover:underline">Shadow listening</Link>
          </div>
          <Link href="/login" className="rounded-full bg-muted px-5 py-2 text-base font-medium text-foreground hover:bg-muted/80 transition-colors">Log in</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <form className="w-full max-w-md flex flex-col gap-5 mt-8">
          <h1 className="text-3xl font-extrabold text-center mb-2">Sign up for free</h1>
          <input
            type="email"
            placeholder="Email"
            className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <input
            type="text"
            placeholder="Verification Code"
            className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3 text-base hover:bg-primary/90 transition-colors mt-2"
          >
            Sign up
          </button>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-muted-foreground/30" />
            <span className="text-muted-foreground text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-muted-foreground/30" />
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-3 font-semibold text-base text-foreground hover:bg-muted/80 transition-colors border"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
          <div className="text-center text-muted-foreground text-sm mt-2">
            Already have an account? <Link href="/login" className="underline">Log in</Link>
          </div>
        </form>
      </main>
    </div>
  );
} 