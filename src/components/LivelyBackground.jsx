import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, CheckCircle2, Scale } from "lucide-react";

// Soft drifting gradient blobs + floating document/checkmark shapes.
// Pure CSS/framer-motion — no external file, loops forever, very light.
export default function LivelyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Drifting gradient blobs */}
      <motion.div
        className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle at center, hsl(var(--chart-2) / 0.55), transparent 70%)" }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle at center, hsl(var(--chart-4) / 0.5), transparent 70%)" }}
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -25, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/4 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle at center, hsl(var(--chart-5) / 0.45), transparent 70%)" }}
        animate={{ x: [0, 25, -30, 0], y: [0, -20, 15, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating document / checkmark icons */}
      {[
        { Icon: FileText, top: "12%", left: "8%", size: 56, delay: 0, dur: 9 },
        { Icon: CheckCircle2, top: "22%", left: "78%", size: 44, delay: 1.5, dur: 11 },
        { Icon: ShieldCheck, top: "68%", left: "12%", size: 48, delay: 0.8, dur: 10 },
        { Icon: Scale, top: "74%", left: "82%", size: 52, delay: 2.2, dur: 12 },
        { Icon: FileText, top: "48%", left: "46%", size: 38, delay: 1.1, dur: 13 },
      ].map(({ Icon, top, left, size, delay, dur }, i) => (
        <motion.div
          key={i}
          className="absolute text-foreground/10"
          style={{ top, left }}
          animate={{ y: [0, -18, 0], rotate: [0, 6, -4, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.25} />
        </motion.div>
      ))}

      {/* Subtle grain via radial dots */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}