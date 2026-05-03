"use client";

import { useEffect, useRef } from "react";
import { Bot, Zap, ShieldCheck, Code2, Globe2, ArrowRight, Mail } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";

// Mock Data for the Developer / Team Section
const teamMembers = [
  {
    id: 1,
    name: "Samiur Rahman Wasee",
    role: "Founder & Full-Stack Developer",
    bio: "Next.js and TypeScript specialist based in Chittagong. Passionate about building highly scalable web architectures and mentoring aspiring software developers.",
    initials: "SW",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Sazidul Islam Hira",
    role: "Co-Founder & AI Researcher",
    bio: "Specializes in advanced Machine Learning, Federated Learning, and Deepfake detection. Ensures all marketplace prompts are rigorously tested against state-of-the-art models.",
    initials: "SH",
    color: "from-emerald-500 to-teal-500"
  }
];

const stats = [
  { label: "Active Prompts", num: 10000, suffix: "+" },
  { label: "AI Engineers", num: 2500, suffix: "+" },
  { label: "Lines of Code", num: 150, suffix: "k+" },
  { label: "Service Outages", num: 0, suffix: "" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + suffix);

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [count, value, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 uppercase tracking-wider mb-6 inline-block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Empowering the <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                AI Generation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              PromptForge is the premier marketplace for high-quality, tested AI prompts. We bridge the gap between AI engineers and everyday users, making advanced machine learning interactions accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-y border-slate-800 bg-slate-900/20 mb-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  <AnimatedCounter value={stat.num} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES / FEATURES */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Built on Core Values</h2>
          <p className="text-slate-400">The principles that drive our marketplace architecture.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center hover:bg-slate-900/60 transition-colors">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_-3px_rgba(37,99,235,0.2)]">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Model Agnostic</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Whether you use ChatGPT, Midjourney, or specialized local models, our prompts are tailored to extract maximum potential across any neural network architecture.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center hover:bg-slate-900/60 transition-colors">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Quality</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Every prompt is peer-reviewed and tested. We implement strict multi-label categorization and vulnerability checks to ensure you buy results, not guesswork.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center hover:bg-slate-900/60 transition-colors">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Access</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Powered by a highly optimized backend, secure your prompts through Stripe and access your unlocked instructions instantly in your personal dashboard.</p>
          </div>
        </div>
      </section>

      {/* 4. MEET THE DEVELOPERS */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Meet the Engineers</h2>
            <p className="text-slate-400 max-w-xl">Built by researchers and full-stack developers dedicated to advancing the accessibility of machine learning tools.</p>
          </div>
          <Link href="/contact" className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
            Get in touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Avatar Placeholder */}
              <div className={`w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                {member.initials}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 text-sm font-bold mb-4 uppercase tracking-wider">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
                
                {/* Social Links Mock */}
                {/* Social Links Mock */}
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <Code2 className="w-4 h-4" /> {/* ✨ Replaced Github */}
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <Globe2 className="w-4 h-4" /> {/* ✨ Replaced Linkedin */}
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. TECH STACK FOOTER */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Built With Modern Technologies</p>
        <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="px-4 py-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm border border-slate-800">Next.js 14</span>
          <span className="px-4 py-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm border border-slate-800">TypeScript</span>
          <span className="px-4 py-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm border border-slate-800">Tailwind CSS</span>
          <span className="px-4 py-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm border border-slate-800">Prisma ORM</span>
          <span className="px-4 py-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm border border-slate-800">Stripe Integration</span>
        </div>
      </section>

    </div>
  );
}