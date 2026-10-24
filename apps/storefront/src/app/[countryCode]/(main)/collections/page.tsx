import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { listCollections } from "@lib/data/collections"

export const metadata: Metadata = {
  title: "Collections | Medusa Store",
  description: "Explore our product collections.",
}

export default async function CollectionsPage() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  const validCollections = collections ?? []

  return (
    <main className="content-container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Our Collections
        </h1>

        <p className="mt-2 text-gray-600">
          Explore our collections and find your favorite products.
        </p>
      </div>

      {validCollections.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No collections available
          </h2>

          <p className="mt-2 text-gray-500">
            Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validCollections.map((collection) => {
            const products = collection.products ?? []
            const productCount = products.length

            const imageUrl = products.find(
              (product) => product.thumbnail
            )?.thumbnail

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-5xl">🛍️</span>
                      <span className="text-sm">
                        Product Collection
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 transition group-hover:text-violet-700">
                    {collection.title}
                  </h2>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700">
                      <span className="mr-2" aria-hidden="true">
                        🛍️
                      </span>
                      {productCount}{" "}
                      {productCount === 1 ? "Product" : "Products"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {productCount > 0
                      ? `Explore ${productCount} ${
                          productCount === 1 ? "product" : "products"
                        } in this collection.`
                      : "Explore this collection and discover its products."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-medium text-violet-700">
                      Explore Collection
                    </span>

                    <span
                      className="text-lg text-violet-700 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
