"use client";

import Image from 'next/image';
import { useState } from 'react';

interface MovieImageProps {
  src: string;
  alt: string;
}

const MovieImage = ({ src, alt }: MovieImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={200}
      height={300}
      className="w-full h-auto"
      onError={() => {
        setImgSrc('https://placehold.co/200x300/1c1c1e/f5f5f7?text=Image+N/A');
      }}
    />
  );
};

export default MovieImage;