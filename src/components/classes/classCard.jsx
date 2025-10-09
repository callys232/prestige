"use client";

import Image from "next/image";
import Link from "next/link";

const ClassCard = ({
  id,
  name,
  image,
  description,
  level,
  trainers,
  icon,
  workout,
  selectedTrainer,
  onTrainerSelect,
  theme = {},
}) => {
  const trainerValue = selectedTrainer?.[id] || "";

  return (
    <div
      className={`
        bg-white/40 dark:bg-blue-950/30 backdrop-blur-md 
        border rounded-xl shadow-md p-4 sm:p-6 text-center 
        transform transition-all duration-300 
        hover:-translate-y-2 hover:scale-105 
        ${theme.base || ""} 
        ${theme.hover || ""} 
        ${theme.active || ""}
      `}
    >
      {/* Image */}
      <div className="relative w-full h-32 sm:h-40 mb-4 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={400}
          height={160}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent" />
      </div>

      {/* Title with animated icon */}
      <h3
        className={`text-lg sm:text-xl font-semibold mb-2 flex items-center justify-center gap-2 ${theme.text}`}
      >
        {icon && (
          <span className="animate-bounce-slow text-base sm:text-lg">
            {icon}
          </span>
        )}
        {name}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-white/80 dark:text-white/70 mb-3">
          {description}
        </p>
      )}

      {/* Level */}
      {level && (
        <p className="text-xs italic text-blue-200 dark:text-blue-300 mb-4">
          {level}
        </p>
      )}

      {/* Trainer Dropdown */}
      {trainers?.length > 0 && (
        <select
          value={trainerValue}
          onChange={(e) => onTrainerSelect(id, e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-black text-sm sm:text-base
                     focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
        >
          <option value="">-- Select Trainer --</option>
          {trainers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {/* Workout Preview */}
      {workout && workout.length > 0 && (
        <details className="mt-4 text-left">
          <summary
            className={`cursor-pointer text-xs sm:text-sm font-semibold ${theme.text}`}
          >
            Workout in this Category!!!
          </summary>
          <ul className="mt-2 text-xs sm:text-sm text-white/80 dark:text-white/70 list-disc list-inside space-y-1">
            {workout.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </details>
      )}

      {/* CTA */}
      {trainerValue && (
        <Link
          href={{
            pathname: "/signUp",
            query: { className: name, trainer: trainerValue },
          }}
          className="block w-full mt-4 px-4 py-2 rounded-full 
                     bg-gradient-to-r from-blue-950 to-blue-700 
                     text-white font-semibold shadow-lg 
                     hover:scale-[1.02] transition animate-glow-pulse
                     text-sm sm:text-base"
        >
          Join Now
        </Link>
      )}
    </div>
  );
};

export default ClassCard;
