
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { getUiLocale } from "@lib/data/ui-locale-actions"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const normalizeText = (value: string) =>
  value.toLowerCase().trim().replace(/[\s_]+/g, "-")

// CATEGORY NAME TRANSLATIONS
const categoryNameTranslations: Record<string, Record<string, string>> = {
  en: {
    shirts: "Shirts",
    shirt: "Shirt",
    pants: "Pants",
    trousers: "Trousers",
    shoes: "Shoes",
    tshirts: "T-Shirts",
    "t-shirts": "T-Shirts",
    shorts: "Shorts",
    sweatshirt: "Sweatshirt",
    sweatshirts: "Sweatshirts",
  },
  te: {
    shirts: "షర్ట్లు",
    shirt: "షర్ట్",
    pants: "ప్యాంట్లు",
    trousers: "ప్యాంట్లు",
    shoes: "షూస్",
    tshirts: "టీ-షర్ట్లు",
    "t-shirts": "టీ-షర్ట్లు",
    shorts: "షార్ట్స్",
    sweatshirt: "స్వెట్‌షర్ట్",
    sweatshirts: "స్వెట్‌షర్ట్లు",
  },
  hi: {
    shirts: "शर्ट",
    shirt: "शर्ट",
    pants: "पैंट",
    trousers: "पैंट",
    shoes: "जूते",
    tshirts: "टी-शर्ट",
    "t-shirts": "टी-शर्ट",
    shorts: "शॉर्ट्स",
    sweatshirt: "स्वेटशर्ट",
    sweatshirts: "स्वेटशर्ट",
  },
}

// CATEGORY DESCRIPTION TRANSLATIONS
const categoryDescriptionTranslations: Record<
  string,
  Record<string, string>
> = {
  en: {
    "shoes-for-running": "Shoes for running",
    "shirts-for-men": "Shirts for men",
    "pants-for-men": "Pants for men",
    "comfortable-shorts": "Comfortable shorts",
    "t-shirts-for-men": "T-Shirts for men",
    "this-is-t-shirts-category": "This is T-shirts Category",
    "best-shorts": "Best Shorts",
  },
  te: {
    "shoes-for-running": "పరుగెత్తడానికి షూస్",
    "shirts-for-men": "పురుషుల కోసం షర్ట్లు",
    "pants-for-men": "పురుషుల కోసం ప్యాంట్లు",
    "comfortable-shorts": "సౌకర్యవంతమైన షార్ట్స్",
    "t-shirts-for-men": "పురుషుల కోసం టీ-షర్ట్లు",
    "this-is-t-shirts-category": "ఇది టీ-షర్ట్ల కేటగిరీ",
    "best-shorts": "ఉత్తమ షార్ట్స్",
  },
  hi: {
    "shoes-for-running": "दौड़ने के लिए जूते",
    "shirts-for-men": "पुरुषों के लिए शर्ट",
    "pants-for-men": "पुरुषों के लिए पैंट",
    "comfortable-shorts": "आरामदायक शॉर्ट्स",
    "t-shirts-for-men": "पुरुषों के लिए टी-शर्ट",
    "this-is-t-shirts-category": "यह टी-शर्ट की श्रेणी है",
    "best-shorts": "बेहतरीन शॉर्ट्स",
  },
}

// TRANSLATE CATEGORY NAME
const getTranslatedCategoryName = (
  name: string,
  handle: string,
  locale: string
) => {
  const normalizedHandle = normalizeText(handle)
  const normalizedName = normalizeText(name)

  return (
    categoryNameTranslations[locale]?.[normalizedHandle] ??
    categoryNameTranslations[locale]?.[normalizedName] ??
    name
  )
}

// TRANSLATE CATEGORY DESCRIPTION
const getTranslatedCategoryDescription = (
  description: string,
  locale: string
) => {
  const normalizedDescription = normalizeText(description)

  return (
    categoryDescriptionTranslations[locale]?.[normalizedDescription] ??
    description
  )
}

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const localeValue = await getUiLocale()
  const locale = localeValue.split("-")[0]

  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents: HttpTypes.StoreProductCategory[] = []

  const getParents = (currentCategory: HttpTypes.StoreProductCategory) => {
    if (currentCategory.parent_category) {
      parents.push(currentCategory.parent_category)
      getParents(currentCategory.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="content-container w-full min-w-0 overflow-x-clip py-4 sm:py-6"
      data-testid="category-container"
    >
      <div className="flex w-full min-w-0 flex-col gap-5 md:flex-row md:items-start md:gap-8">
        {/* SIDEBAR */}
        <aside className="w-full min-w-0 md:w-[220px] md:shrink-0 lg:w-[240px]">
          <div className="w-full min-w-0 rounded-lg md:sticky md:top-28">
            <RefinementList
              sortBy={sort}
              data-testid="sort-by-container"
              hideOptionsPicker
            />
          </div>
        </aside>

        {/* MAIN CATEGORY AND PRODUCTS AREA */}
        <main className="w-full min-w-0 flex-1">
          {/* CATEGORY BREADCRUMB AND TITLE */}
          <div className="mb-4 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xl font-semibold sm:mb-6 sm:text-2xl">
            {parents.map((parent) => (
              <span
                key={parent.id}
                className="flex min-w-0 items-center gap-2 text-sm text-ui-fg-subtle sm:text-base"
              >
                <LocalizedClientLink
                  className="max-w-full break-words transition-colors hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {getTranslatedCategoryName(
                    parent.name,
                    parent.handle,
                    locale
                  )}
                </LocalizedClientLink>

                <span aria-hidden="true">/</span>
              </span>
            ))}

            <h1
              className="min-w-0 break-words text-xl font-bold sm:text-2xl"
              data-testid="category-page-title"
            >
              {getTranslatedCategoryName(
                category.name,
                category.handle,
                locale
              )}
            </h1>
          </div>

          {/* CATEGORY DESCRIPTION */}
          {category.description && (
            <div className="mb-5 max-w-3xl text-sm leading-6 text-ui-fg-subtle sm:mb-6">
              <p className="break-words">
                {getTranslatedCategoryDescription(
                  category.description,
                  locale
                )}
              </p>
            </div>
          )}

          {/* CHILD CATEGORIES */}
          {category.category_children?.length ? (
            <div className="mb-5 w-full min-w-0 sm:mb-6">
              <ul className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {category.category_children.map((child) => (
                  <li
                    key={child.id}
                    className="min-w-0 rounded-lg border border-ui-border-base px-3 py-2.5 transition-colors hover:border-ui-border-strong"
                  >
                    <InteractiveLink href={`/categories/${child.handle}`}>
                      <span className="break-words text-sm font-medium">
                        {getTranslatedCategoryName(
                          child.name,
                          child.handle,
                          locale
                        )}
                      </span>
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* PRODUCTS */}
          <div className="w-full min-w-0 overflow-x-clip">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
