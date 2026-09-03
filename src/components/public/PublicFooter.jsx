"use client";
import React from "react";
import Link from "next/link";
import { Hotel, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="py-20 px-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-500/20">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              VEDANTA TECH
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The intelligent operating system for modern hotels and hospitality enterprises. Built for scale, designed for simplicity.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-3.5">
            <li>
              <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Home Overview
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                About Our Platform
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Plans & Pricing
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Portal Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-wider">
            Help & Legal
          </h4>
          <ul className="space-y-3.5">
            <li>
              <Link href="/privacy-policy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/customer-support" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Customer Support & Helpdesk
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-wider">
            Get In Touch
          </h4>
          <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>support@vedantatech.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>Cyber City, Tech Boulevard, Sector 62</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} VEDANTA TECH. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-indigo-600 transition-colors">Terms & Conditions</Link>
          <Link href="/customer-support" className="hover:text-indigo-600 transition-colors">Support Desk</Link>
          <Link href="/contact-us" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
