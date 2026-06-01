"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
const ToastContext = createContext(null);
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within ToastProvider");
    return ctx;
};
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const notify = useCallback((message, type = "info") => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const t = { id, message, type };
        setToasts((s) => [t, ...s]);
        setTimeout(() => {
            setToasts((s) => s.filter((x) => x.id !== id));
        }, 4000);
    }, []);
    return (<ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (<div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded-xl shadow-lg text-sm text-white break-words animate-slide-in ${t.type === "success"
                ? "bg-emerald-600"
                : t.type === "error"
                    ? "bg-red-600"
                    : t.type === "warn"
                        ? "bg-yellow-600 text-black"
                        : "bg-sky-600"}`}>
            {t.message}
          </div>))}
      </div>
      <style jsx>{`
        @keyframes slideIn { from { transform: translateY(-8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .animate-slide-in { animation: slideIn 160ms ease; }
      `}</style>
    </ToastContext.Provider>);
};
export default ToastProvider;
