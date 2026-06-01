"use client";
import React from "react";

export const Switch = ({ checked, onCheckedChange, className = "" }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        relative inline-flex h-5 w-10 items-center rounded-full
        transition-colors focus:outline-none focus:ring-2 
        focus:ring-indigo-500 focus:ring-offset-2
        ${checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white
          transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
};