import React from "react";
import { LayoutTemplate, Server, Database, Cloud } from "lucide-react";
import { StackCategory } from "./types";

export const TECH_CATEGORIES = [
  {
    id: "frontend" as StackCategory, title: "Frontend", subtitle: "UI & tampilan user",
    icon: <LayoutTemplate size={20} strokeWidth={2} />,
    color: "#3b82f6", bg: "rgba(59,130,246,0.15)",
    options: ["Next.js", "React", "Vue.js", "Svelte", "Flutter", "React Native", "Astro", "Angular", "HTMX"],
  },
  {
    id: "backend" as StackCategory, title: "Backend", subtitle: "Logic & API server",
    icon: <Server size={20} strokeWidth={2} />,
    color: "#10b981", bg: "rgba(16,185,129,0.15)",
    options: ["Next.js (API Routes)", "Node.js", "Python (FastAPI/Django)", "Laravel", "NestJS", "Spring Boot", "Go", "Ruby on Rails", "Rust (Actix/Axum)", "Elixir (Phoenix)"],
  },
  {
    id: "database" as StackCategory, title: "Database", subtitle: "Penyimpanan data",
    icon: <Database size={20} strokeWidth={2} />,
    color: "#eab308", bg: "rgba(234,179,8,0.15)",
    options: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase", "Redis", "SQLite / Turso", "DynamoDB", "ClickHouse"],
  },
  {
    id: "deployment" as StackCategory, title: "Deployment", subtitle: "Hosting & infra",
    icon: <Cloud size={20} strokeWidth={2} />,
    color: "#a855f7", bg: "rgba(168,85,247,0.15)",
    options: ["Vercel", "AWS", "Google Cloud", "Azure", "Railway", "Docker", "Cloudflare Workers / Pages", "Fly.io", "Render"],
  }
];

export const POPULAR_STACK_PRESETS = [
  {
    id: "next-fullstack",
    label: "Next.js Fullstack",
    desc: "App Router API Routes + Vercel",
    badge: "Most Popular",
    stacks: {
      frontend: "Next.js",
      backend: "Next.js (API Routes)",
      database: "PostgreSQL",
      deployment: "Vercel"
    }
  },
  {
    id: "t3-stack",
    label: "T3 / Node Stack",
    desc: "Next.js + Node.js + Postgres",
    badge: "Enterprise",
    stacks: {
      frontend: "Next.js",
      backend: "Node.js",
      database: "PostgreSQL",
      deployment: "Vercel"
    }
  },
  {
    id: "ai-saas",
    label: "AI SaaS Stack",
    desc: "Next.js + FastAPI + Postgres",
    badge: "AI Ready",
    stacks: {
      frontend: "Next.js",
      backend: "Python (FastAPI/Django)",
      database: "PostgreSQL",
      deployment: "Vercel"
    }
  },
  {
    id: "mern-stack",
    label: "MERN Stack",
    desc: "React + Node.js + Mongo + Railway",
    badge: "Classic",
    stacks: {
      frontend: "React",
      backend: "Node.js",
      database: "MongoDB",
      deployment: "Railway"
    }
  },
  {
    id: "expo-supabase",
    label: "Mobile Expo Stack",
    desc: "React Native + Supabase + Cloudflare",
    badge: "Mobile",
    stacks: {
      frontend: "React Native",
      backend: "Node.js",
      database: "Supabase",
      deployment: "Cloudflare Workers / Pages"
    }
  }
];

export const COLOR_PALETTE_PRESETS = [
  {
    id: "amber-cyber",
    name: "Amber Signal",
    theme: "Cyber Slate Dark",
    primary: "#ffb627",
    bg: "#090a0c",
    surface: "#121418",
    border: "#27272a",
    text: "#f4f4f5",
    muted: "#a1a1aa"
  },
  {
    id: "ocean-indigo",
    name: "Ocean Indigo",
    theme: "Clean Enterprise Light",
    primary: "#4f46e5",
    bg: "#f8fafc",
    surface: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b"
  },
  {
    id: "electric-emerald",
    name: "Electric Emerald",
    theme: "Modern Tech Dark",
    primary: "#10b981",
    bg: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    text: "#f8fafc",
    muted: "#94a3b8"
  },
  {
    id: "neon-violet",
    name: "Neon Violet",
    theme: "SaaS Dark Glow",
    primary: "#8b5cf6",
    bg: "#0c0a09",
    surface: "#1c1917",
    border: "#292524",
    text: "#fafaf9",
    muted: "#a8a29e"
  },
  {
    id: "crimson-coral",
    name: "Crimson Coral",
    theme: "Vibrant Minimal Light",
    primary: "#f43f5e",
    bg: "#fafafa",
    surface: "#ffffff",
    border: "#e4e4e7",
    text: "#18181b",
    muted: "#71717a"
  }
];

export const PLATFORMS = ["Web", "Mobile (iOS)", "Mobile (Android)", "Web + Mobile", "Desktop"];
export const FEATURE_OPTIONS = [
  "Authentication & Authorization","Dashboard / Admin Panel","Real-time Updates",
  "AI / ML Features","Payment Gateway","Notifications (Push/Email)",
  "File Upload / Storage","Search & Filtering","Social Features",
  "Analytics & Reports","Multi-language Support","Offline Mode",
];
export const MONETIZATION_OPTIONS = [
  "Free / Open Source","Freemium","Subscription (SaaS)",
  "One-time Purchase","Pay-per-Use","Ads-based","Enterprise Licensing",
];
export const SCALE_OPTIONS = [
  "Personal / Side Project","Small Team (< 10 users)","Startup (10 – 1,000 users)",
  "Growth Stage (1K – 100K users)","Enterprise (100K+ users)",
];
export const INTEGRATION_OPTIONS = [
  "Google OAuth","Stripe / Payment","Twilio / SMS","SendGrid / Email",
  "Firebase","AWS Services","Slack","GitHub","Notion API","OpenAI API","WhatsApp","None",
];
export const DESIGN_OPTIONS = [
  { id: "minimal", label: "Minimal & Clean", desc: "Simple, whitespace-focused" },
  { id: "bold", label: "Bold & Modern", desc: "Strong colors, dynamic" },
  { id: "developer", label: "Developer-Focused", desc: "Dark mode, dense info" },
  { id: "playful", label: "Playful & Creative", desc: "Colorful, fun, animated" },
  { id: "enterprise", label: "Enterprise", desc: "Professional, corporate" },
];

