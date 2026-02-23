"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  ArrowLeft,
  GitCommit,
  GitPullRequest,
  GitMerge,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GitPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/smart-hub"
            className="inline-flex items-center text-slate-500 hover:text-orange-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Smart Hub
          </Link>
        </motion.div>

        {/* Hero */}
        <section className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-200 shadow-xl shadow-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <GitBranch className="w-3.5 h-3.5" /> Git Mastery
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Làm chủ <br />{" "}
                <span className="text-orange-600">Git & GitHub</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                Tự tin làm việc trong các dự án thực tế. Học cách quản lý phiên
                bản, xử lý xung đột và quy trình Pull Request chuyên nghiệp.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-orange-600/20">
                  Lộ trình học Git <GitPullRequest className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6 rounded-2xl text-lg font-bold border-slate-200 hover:bg-slate-50"
                >
                  Cẩm nang lệnh Git
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Visual representation of a Git Graph or something similar */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-sm">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2 text-slate-300">
                  <p className="text-blue-400">$ git checkout -b feature/hub</p>
                  <p className="text-slate-500 italic">
                    Switched to a new branch 'feature/hub'
                  </p>
                  <p className="text-blue-400">$ git add .</p>
                  <p className="text-blue-400">
                    $ git commit -m "feat: init smart hub"
                  </p>
                  <p className="text-emerald-400">
                    [feature/hub 1a2b3c4] feat: init smart hub
                  </p>
                  <p className="text-blue-400">$ git push origin feature/hub</p>
                </div>
              </div>

              {/* Overlapping icons */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 p-4 bg-white rounded-2xl shadow-xl border border-slate-100"
              >
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <GitCommit className="w-6 h-6 text-orange-500" />,
              title: "Cơ bản về Git",
              desc: "Init, Add, Commit, Push, Pull và quy trình làm việc Local-Remote.",
            },
            {
              icon: <GitMerge className="w-6 h-6 text-purple-500" />,
              title: "Branching & Merging",
              desc: "Làm chủ các nhành và cách giải quyết Merge Conflicts một cách bình tĩnh.",
            },
          ].map((module, i) => (
            <div
              key={i}
              className="flex gap-6 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-orange-200 transition-colors"
            >
              <div className="shrink-0">{module.icon}</div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">{module.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {module.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitPage;
