
"use client"

import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useState } from "react"
import { useLocale } from "next-intl"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const locale = useLocale()

  const translations = {
    en: "Remove",
    te: "తొలగించండి",
    hi: "हटाएं",
  }

  const deleteLabel =
    translations[locale as keyof typeof translations] ??
    translations.en

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    await deleteLineItem(id).catch((_err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        aria-label={deleteLabel}
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Spinner className="animate-spin" />
        ) : (
          <Trash />
        )}
        <span>{children || deleteLabel}</span>
      </button>
    </div>
  )
}

export default DeleteButton
