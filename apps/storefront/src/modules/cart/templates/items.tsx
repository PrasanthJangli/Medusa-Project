
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
  locale?: "en" | "te" | "hi"
}

const translations = {
  en: {
    cart: "Cart",
    item: "Item",
    quantity: "Quantity",
    price: "Price",
    total: "Total",
  },
  te: {
    cart: "షాపింగ్ కార్ట్",
    item: "ఉత్పత్తి",
    quantity: "పరిమాణం",
    price: "ధర",
    total: "మొత్తం",
  },
  hi: {
    cart: "शॉपिंग कार्ट",
    item: "उत्पाद",
    quantity: "मात्रा",
    price: "कीमत",
    total: "कुल",
  },
}

const ItemsTemplate = ({
  cart,
  locale = "en",
}: ItemsTemplateProps) => {
  const items = cart?.items
  const t = translations[locale]

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">
          {t.cart}
        </Heading>
      </div>

      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">
              {t.item}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>{t.quantity}</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              {t.price}
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              {t.total}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "")
                    ? -1
                    : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
