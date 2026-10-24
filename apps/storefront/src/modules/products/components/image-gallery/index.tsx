
"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const validImages = images.filter((image) => Boolean(image.url))

  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedImage = validImages[selectedIndex] ?? validImages[0]

  if (!selectedImage) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-[#f1f5f9] p-6 text-sm text-[#64748b]">
        No product image available
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Main product image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f5f6f8]">
        <Image
          key={selectedImage.id}
          src={selectedImage.url!}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 700px"
          className="object-contain p-5 transition-opacity duration-300 sm:p-8"
        />

        {validImages.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#172b4d] shadow-sm">
            {selectedIndex + 1} / {validImages.length}
          </span>
        )}
      </div>

      {/* Clickable image thumbnails */}
      {validImages.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          aria-label="Product image thumbnails"
        >
          {validImages.map((image, index) => {
            const isSelected = selectedIndex === index

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={isSelected}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f5f6f8] transition sm:h-24 sm:w-24 ${
                  isSelected
                    ? "border-[#176b87] ring-2 ring-[#176b87]/15"
                    : "border-[#e2e8f0] hover:border-[#94a3b8]"
                }`}
              >
                <Image
                  src={image.url!}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
