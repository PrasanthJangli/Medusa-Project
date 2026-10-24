
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full bg-[#fbfbfb] px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] lg:rounded-3xl">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">

          {/* LEFT: Editorial content */}
          <div className="order-1 flex items-center px-6 py-12 sm:px-10 sm:py-16 md:px-14 lg:px-12 lg:py-20 xl:px-16">
            <div className="w-full max-w-xl">

              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="h-[2px] w-9 bg-violet-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-700">
                  New Season Collection
                </span>
              </div>

              <h1 className="text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-neutral-950 sm:text-5xl md:text-6xl xl:text-[4.5rem]">
                Everyday
                <br />
                Essentials.
                <br />
                <span className="text-violet-500">Elevated.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
                Discover thoughtfully selected styles and everyday essentials
                designed to fit your lifestyle.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <LocalizedClientLink
                  href="/store"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-neutral-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-800"
                >
                  Shop Now
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/collections"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-transparent px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-50"
                >
                  Explore Collection
                </LocalizedClientLink>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-neutral-200 pt-5 text-xs font-medium tracking-wide text-neutral-500 sm:text-sm">
                <span>New arrivals</span>
                <span className="text-violet-400">•</span>
                <span>Curated collections</span>
                <span className="text-violet-400">•</span>
                <span>Easy shopping</span>
              </div>

            </div>
          </div>

          {/* RIGHT: Large editorial fashion photograph */}
          <div className="order-2 min-h-[320px] p-3 pt-0 sm:min-h-[420px] sm:p-5 sm:pt-0 lg:min-h-[620px] lg:p-5">
            <div className="group relative h-full min-h-[320px] overflow-hidden rounded-xl bg-neutral-100 sm:min-h-[420px] lg:min-h-[580px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqScwP7H4fa8Xpzj-XyclwHIh2PWbsthFbDaHXW6Cup4XO-DyiqMv3zg9pOndGrBADW6SoTOlLKSLTgWGEZeYoNu2f1BvB9LlouA6Ti1WvQZAzCbxTiMAXzrLsOsxsU35vIz4MICnXQHmiwNzCy1Xoab50-iUnErjrUcqCgkzwjOWXczC85FtOOsgtv1fjuoteOBNr8KVeRkU2rpJ2JnPxFfxBT63GruiITe_56ijg6_cQoIPj0jHBYQ"
                alt="Premium fashion essentials including a black handbag, white sneakers, knitwear, sunglasses and accessories"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-lg border border-white/70 bg-white/95 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-900 sm:text-xs">
                    Curated Capsule
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Footwear · Knitwear · Accessories
                  </p>
                </div>

                <span className="hidden rounded-lg bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 sm:inline-flex">
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
