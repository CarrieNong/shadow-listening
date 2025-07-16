import React from "react";
import Link from "next/link";

function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card text-card-foreground p-6 shadow-sm min-w-[220px] flex-1">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-lg mb-1">{title}</div>
      <div className="text-muted-foreground text-sm">{children}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-block w-2 h-2 bg-foreground rounded-sm mr-2" />
            Shadow listening
          </div>
          <div className="flex gap-2">
            <Link href="/list">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get started</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-muted text-foreground hover:bg-muted/80 font-normal">Log in</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4">
        {/* Hero Section */}
        <section className="w-full max-w-4xl mt-12 mb-16 flex flex-col items-center">
          <div className="w-full rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center h-[300px] sm:h-[340px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold text-primary/80 select-none">Shadow Listening</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight">
            Customize, dictate, and proofread <br className="hidden sm:block" /> English materials
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mb-2">
            Shadowfollowing is a SaaS tool that helps you customize, dictate, and proofread English materials for students, teachers, and anyone who wants to improve their English skills.
          </p>
        </section>

        {/* How it works Section */}
        <section className="w-full max-w-5xl mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">How it works</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Shadowfollowing is a SaaS tool that helps you customize, dictate, and proofread English materials. It's perfect for students, teachers, and anyone who wants to improve their English skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Card
              icon={<span className="i-lucide-pencil text-primary" />}
              title="Customize"
            >
              Customize your English materials to fit your needs. You can change the font, size, and color of the text, and you can add images and videos.
            </Card>
            <Card
              icon={<span className="i-lucide-mic text-primary" />}
              title="Dictate"
            >
              Dictate your English materials instead of typing them. This is a great way to save time and improve your pronunciation.
            </Card>
            <Card
              icon={<span className="i-lucide-search text-primary" />}
              title="Proofread"
            >
              Proofread your English materials to make sure they're error-free. Shadowfollowing uses advanced AI to find and correct errors in your writing.
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 text-center text-muted-foreground text-sm mt-auto">
        © 2023 Shadowfollowing. All rights reserved.
      </footer>
    </div>
  );
}
