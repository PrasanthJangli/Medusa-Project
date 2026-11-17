
"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

type LocalizedClientLinkProps = {
  children?: React.ReactNode
  href: string
  [key: string]: unknown
}

const LocalizedClientLink = ({
  children,
  href,
  ...props
}: LocalizedClientLinkProps) => {
  const params = useParams()
  const countryCode = params?.countryCode

  const normalizedHref = href.startsWith("/")
    ? href
    : `/${href}`

  const countryPrefix =
    typeof countryCode === "string" ? `/${countryCode}` : ""

  const isAlreadyLocalized =
    countryPrefix &&
    (normalizedHref === countryPrefix ||
      normalizedHref.startsWith(`${countryPrefix}/`))

  const localizedHref = isAlreadyLocalized
    ? normalizedHref
    : `${countryPrefix}${normalizedHref}`

  return (
    <Link href={localizedHref || normalizedHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
