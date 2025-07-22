"use client";

export default function CtaText() {
  return (
    <div
      style={{ backgroundColor: "#7CC2BA" }}
      className="py-10 px-6 text-center relative overflow-hidden rounded-xl shadow-md"
    >
<a href="/classes" className="group inline-block">
  <h2 className="relative text-4xl md:text-5xl font-black uppercase tracking-wide text-black transition-transform duration-300 group-hover:scale-105">
    {/* RGB glitch layers */}
    <span
      className="absolute inset-0 text-red-500 opacity-30 blur-sm pointer-events-none select-none animate-glitch1"
      aria-hidden="true"
    >
      BOOK YOUR FREE CLASS!
    </span>
    <span
      className="absolute inset-0 text-blue-500 opacity-30 blur-sm pointer-events-none select-none animate-glitch2"
      aria-hidden="true"
    >
      BOOK YOUR FREE CLASS!
    </span>
    {/* Main text */}
    <span className="relative z-10 animate-fadeIn">BOOK YOUR FREE CLASS!</span>
  </h2>
</a>
</div>
  );
}
