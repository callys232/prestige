import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

export default function ProgramCard({
  label,
  links = [],
  description,
  brief,
  highlights = [],
  cta,
}) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const firstActionRef = useRef(null);

  // focus trap for modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && firstActionRef.current) {
        const focusable = document.querySelectorAll(
          '[data-modal="true"] a, [data-modal="true"] button'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative inline-block">
      {/* Trigger with tooltip */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg border 
    bg-white/10 dark:bg-gray-900/30 border-white/10 dark:border-black/20 
    shadow-sm transition-transform duration-150 ease-[cubic-bezier(.2,.8,.2,1)] 
    hover:scale-[1.02] focus:outline-none 
    ${open ? "ring-2 ring-blue-950/40 scale-[1.02] shadow-lg" : ""}`}
        >
          {/* Animated Icon */}
          <span className="text-lg animate-bounce-slow" aria-hidden="true">
            {label.includes("Dance") && "💃"}
            {label.includes("Kids") && "🧒"}
            {label.includes("Cardio") && "🔥"}
          </span>

          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && description && (
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-md 
               bg-blue-950 text-white text-xs shadow-lg whitespace-nowrap 
               animate-tooltip-pop"
          >
            {description}
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 
                 bg-blue-950 rotate-45"
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          data-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Popup */}
          <div
            className="relative z-10 w-80 max-w-[90%] p-5 rounded-2xl 
              bg-white/20 dark:bg-gray-900/40 backdrop-blur-md border border-white/10 
              dark:border-black/20 shadow-2xl animate-pop-up"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {label}
                </h3>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-white/10"
              >
                ✕
              </button>
            </header>

            {/* Brief */}
            {brief && (
              <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                {brief}
              </p>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-md bg-blue-950 text-white"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Links as pop buttons */}
            <div className="mt-5 grid grid-cols-1 gap-3">
              {links.map((l, idx) => (
                <Link key={l.href} href={l.href} legacyBehavior>
                  <a
                    ref={idx === 0 ? firstActionRef : null}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-2 rounded-xl 
                               bg-blue-950 text-white text-sm font-medium shadow-md 
                               hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] 
                               transition-transform duration-150 ease-out
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950/40"
                  >
                    {l.label}
                    <svg
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </Link>
              ))}
            </div>

            {/* Primary CTA */}
            {cta && (
              <div className="pt-4">
                <Link
                  href={cta.href}
                  className="block w-full text-center px-4 py-2 rounded-xl 
               bg-gradient-to-r from-blue-950 to-blue-800 text-white 
               font-semibold shadow-lg hover:scale-[1.02] transition"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ProgramCard.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  brief: PropTypes.string,
  highlights: PropTypes.arrayOf(PropTypes.string),
  cta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
};
