
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
      <div className="flex aspect-[4/5] w-full min-w-0 items-center justify-center rounded-xl bg-[#f1f5f9] p-4 text-center text-sm text-[#64748b] sm:rounded-2xl sm:p-6">
        No product image available
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 space-y-3 sm:space-y-4">
      {/* MAIN PRODUCT IMAGE */}
      <div className="relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f5f6f8] sm:rounded-2xl">
        <Image
          key={selectedImage.id}
          src={selectedImage.url!}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 700px"
          className="object-contain p-3 transition-opacity duration-300 sm:p-6 md:p-8"
        />

        {/* IMAGE COUNT */}
        {validImages.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-[#172b4d] shadow-sm sm:bottom-4 sm:right-4 sm:px-3 sm:text-xs">
            {selectedIndex + 1} / {validImages.length}
          </span>
        )}
      </div>

      {/* CLICKABLE IMAGE THUMBNAILS */}
      {validImages.length > 1 && (
        <div
          className="flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:gap-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
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
                className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg border-2 bg-[#f5f6f8] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b87] focus-visible:ring-offset-2 sm:h-20 sm:w-20 sm:rounded-xl md:h-24 md:w-24 ${
                  isSelected
                    ? "border-[#176b87] ring-2 ring-[#176b87]/15"
                    : "border-[#e2e8f0] hover:border-[#94a3b8]"
                }`}
              >
                <Image
                  src={image.url!}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 68px, 96px"
                  className="object-contain p-1.5 sm:p-2"
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
