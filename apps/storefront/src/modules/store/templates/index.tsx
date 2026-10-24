
"use client"

import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StoreHits from "@modules/store/components/store-hits"
import StoreRefinements from "@modules/store/components/store-refinements"
import StoreSearchBox from "@modules/store/components/store-search-box"

const PRODUCT_LIMIT = 12

const categories = [
  { name: "Shirts", description: "Everyday styles", href: "/categories/shirts" },
  { name: "Pants", description: "Comfort meets style", href: "/categories/pants" },
  { name: "Shoes", description: "Step out in style", href: "/categories/shoes" },
  { name: "T-Shirts", description: "Casual essentials", href: "/categories/t-shirts" },
]

const StoreTemplate = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <main
      data-testid="category-container"
      className="min-h-screen overflow-x-clip bg-[#FAF8F5] text-[#1A1816]"
    >
      {/* Announcement bar */}
      <div className="border-b border-[#E5DFD7] bg-[#FDFBF7] px-4 py-2.5">
        <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-4">
          <p className="truncate text-[9px] font-medium uppercase tracking-[0.16em] text-[#7D756C] sm:text-[10px] sm:tracking-[0.22em]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-700" />
            A considered collection of everyday essentials
          </p>
          <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#7D756C] sm:inline">
            Thoughtfully curated
          </span>
        </div>
      </div>

      {/* Editorial header */}
      <header className="sticky top-0 z-40 border-b border-[#E5DFD7]/80 bg-[#FAF8F5]/95 backdrop-blur-md">
        <div className="mx-auto grid h-[76px] max-w-[1720px] grid-cols-3 items-center px-4 sm:px-6 lg:px-10">
          <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.16em] text-[#49433D] lg:flex">
            <a className="group relative py-2" href="#shop-categories">
              Collections
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#1A1816] transition-all duration-300 group-hover:w-full" />
            </a>
            <a className="group relative py-2" href="#all-products">
              Shop
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#1A1816] transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <a href="#top" className="col-start-1 flex flex-col items-center text-center lg:col-start-2">
            <span className="whitespace-nowrap font-serif text-[21px] font-normal uppercase leading-none tracking-[0.13em] sm:text-[27px] sm:tracking-[0.2em]">
              Maison Medusa
            </span>
            <span className="mt-1.5 text-[7px] uppercase tracking-[0.22em] text-[#8C857B] sm:text-[9px] sm:tracking-[0.3em]">
              Atelier · Style · Everyday
            </span>
          </a>

          <div className="col-start-3 flex items-center justify-end gap-4 text-[10px] uppercase tracking-[0.12em] sm:gap-6 sm:tracking-[0.18em]">
            <a href="#product-search" className="hidden text-[#7D756C] transition-colors hover:text-black sm:inline">
              Search
            </a>
            <LocalizedClientLink href="/account" className="hidden transition-colors hover:text-[#8C857B] md:inline">
              Account
            </LocalizedClientLink>
            <LocalizedClientLink href="/cart" className="transition-opacity hover:opacity-60">
              Bag <span className="text-[#8C857B]">↗</span>
            </LocalizedClientLink>
          </div>
        </div>
      </header>

      {/* Editorial hero */}
      <section id="top" className="relative border-b border-[#E5DFD7]/70">
        <div className="mx-auto max-w-[1720px] px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-12 xl:py-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-7 xl:gap-12">
            {/* Left editorial content */}
            <div className="relative z-20 lg:col-span-5">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-7 bg-[#1A1816]/70" />
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#8C857B] sm:text-[11px] sm:tracking-[0.3em]">
                  The Art of Everyday
                </p>
              </div>

              <h1 className="font-serif text-[58px] font-normal leading-[0.88] tracking-[-0.045em] text-[#1A1816] sm:text-7xl xl:text-[88px] 2xl:text-[100px]">
                Style that
                <br />
                speaks
                <br />
                <em className="font-normal italic text-[#756B60]">
                  without words.
                </em>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-[#7D756C] sm:mt-8 sm:text-base sm:leading-8">
                Discover timeless essentials, distinctive silhouettes, and
                refined everyday style selected with care for the way you live.
              </p>

              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                <a
                  href="#all-products"
                  className="group inline-flex min-h-[52px] items-center justify-center gap-4 bg-[#1A1816] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#FDFBF7] shadow-sm transition-all duration-300 hover:bg-[#49433D] hover:shadow-lg sm:px-8"
                >
                  Discover the Collection
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>

                <a
                  href="#shop-categories"
                  className="group relative py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1816]"
                >
                  Explore the Edit
                  <span className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#1A1816]/50 transition-transform duration-300 group-hover:scale-x-0" />
                </a>
              </div>

              <div className="mt-10 grid max-w-md grid-cols-2 gap-5 border-t border-[#E5DFD7] pt-6 sm:mt-12">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#49433D]">
                    Thoughtfully Curated
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#8C857B]">
                    Considered styles for everyday living.
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#49433D]">
                    Effortless Style
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#8C857B]">
                    Versatile pieces, timeless inspiration.
                  </p>
                </div>
              </div>
            </div>

            {/* Right fashion collage */}
            <div
              aria-label="Fashion editorial image collection"
              className="relative mx-auto w-full max-w-[680px] lg:col-span-7 lg:max-w-none"
            >
              <div className="absolute -right-1 top-5 h-[70%] w-[62%] bg-[#EFEAE3]/80 sm:-right-3 sm:top-8" />

              <div className="relative min-h-[470px] sm:min-h-[610px] lg:min-h-[650px] xl:min-h-[720px]">
                {/* Main fashion image */}
                <div className="absolute left-[12%] top-[5%] z-10 w-[68%] border border-[#E5DFD7] bg-white p-2 shadow-[0_20px_45px_-15px_rgba(26,24,22,0.16)] transition-transform duration-700 hover:scale-[1.015] sm:left-[16%] sm:w-[62%] sm:p-2.5 lg:left-[14%] lg:w-[62%]">
                  <div className="aspect-[4/5] overflow-hidden bg-[#F4EFEB]">
                    <img
                      src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85"
                      alt="Editorial fashion portrait in timeless neutral styling"
                      className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center justify-between px-1 pb-1 pt-3 text-[8px] uppercase tracking-[0.14em] text-[#8C857B] sm:text-[9px] sm:tracking-[0.18em]">
                    <span>Look 01 / The New Edit</span>
                    <span>Fig. 01</span>
                  </div>
                </div>

                {/* Upper overlapping detail image */}
                <div className="absolute right-0 top-[1%] z-20 w-[36%] border border-[#E5DFD7] bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(26,24,22,0.2)] transition-transform duration-500 hover:-translate-y-2 sm:right-[1%] sm:w-[34%] sm:p-2 lg:-right-1 lg:w-[34%]">
                  <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEB]">
                    <img
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85"
                      alt="Elegant leather handbag and fashion accessory detail"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <p className="px-1 pb-1 pt-2 text-[7px] uppercase tracking-[0.12em] text-[#7D756C] sm:text-[9px] sm:tracking-[0.16em]">
                    Objects of desire
                  </p>
                </div>

                {/* Lower overlapping detail image */}
                <div className="absolute bottom-[1%] left-0 z-30 w-[38%] border border-[#E5DFD7] bg-[#FAF8F5] p-1.5 shadow-[0_18px_40px_-16px_rgba(26,24,22,0.18)] transition-transform duration-500 hover:translate-y-[-5px] sm:bottom-[2%] sm:left-[1%] sm:w-[34%] sm:p-2 lg:-left-1">
                  <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEB]">
                    <img
                      src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85"
                      alt="Refined footwear detail from the fashion collection"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <p className="px-1 pb-1 pt-2 text-[7px] uppercase tracking-[0.1em] text-[#7D756C] sm:text-[9px] sm:tracking-[0.14em]">
                    The finishing touch
                  </p>
                </div>

                <div className="absolute bottom-[7%] right-0 z-20 hidden bg-[#1A1816] px-4 py-3 text-[8px] uppercase tracking-[0.18em] text-[#FAF8F5] shadow-lg xl:block">
                  A study in timeless style
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial footer strip */}
        <div className="border-t border-[#E5DFD7] px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-3 text-[9px] uppercase tracking-[0.16em] text-[#8C857B] sm:flex-row sm:tracking-[0.2em]">
            <span>Maison Medusa · The New Edit</span>
            <a
              href="#shop-categories"
              className="group flex items-center gap-3 text-[#1A1816]"
            >
              Explore below
              <span className="flex h-6 w-4 items-start justify-center rounded-full border border-[#8C857B] p-1">
                <span className="h-1.5 w-px bg-[#1A1816] transition-transform group-hover:translate-y-1" />
              </span>
            </a>
            <span className="hidden lg:inline">Considered style, every day</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="shop-categories"
        className="mx-auto max-w-[1720px] scroll-mt-24 px-4 py-14 sm:px-6 lg:px-10 lg:py-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C857B]">
              The curated edit
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight sm:text-5xl">
              Explore by category
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#7D756C]">
            Thoughtfully selected pieces to make everyday dressing feel special.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={category.name}
              href={category.href}
              className="group flex min-h-[150px] items-end justify-between border border-[#E5DFD7] bg-[#FDFBF7] p-5 transition-all duration-300 hover:border-[#B9AFA3] hover:bg-white hover:shadow-[0_14px_30px_-20px_rgba(26,24,22,0.3)] sm:min-h-[180px] sm:p-6"
            >
              <div>
                <span className="text-[9px] tracking-[0.2em] text-[#8C857B]">
                  0{index + 1} / COLLECTION
                </span>
                <h3 className="mt-4 font-serif text-3xl transition-transform duration-300 group-hover:translate-x-1">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-[#8C857B]">
                  {category.description}
                </p>
              </div>
              <span className="text-xl text-[#7D756C] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </section>

      {/* Product catalog heading */}
      <section
        id="all-products"
        className="mx-auto mt-2 max-w-[1720px] scroll-mt-24 px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20"
      >
        <div className="border-y border-[#E5DFD7] py-8 sm:py-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C857B]">
            Find your next favourite
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-4xl font-normal sm:text-5xl">
                The collection
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#7D756C]">
                Browse the collection, discover new favourites, and refine
                your search to find the pieces that feel right for you.
              </p>
            </div>
            <a
              href="#product-search"
              className="inline-flex items-center gap-3 self-start border-b border-[#1A1816] pb-2 text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60 sm:self-auto"
            >
              Browse products <span>↓</span>
            </a>
          </div>
        </div>

        {/* Existing Medusa search, filters and product listing */}
        <div
          id="product-search"
          className="scroll-mt-24 border-b border-[#E5DFD7] py-6 sm:py-8"
        >
          <InstantSearch
            indexName={PRODUCT_INDEX_NAME}
            searchClient={searchClient as unknown as SearchClient}
            routing
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure hitsPerPage={PRODUCT_LIMIT} />

            <div className="flex min-w-0 flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-8">
              <aside className="w-full min-w-0 lg:w-[260px] lg:shrink-0">
                <div className="border border-[#E5DFD7] bg-[#FDFBF7] p-4 sm:p-5">
                  <h3 className="border-b border-[#E5DFD7] pb-4 font-serif text-2xl">
                    Refine
                  </h3>
                  <p className="py-3 text-xs text-[#8C857B]">
                    Find your perfect piece
                  </p>
                  <StoreRefinements currencyCode={currencyCode} />
                </div>
              </aside>

              <div className="w-full min-w-0 flex-1">
                <div className="mb-6 border border-[#E5DFD7] bg-white p-3 transition-colors focus-within:border-[#8C857B] sm:p-4">
                  <StoreSearchBox />
                </div>

                <StoreHits
                  hitsPerPage={PRODUCT_LIMIT}
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          </InstantSearch>
        </div>
      </section>

      <footer className="border-t border-[#E5DFD7] bg-[#FDFBF7] px-4 py-7 sm:px-8">
        <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-3 text-center text-[9px] uppercase tracking-[0.18em] text-[#8C857B] sm:flex-row sm:text-left">
          <span className="font-serif text-lg tracking-[0.12em] text-[#1A1816]">
            Maison Medusa
          </span>
          <span>Everyday essentials · Thoughtfully selected</span>
          <a href="#top" className="text-[#1A1816] hover:opacity-60">
            Back to top ↑
          </a>
        </div>
      </footer>
    </main>
  )
}

export default StoreTemplate
