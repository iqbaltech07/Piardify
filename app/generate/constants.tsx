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
    options: ["Node.js", "Python (FastAPI/Django)", "Laravel", "NestJS", "Spring Boot", "Go", "Ruby on Rails", "Rust (Actix/Axum)", "Elixir (Phoenix)"],
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
