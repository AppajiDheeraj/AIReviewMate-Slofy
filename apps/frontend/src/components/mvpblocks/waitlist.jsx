"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Code, Star, Cpu, GalleryVerticalEnd } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { Spotlight } from "@/components/ui/spotlight";
import { useTheme } from "next-themes";
import { Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";

const brico = Bricolage_Grotesque({
  subsets: ["latin"],
});

// Sample waitlist avatars
const users = [
  { imgUrl: "https://avatars.githubusercontent.com/u/111780029" },
  { imgUrl: "https://avatars.githubusercontent.com/u/123104247" },
  { imgUrl: "https://avatars.githubusercontent.com/u/115650165" },
  { imgUrl: "https://avatars.githubusercontent.com/u/71373838" },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#00b4d8"); // soft blue

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#7dd3fc" : "#2563eb");
  }, [resolvedTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="relative flex  w-full items-center justify-center overflow-hidden ">
      <Spotlight />

      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        refresh
        color={color}
      />

      <div className="relative z-[100] mx-auto max-w-2xl px-4 py-16 text-center">
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-primary/10 from-blue-400/15 to-indigo-500/5 mb-8 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 backdrop-blur-sm"
        >
          <GalleryVerticalEnd className="size-4" />
          <span className="text-sm font-medium">AIReviewMate</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowRight className="h-4 w-4 text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            "from-blue-400 via-indigo-300 to-blue-600 mb-4 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-7xl",
            brico.className
          )}
        >
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Waitlist</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-muted-foreground mt-2 mb-12 sm:text-lg"
        >
          Be among the first to test our AI-powered code reviewer.  
          Real-time suggestions, smart diffs, and GitHub PR automation.
        </motion.p>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
        >
          <Feature icon={Code} title="Instant Reviews" desc="LLM feedback in seconds" />
          <Feature icon={Cpu} title="Smart Diff" desc="AI understands context" />
          <Feature icon={Star} title="Developer First" desc="Built for modern teams" />
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col gap-4 sm:flex-row"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <>
                <div className="relative flex-1">
                  <motion.input
                    key="email-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-blue-500/20 placeholder:text-muted-foreground/70 focus:border-blue-400/50 focus:ring-blue-300/30 w-full rounded-xl border bg-white/5 px-6 py-4 backdrop-blur-md transition-all focus:ring-2 focus:outline-none text-foreground"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-destructive/40 bg-destructive/10 text-destructive mt-2 rounded-xl border px-4 py-1 text-sm sm:absolute"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                    <Sparkles className="h-4 w-4 text-white transition-all duration-300 group-hover:rotate-12" />
                  </span>
                </button>
              </>
            ) : (
              <motion.div
                key="thank-you-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="flex-1 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-indigo-500/10 px-6 py-4 font-medium text-blue-400 backdrop-blur-md"
              >
                <span className="flex items-center justify-center gap-2">
                  Thanks for joining the future of code reviews!
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-10 flex items-center justify-center gap-1"
        >
          <div className="flex -space-x-3">
            {users.map((user, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
                className="border-background from-blue-400 to-indigo-500 size-10 rounded-full border-1 bg-gradient-to-r p-[1px]"
              >
                <div className="overflow-hidden rounded-full">
                  <img
                    src={user.imgUrl}
                    alt="Avatar"
                    className="rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6"
                    width={40}
                    height={40}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-muted-foreground ml-2"
          >
            <span className="text-blue-500 font-semibold">100+</span> developers already joined 🚀
          </motion.span>
        </motion.div>
      </div>
    </main>
  );
}

// Small reusable Feature card
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-blue-500/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-blue-500/5 hover:shadow-md">
      <Icon className="text-blue-400 mb-2 h-5 w-5" />
      <span className="text-xl font-bold text-blue-300">{title}</span>
      <span className="text-muted-foreground text-xs">{desc}</span>
    </div>
  );
}
