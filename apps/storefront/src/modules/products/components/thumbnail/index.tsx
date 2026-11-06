
import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square" | "wide"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "group relative w-full min-w-0 overflow-hidden rounded-xl bg-white shadow-elevation-card-rest transition-shadow duration-150 ease-in-out group-hover:shadow-elevation-card-hover",
        className,
        {
          "aspect-[4/5]": size !== "square" && size !== "wide",
          "aspect-square": size === "square",
          "aspect-[16/9]": size === "wide",
          "w-full max-w-[180px] sm:max-w-[200px]": size === "small",
          "w-full max-w-[290px]": size === "medium",
          "w-full max-w-[440px]": size === "large",
          "w-full": size === "full" || size === "wide",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder
        image={initialImage}
        size={size}
        isFeatured={isFeatured}
      />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  isFeatured,
}: Pick<ThumbnailProps, "size" | "isFeatured"> & {
  image?: string | null
}) => {
  return image ? (
    <Image
      src={image}
      alt="Product image"
      className="absolute inset-0 h-full w-full object-contain object-center p-2 sm:p-3 md:p-4"
      draggable={false}
      quality={80}
      sizes={
        size === "small"
          ? "(max-width: 576px) 180px, 200px"
          : size === "medium"
            ? "(max-width: 576px) 80vw, 290px"
            : size === "large"
              ? "(max-width: 576px) 100vw, 440px"
              : "100vw"
      }
      fill
      priority={isFeatured}
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
