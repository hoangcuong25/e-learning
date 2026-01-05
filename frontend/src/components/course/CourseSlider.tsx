"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Props {
  children: React.ReactNode;
}

export default function CourseSlider({ children }: Props) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
    },
    [Autoplay({ delay: 3000 })]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {React.Children.map(children, (child) => (
          <div className="min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
