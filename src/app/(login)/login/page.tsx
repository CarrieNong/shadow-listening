import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center py-4 px-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-block w-2 h-2 bg-foreground rounded-sm mr-2" />
            <Link href="/home" className="hover:underline">Shadow listening</Link>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <form className="w-full max-w-md flex flex-col gap-6 mt-8">
          <h1 className="text-3xl font-extrabold text-center mb-2">Log in to Clarity</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
              required
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-muted-foreground hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3 text-base hover:bg-primary/90 transition-colors mt-2"
          >
            Log in
          </button>
          <div className="text-center text-muted-foreground text-sm mt-2">
            Don't have an account? <Link href="/register" className="underline">Sign up</Link>
          </div>
        </form>
      </main>
    </div>
  );
} 