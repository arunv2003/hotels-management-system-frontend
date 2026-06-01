"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hotel, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { superAdminRouted } from "@/routes/saas/auth/superadminlogin";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/ToastProvider";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";
export default function LoginPage() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { notify } = useToast();
    const login = useAuthStore((state) => state.login);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await superAdminRouted.loginSuperadmin(data);
            console.log("Login Response:", res);
            Cookies.set("accessToken", res?.data.accessToken, { expires: 1}); 
            Cookies.set("refreshToken", res?.data.refreshToken, { expires: 7 });
            login(res);
            notify("Signed in successfully", "success");
            router.push("/super-admin");
        }
        catch (err) {
            const message = err?.response?.data?.message || err.message || "Login failed";
            setError(message);
            notify(message, "error");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-64 -mt-64"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -ml-64 -mb-64"/>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30 mb-6">
            <Hotel className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Log in to manage your hotel ecosystem
          </p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl relative z-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                <Input id="email" type="email" placeholder="alex@example.com" value={data.email} onChange={handleChange} className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"/>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" title="Recover password" className="text-xs font-bold text-indigo-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                <Input id="password" type="password" placeholder="••••••••" value={data.password} onChange={handleChange} className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"/>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="block">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-500/20 group" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </Button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 flex gap-3 font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 flex gap-3 font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Github
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </motion.div>
    </div>);
}
