"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 24px" }}
    >
      <nav
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "12px 24px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(15, 18, 32, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* Logo */}
        <Link href="/" id="nav-logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/logo.png"
              alt="Piardify"
              width={143}
              height={80}
              style={{ height: "57px", width: "auto" }}
              priority
            />
          </motion.div>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-8" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_LINKS.map((link, idx) => (
            <motion.li 
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Link
                href={link.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--fg-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Auth / CTA */}
        <div className="flex items-center gap-4">
          {!isPending && !session ? (
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                Get Started
              </Link>
            </motion.div>
          ) : session ? (
            <div className="flex items-center gap-4">
               <Link
                href="/generate"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                Generate PRD
              </Link>
              <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-9 h-9 rounded-full border border-white/20" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {session.user.name?.charAt(0) || "U"}
                        </div>
                    )}
                  </button>
                  <AnimatePresence>
                      {dropdownOpen && (
                          <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50"
                          >
                              {/* Header Profile */}
                              <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/30">
                                  <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                                  <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                              </div>

                              <div className="p-2 space-y-1">
                                  {/* Profile Link */}
                                  <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                                          <User className="w-4 h-4 text-slate-400" strokeWidth={2} />
                                          Profile
                                      </div>
                                  </Link>
                                  
                                  {/* Sign Out */}
                                  <button 
                                      onClick={handleLogout}
                                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                                  >
                                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                                      Sign Out
                                  </button>
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
            </div>
          ) : (
             <div className="w-24 h-9 animate-pulse bg-slate-800 rounded-lg"></div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
