import { cn } from "@/utils/cn";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export default function BlurImage({
  src,
  alt,
  className,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("scale-100 duration-300 ease-in-out", {
        "blur grayscale": isLoading,
        "blur-0 grayscale-0": !isLoading,
        className,
      })}
      onLoadingComplete={() => setIsLoading(false)}
      {...props}
    />
  );
}
