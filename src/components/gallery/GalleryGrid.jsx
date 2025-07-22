"use client";

import React from "react";
import Grid from "react-masonry-css";
import Image from "next/image";

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
  return (
    <section className="px-4 py-12 text-[#0B56A3] dark:text-white">
      <Grid
        breakpointCols={breakpointColumnsObj}
        className="flex w-full -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map(({ src, caption }, index) => (
          <div
            key={index}
            title={caption}
            className="mb-6 rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <Image
              src={src}
              alt={caption}
              width={400}
              height={300}
              className="rounded w-full h-auto object-cover"
            />
          </div>
        ))}
      </Grid>
    </section>
  );
};

export default Gallery;
