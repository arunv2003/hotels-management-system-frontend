import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Step11Success() {
  return (
    <motion.div
      key="success"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center text-center py-32"
    >
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 mb-10">
        <Check className="w-12 h-12 stroke-[4px]" />
      </div>
      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
        Congratulations!
      </h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-12">
        Your hotel account has been created successfully. Welcome to HotelFlow!
        Let&apos;s grow your business together.
      </p>
      <Link href="/admin">
        <Button
          type="button"
          className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black shadow-2xl shadow-indigo-500/40 text-white"
        >
          Go to Dashboard <ArrowRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
    </motion.div>
  );
}
