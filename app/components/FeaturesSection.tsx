"use client";

import { motion, Variants } from "framer-motion";
import { FEATURES } from "./features/FeaturesData";
import { FeatureCard } from "./features/FeatureCard";
import FeaturesStyles from "./features/FeaturesStyles";

export default function FeaturesSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section id="features" className="feat-section">
      {/* Section header */}
      <motion.div 
        className="feat-header"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        <motion.div variants={headerVariants} className="feat-header-pill">
          <motion.span 
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="feat-header-dot" 
          />
          All Features
        </motion.div>
        
        <motion.h2 variants={headerVariants} className="feat-heading">
          Built for teams that
          <br />
          <span className="gradient-text">refuse to slow down</span>
        </motion.h2>
        
        <motion.p variants={headerVariants} className="feat-subheading">
          Every tool you need — from ideation to export — wired into one seamless AI workflow.
        </motion.p>
      </motion.div>

      {/* Bento grid */}
      <motion.div 
        className="feat-bento"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} f={f} index={i} />
        ))}
      </motion.div>

      <FeaturesStyles />
    </section>
  );
}
