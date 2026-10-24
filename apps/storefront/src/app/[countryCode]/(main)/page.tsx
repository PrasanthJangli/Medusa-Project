
import type { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export const metadata: Metadata = {
  title: "MAISON MEDUSA | Discover Your Style",
  description:
    "Explore new arrivals, collections and everyday favourites at Maison Medusa.",
}

const categoryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    description: "Everyday looks, thoughtfully selected.",
    color: "#f2e6d8",
  },
  {
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    description: "Accessories that make a statement.",
    color: "#e8e4f2",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
    description: "Find your perfect finishing touch.",
    color: "#f4e3df",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    description: "Comfort meets effortless style.",
    color: "#e5eadf",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    description: "A little inspiration for your everyday.",
    color: "#e9e3dc",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    description: "Explore pieces for every season.",
    color: "#f1e8d5",
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [region, collectionData] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
  ])

  if (!region) return null

  const collections = collectionData?.collections ?? []

  const {
    response: { products: fetchedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
  })

  const products = fetchedProducts ?? []
  const featuredCollections = collections.slice(0, 6)

  const heroProduct = products[0]
  const secondProduct = products[1]
  const thirdProduct = products[2]

  return (
    <main className="maison-store min-h-screen overflow-hidden bg-white text-[#20251f]">
      <style>{`
        .maison-store {
          --forest: #173f35;
          --forest-dark: #102e27;
          --coral: #f47765;
          --cream: #faf7f0;
          --gold: #e8bd68;
        }
        .maison-store * { box-sizing: border-box; }
        .maison-store a { text-decoration: none; }
        .maison-store .editorial {
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: -1.5px;
        }
        .maison-store .announcement {
          background: var(--forest);
          color: white;
          text-align: center;
          padding: 11px 16px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .maison-store .header-inner {
          max-width: 1440px;
          min-height: 82px;
          padding: 16px 5%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .maison-store .brand {
          color: var(--forest);
          font-family: Georgia, serif;
          font-size: 24px;
          letter-spacing: 2.5px;
          white-space: nowrap;
        }
        .maison-store .brand span {
          display: block;
          margin-top: 5px;
          font-family: Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 4px;
          text-align: center;
        }
        .maison-store .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          color: #393c37;
          font-size: 12px;
        }
        .maison-store .nav-links a:hover,
        .maison-store .header-actions a:hover,
        .maison-store .footer-links a:hover {
          color: var(--coral);
        }
        .maison-store .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--forest);
          font-size: 12px;
          white-space: nowrap;
        }
        .maison-store .hero {
          background: var(--cream);
          padding: 55px 5% 62px;
        }
        .maison-store .hero-inner {
          max-width: 1320px;
          margin: auto;
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          align-items: center;
          gap: 54px;
        }
        .maison-store .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--forest);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.2px;
          text-transform: uppercase;
        }
        .maison-store .eyebrow:before {
          content: '';
          width: 25px;
          height: 1px;
          background: var(--coral);
        }
        .maison-store .hero h1 {
          max-width: 570px;
          margin: 24px 0;
          color: var(--forest);
          font-size: clamp(46px, 5.4vw, 78px);
          line-height: 1.04;
        }
        .maison-store .hero h1 em {
          color: var(--coral);
          font-weight: 400;
        }
        .maison-store .hero-copy {
          max-width: 440px;
          color: #65665e;
          font-size: 14px;
          line-height: 1.9;
        }
        .maison-store .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .maison-store .button {
          min-height: 46px;
          padding: 14px 20px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          background: var(--forest);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .6px;
          transition: background .2s, transform .2s;
        }
        .maison-store .button:hover {
          background: var(--forest-dark);
          transform: translateY(-2px);
        }
        .maison-store .button-outline {
          background: transparent;
          color: var(--forest);
          border: 1px solid #b9c3b9;
        }
        .maison-store .button-outline:hover {
          background: var(--forest);
          color: white;
        }
        .maison-store .hero-notes {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 32px;
          color: #62645c;
          font-size: 10px;
        }
        .maison-store .hero-notes span:before {
          content: '✓';
          color: var(--forest);
          font-weight: 700;
          margin-right: 7px;
        }
        .maison-store .hero-art {
          min-height: 500px;
          position: relative;
          display: grid;
          grid-template-columns: 1fr .72fr;
          grid-template-rows: 1fr .72fr;
          gap: 13px;
        }
        .maison-store .hero-photo {
          overflow: hidden;
          background: #e7ddd0;
        }
        .maison-store .hero-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .maison-store .hero-photo-main {
          grid-row: 1 / 3;
          min-height: 500px;
        }
        .maison-store .hero-photo-top { min-height: 245px; }
        .maison-store .hero-photo-bottom { min-height: 200px; }
        .maison-store .floating-note {
          position: absolute;
          left: -28px;
          bottom: 35px;
          padding: 17px 20px;
          background: white;
          box-shadow: 0 10px 35px #1c33221a;
          color: var(--forest);
          font-family: Georgia, serif;
          font-size: 19px;
          line-height: 1.3;
        }
        .maison-store .floating-note small {
          display: block;
          margin-top: 7px;
          font-family: Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 1.4px;
          color: #77786f;
        }
        .maison-store .section {
          max-width: 1440px;
          padding: 72px 5%;
          margin: auto;
        }
        .maison-store .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 30px;
        }
        .maison-store .section-heading h2 {
          margin: 12px 0 0;
          color: var(--forest);
          font-size: clamp(30px, 4vw, 47px);
          line-height: 1.12;
        }
        .maison-store .section-heading p {
          max-width: 430px;
          margin: 12px 0 0;
          color: #77776e;
          font-size: 13px;
          line-height: 1.8;
        }
        .maison-store .text-link {
          color: var(--forest);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .6px;
          border-bottom: 1px solid #a9b6aa;
          padding-bottom: 7px;
          white-space: nowrap;
        }
        .maison-store .category-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 23px;
        }
        .maison-store .category-card {
          display: block;
          min-width: 0;
          color: var(--forest);
        }
        .maison-store .category-image {
          aspect-ratio: 1 / .85;
          overflow: hidden;
          background: #eee8df;
        }
        .maison-store .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .45s;
        }
        .maison-store .category-card:hover .category-image img {
          transform: scale(1.05);
        }
        .maison-store .category-info {
          padding: 16px 0 4px;
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }
        .maison-store .category-info h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 400;
        }
        .maison-store .category-info p {
          margin: 7px 0 0;
          color: #77776e;
          font-size: 11px;
          line-height: 1.6;
        }
        .maison-store .arrow {
          font-size: 20px;
          color: var(--coral);
        }
        .maison-store .products-section { background: #faf8f3; }
        .maison-store .product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 21px;
        }
        .maison-store .product-card {
          min-width: 0;
          overflow: hidden;
          background: white;
          padding: 12px;
          border: 1px solid #eeeae2;
          transition: box-shadow .2s, transform .2s;
        }
        .maison-store .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px #173f3510;
        }
        .maison-store .product-card > * { min-width: 0; }
        .maison-store .empty-products {
          grid-column: 1 / -1;
          padding: 45px 20px;
          background: white;
          text-align: center;
          color: #6b6d64;
          line-height: 1.8;
        }
        .maison-store .promo { padding: 0 5% 72px; }
        .maison-store .promo-inner {
          max-width: 1320px;
          min-height: 360px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f7e4de;
          overflow: hidden;
        }
        .maison-store .promo-copy {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;
        }
        .maison-store .promo-copy h2 {
          max-width: 450px;
          margin: 18px 0;
          color: var(--forest);
          font-size: clamp(34px, 4vw, 52px);
          line-height: 1.1;
        }
        .maison-store .promo-copy p {
          max-width: 390px;
          color: #68665f;
          font-size: 13px;
          line-height: 1.9;
        }
        .maison-store .promo-image { min-height: 340px; }
        .maison-store .promo-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .maison-store .story {
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          align-items: center;
          gap: 65px;
        }
        .maison-store .story-image {
          aspect-ratio: 1 / 1.05;
          overflow: hidden;
          background: #eee5d9;
        }
        .maison-store .story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .maison-store .story-copy h2 {
          margin: 17px 0;
          color: var(--forest);
          font-size: clamp(36px, 4.2vw, 56px);
          line-height: 1.1;
        }
        .maison-store .story-copy p {
          color: #6b6c63;
          font-size: 13px;
          line-height: 2;
        }
        .maison-store .benefits {
          background: var(--cream);
          padding: 35px 5%;
        }
        .maison-store .benefits-inner {
          max-width: 1320px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .maison-store .benefit {
          padding: 18px;
          text-align: center;
        }
        .maison-store .benefit-icon {
          color: var(--coral);
          font-size: 25px;
        }
        .maison-store .benefit h3 {
          margin: 12px 0 7px;
          color: var(--forest);
          font-family: Georgia, serif;
          font-size: 19px;
          font-weight: 400;
        }
        .maison-store .benefit p {
          margin: 0;
          color: #73746b;
          font-size: 11px;
          line-height: 1.8;
        }
        .maison-store .newsletter {
          background: var(--forest);
          color: white;
          padding: 57px 5%;
          text-align: center;
        }
        .maison-store .newsletter-inner { max-width: 620px; margin: auto; }
        .maison-store .newsletter h2 {
          margin: 14px 0;
          font-family: Georgia, serif;
          font-size: clamp(32px, 4vw, 47px);
          font-weight: 400;
        }
        .maison-store .newsletter p {
          color: #d6dfd8;
          font-size: 12px;
          line-height: 1.8;
        }
        .maison-store .newsletter-link {
          display: inline-flex;
          margin-top: 15px;
          padding: 14px 21px;
          background: var(--gold);
          color: var(--forest-dark);
          font-size: 11px;
          font-weight: 700;
        }
        .maison-store .footer {
          padding: 48px 5% 25px;
          background: white;
        }
        .maison-store .footer-inner {
          max-width: 1320px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 40px;
        }
        .maison-store .footer-description {
          max-width: 300px;
          color: #77776e;
          font-size: 12px;
          line-height: 1.9;
        }
        .maison-store .footer h3 {
          margin: 0 0 15px;
          color: var(--forest);
          font-size: 11px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .maison-store .footer-links {
          display: grid;
          gap: 12px;
          color: #6b6d64;
          font-size: 12px;
        }
        .maison-store .footer-bottom {
          max-width: 1320px;
          margin: 35px auto 0;
          padding-top: 20px;
          border-top: 1px solid #eeeae3;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #85857d;
          font-size: 10px;
        }
        @media (max-width: 1000px) {
          .maison-store .header-inner { flex-wrap: wrap; }
          .maison-store .nav-links {
            order: 3;
            width: 100%;
            gap: 20px;
          }
          .maison-store .hero-inner { gap: 30px; }
          .maison-store .hero-art { min-height: 410px; }
          .maison-store .hero-photo-main { min-height: 410px; }
          .maison-store .hero-photo-top { min-height: 200px; }
          .maison-store .hero-photo-bottom { min-height: 180px; }
          .maison-store .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .maison-store .story { gap: 35px; }
        }
        @media (max-width: 650px) {
          .maison-store .announcement { font-size: 8px; letter-spacing: 1px; }
          .maison-store .header-inner { padding: 15px 5%; gap: 15px; }
          .maison-store .brand { font-size: 19px; }
          .maison-store .nav-links {
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 4px;
            font-size: 11px;
          }
          .maison-store .header-actions { gap: 10px; font-size: 10px; }
          .maison-store .hero { padding: 40px 5% 45px; }
          .maison-store .hero-inner { grid-template-columns: 1fr; gap: 30px; }
          .maison-store .hero h1 { font-size: 49px; }
          .maison-store .hero-art { min-height: 340px; gap: 8px; }
          .maison-store .hero-photo-main { min-height: 340px; }
          .maison-store .hero-photo-top,
          .maison-store .hero-photo-bottom { min-height: 160px; }
          .maison-store .floating-note {
            left: -5px;
            bottom: 15px;
            padding: 12px;
            font-size: 15px;
          }
          .maison-store .section { padding: 46px 5%; }
          .maison-store .section-heading {
            align-items: start;
            flex-direction: column;
          }
          .maison-store .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px 12px;
          }
          .maison-store .category-info h3 { font-size: 17px; }
          .maison-store .category-info p { font-size: 10px; }
          .maison-store .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .maison-store .product-card { padding: 7px; }
          .maison-store .promo { padding: 0 5% 45px; }
          .maison-store .promo-inner { grid-template-columns: 1fr; }
          .maison-store .promo-copy { padding: 32px 24px; }
          .maison-store .promo-image { min-height: 230px; }
          .maison-store .story { grid-template-columns: 1fr; gap: 25px; }
          .maison-store .benefits-inner {
            grid-template-columns: 1fr;
            gap: 5px;
          }
          .maison-store .benefit { padding: 12px; }
          .maison-store .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 28px 18px;
          }
          .maison-store .footer-brand-column { grid-column: 1 / -1; }
          .maison-store .footer-bottom { flex-direction: column; }
        }
      `}</style>

      {/* Announcement */}
      <div className="announcement">
        NEW SEASON, NEW FINDS — DISCOVER YOUR NEXT FAVOURITE
      </div>

      {/* Navigation */}
      <header className="border-b border-[#eeeae3] bg-white">
        <div className="header-inner">
          <LocalizedClientLink href="/" className="brand">
            MAISON MEDUSA
            <span>STYLE · WITH · SOUL</span>
          </LocalizedClientLink>

          <nav className="nav-links" aria-label="Main navigation">
            <LocalizedClientLink href="/store">New Arrivals</LocalizedClientLink>
            <LocalizedClientLink href="/store">Shop All</LocalizedClientLink>
            <LocalizedClientLink href="/collections">Collections</LocalizedClientLink>
            <LocalizedClientLink href="/account">My Account</LocalizedClientLink>
          </nav>

          <div className="header-actions">
            <LocalizedClientLink href="/store">Search ↗</LocalizedClientLink>
            <LocalizedClientLink href="/account">Account</LocalizedClientLink>
            <LocalizedClientLink href="/cart">Bag ↗</LocalizedClientLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">A little more you</div>

            <h1 className="editorial">
              Find your style.
              <br />
              <em>Make it yours.</em>
            </h1>

            <p className="hero-copy">
              Discover thoughtfully selected pieces for your everyday.
              Explore our collections and find something that feels
              unmistakably you.
            </p>

            <div className="button-row">
              <LocalizedClientLink href="/store" className="button">
                EXPLORE THE STORE <span>↗</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/collections"
                className="button button-outline"
              >
                OUR COLLECTIONS
              </LocalizedClientLink>
            </div>

            <div className="hero-notes">
              <span>Discover new favourites</span>
              <span>Explore the collection</span>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-photo hero-photo-main">
              <img
                src={
                  heroProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
                }
                alt={heroProduct?.title ?? "Fashion collection inspiration"}
              />
            </div>

            <div className="hero-photo hero-photo-top">
              <img
                src={
                  secondProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85"
                }
                alt={secondProduct?.title ?? "Everyday accessories"}
              />
            </div>

            <div className="hero-photo hero-photo-bottom">
              <img
                src={
                  thirdProduct?.thumbnail ||
                  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85"
                }
                alt={thirdProduct?.title ?? "Footwear inspiration"}
              />
            </div>

            <div className="floating-note">
              Your style,
              <br />
              your story.
              <small>MAISON MEDUSA</small>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Explore your favourites</div>
            <h2 className="editorial">Find your kind of style.</h2>
            <p>
              Take a look around. Your next favourite piece might be just a
              click away.
            </p>
          </div>

          <LocalizedClientLink href="/collections" className="text-link">
            VIEW COLLECTIONS ↗
          </LocalizedClientLink>
        </div>

        <div className="category-grid">
          {featuredCollections.length > 0 ? (
            featuredCollections.map((collection, index) => {
              const visual = categoryImages[index % categoryImages.length]

              return (
                <LocalizedClientLink
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="category-card"
                >
                  <div
                    className="category-image"
                    style={{ backgroundColor: visual.color }}
                  >
                    <img
                      src={visual.image}
                      alt={collection.title ?? "Explore collection"}
                      loading="lazy"
                    />
                  </div>

                  <div className="category-info">
                    <div>
                      <h3>{collection.title}</h3>
                      <p>{visual.description}</p>
                    </div>
                    <span className="arrow">↗</span>
                  </div>
                </LocalizedClientLink>
              )
            })
          ) : (
            categoryImages.slice(0, 3).map((visual, index) => (
              <LocalizedClientLink
                key={visual.image}
                href="/store"
                className="category-card"
              >
                <div
                  className="category-image"
                  style={{ backgroundColor: visual.color }}
                >
                  <img
                    src={visual.image}
                    alt="Explore our store"
                    loading="lazy"
                  />
                </div>

                <div className="category-info">
                  <div>
                    <h3>{["Clothing", "Accessories", "Everyday Style"][index]}</h3>
                    <p>Explore the store and discover your favourites.</p>
                  </div>
                  <span className="arrow">↗</span>
                </div>
              </LocalizedClientLink>
            ))
          )}
        </div>
      </section>

      {/* Real Medusa products */}
      <section className="products-section">
        <div className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Fresh from the store</div>
              <h2 className="editorial">Discover your next favourite.</h2>
              <p>Explore products currently available in our store.</p>
            </div>

            <LocalizedClientLink href="/store" className="text-link">
              VIEW ALL PRODUCTS ↗
            </LocalizedClientLink>
          </div>

          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product.id}>
                  <ProductPreview product={product} region={region} />
                </div>
              ))
            ) : (
              <div className="empty-products">
                <h3 className="editorial">
                  Your next favourite is waiting.
                </h3>
                <p>
                  Products will appear here when they are available in your
                  Medusa store.
                </p>
                <LocalizedClientLink href="/store" className="button">
                  EXPLORE THE STORE ↗
                </LocalizedClientLink>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotion */}
      <section className="promo">
        <div className="promo-inner">
          <div className="promo-copy">
            <div className="eyebrow">A fresh perspective</div>

            <h2 className="editorial">
              Everyday pieces.
              <br />
              Extraordinary feeling.
            </h2>

            <p>
              Style is in the details. Explore our store and find pieces that
              fit your own way of expressing yourself.
            </p>

            <LocalizedClientLink href="/store" className="button">
              FIND YOUR FAVOURITES ↗
            </LocalizedClientLink>
          </div>

          <div className="promo-image">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
              alt="A carefully styled fashion collection"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="section">
        <div className="story">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
              alt="Fashion inspiration for everyday style"
              loading="lazy"
            />
          </div>

          <div className="story-copy">
            <div className="eyebrow">The Maison Medusa edit</div>

            <h2 className="editorial">
              The art of everyday style.
            </h2>

            <p>
              Personal style is more than what you wear. It is the little
              details, the pieces you reach for, and the confidence to make
              them your own.
            </p>

            <p>
              Explore our collections and discover something that fits your
              everyday.
            </p>

            <div className="button-row">
              <LocalizedClientLink href="/collections" className="button">
                EXPLORE COLLECTIONS ↗
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="benefits-inner">
          <div className="benefit">
            <div className="benefit-icon">✳</div>
            <h3>Find your favourites</h3>
            <p>
              Browse the products and collections available in our store.
            </p>
          </div>

          <div className="benefit">
            <div className="benefit-icon">◇</div>
            <h3>Made for your style</h3>
            <p>
              Discover different looks and choose pieces that feel like you.
            </p>
          </div>

          <div className="benefit">
            <div className="benefit-icon">♡</div>
            <h3>A little inspiration</h3>
            <p>
              Find fresh ideas for everyday outfits and special moments.
            </p>
          </div>
        </div>
      </section>

      {/* Store call to action */}
      <section className="newsletter">
        <div className="newsletter-inner">
          <div className="eyebrow" style={{ color: "#e8bd68" }}>
            A note from Maison Medusa
          </div>

          <h2>Something lovely is just around the corner.</h2>

          <p>
            Visit our store to explore the latest products and collections.
            Discover your next favourite whenever you are ready.
          </p>

          <LocalizedClientLink href="/store" className="newsletter-link">
            EXPLORE THE STORE ↗
          </LocalizedClientLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand-column">
            <LocalizedClientLink href="/" className="brand">
              MAISON MEDUSA
              <span>STYLE · WITH · SOUL</span>
            </LocalizedClientLink>

            <p className="footer-description">
              Discover your style, explore our collections and find your next
              favourite in the Maison Medusa store.
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              <LocalizedClientLink href="/store">Shop All</LocalizedClientLink>
              <LocalizedClientLink href="/collections">
                Collections
              </LocalizedClientLink>
              <LocalizedClientLink href="/account">My Account</LocalizedClientLink>
            </div>
          </div>

          <div>
            <h3>Your Store</h3>
            <div className="footer-links">
              <LocalizedClientLink href="/cart">Shopping Bag</LocalizedClientLink>
              <LocalizedClientLink href="/account">
                Account Details
              </LocalizedClientLink>
              <LocalizedClientLink href="/store">
                Continue Shopping
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Maison Medusa.</span>
          <span>Made for your everyday style.</span>
        </div>
      </footer>
    </main>
  )
}
