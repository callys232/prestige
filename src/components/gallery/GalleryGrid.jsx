"use client";

import React, { useState, useEffect } from "react";
import Grid from "react-masonry-css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  { src: "/Pres1.jpg", caption: "Prestige, strength" },
  { src: "/Pres2.jpg", caption: "Becoming unstoppable" },
  { src: "/Pres3.jpg", caption: "Workshop Session" },
  { src: "/Pres4.jpg", caption: "Relentless" },
  { src: "/Pres5.jpg", caption: "Networking Break" },
  { src: "/Pres6.jpg", caption: "Panel Discussion" },
  { src: "/Pres7.jpg", caption: "Award Presentation" },
  { src: "/Pres8.jpg", caption: "Group Photo" },
  { src: "/Pres9.jpg", caption: "Interactive Q&A" },
  { src: "/Pres10.jpg", caption: "Closing Remarks" },
  { src: "/Pres11.jpg", caption: "Celebration Moment" },
];

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  500: 1,
};

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <section className="px-4 py-12 text-[#0B56A3] dark:text-white">
      <Grid
        breakpointCols={breakpointColumnsObj}
        className="flex w-full -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map(({ src, caption }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedIndex(index)}
            className="relative mb-6 rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer group"
          >
            <Image
              src={src}
              alt={caption}
              width={400}
              height={300}
              className="rounded w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
              <p className="text-white text-sm sm:text-base font-medium text-center px-2">
                {caption}
              </p>
            </div>
          </motion.div>
        ))}
      </Grid>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              key={selectedIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -100 || velocity.x < -500) {
                  handleNext();
                } else if (offset.x > 100 || velocity.x > 500) {
                  handlePrev();
                }
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].caption}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg object-contain"
              />
              <p className="text-center text-white mt-4">
                {images[selectedIndex].caption}
              </p>

              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-2 right-2 text-white text-2xl font-bold"
              >
                ✕
              </button>

              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold px-2"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold px-2"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
