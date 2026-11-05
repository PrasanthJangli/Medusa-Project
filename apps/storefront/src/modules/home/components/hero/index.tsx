
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full overflow-hidden bg-[#fbfbfb] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:rounded-2xl lg:rounded-3xl">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          {/* LEFT: Editorial content */}
          <div className="order-1 flex min-w-0 items-center px-4 py-9 sm:px-10 sm:py-14 md:px-14 lg:px-12 lg:py-20 xl:px-16">
            <div className="w-full max-w-xl min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-7">
                <span className="h-[2px] w-8 shrink-0 bg-violet-500 sm:w-9" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700 sm:text-xs sm:tracking-[0.2em]">
                  New Season Collection
                </span>
              </div>

              <h1 className="text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-neutral-950 min-[375px]:text-[2.75rem] sm:text-5xl md:text-6xl xl:text-[4.5rem]">
                Everyday
                <br />
                Essentials.
                <br />
                <span className="text-violet-500">Elevated.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-neutral-600 sm:mt-6 sm:text-lg sm:leading-8">
                Discover thoughtfully selected styles and everyday essentials
                designed to fit your lifestyle.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <LocalizedClientLink
                  href="/store"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-neutral-950 px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-800 sm:w-auto sm:px-7"
                >
                  Shop Now
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/collections"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-neutral-300 bg-transparent px-5 py-3.5 text-sm font-semibold text-neutral-800 transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-50 sm:w-auto sm:px-7"
                >
                  Explore Collection
                </LocalizedClientLink>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-neutral-200 pt-5 text-[11px] font-medium tracking-wide text-neutral-500 sm:mt-8 sm:gap-x-3 sm:text-sm">
                <span>New arrivals</span>
                <span className="text-violet-400">•</span>
                <span>Curated collections</span>
                <span className="text-violet-400">•</span>
                <span>Easy shopping</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial fashion photograph */}
          <div className="order-2 min-w-0 p-2 pt-0 sm:p-5 sm:pt-0 lg:min-h-[620px]">
            <div className="group relative h-[280px] min-h-[280px] overflow-hidden rounded-lg bg-neutral-100 min-[375px]:h-[320px] sm:h-[420px] sm:rounded-xl lg:h-full lg:min-h-[580px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqScwP7H4fa8Xpzj-XyclwHIh2PWbsthFbDaHXW6Cup4XO-DyiqMv3zg9pOndGrBADW6SoTOlLKSLTgWGEZeYoNu2f1BvB9LlouA6Ti1WvQZAzCbxTiMAXzrLsOsxsU35vIz4MICnXQHmiwNzCy1Xoab50-iUnErjrUcqCgkzwjOWXczC85FtOOsgtv1fjuoteOBNr8KVeRkU2rpJ2JnPxFfxBT63GruiITe_56ijg6_cQoIPj0jHBYQ"
                alt="Premium fashion essentials including a black handbag, white sneakers, knitwear, sunglasses and accessories"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3">
                <div className="min-w-0 max-w-full rounded-lg border border-white/70 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-900 sm:text-xs sm:tracking-[0.16em]">
                    Curated Capsule
                  </p>
                  <p className="mt-1 break-words text-[10px] leading-4 text-neutral-500 sm:text-xs">
                    Footwear · Knitwear · Accessories
                  </p>
                </div>

                <span className="hidden shrink-0 rounded-lg bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 sm:inline-flex">
                  The essentials edit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
