import { brands, chart, configuration, inbox, product, refunds, support, categories } from "../asset/svg"

export const MENU_ITEMS = [
    {
        title: "Analytics",
        is_active: true,
        src: chart,
    },
    {
        title: "Orders",
        src: inbox,
    },
    {
        title: "Products",
        src: product,
    },
    {
        title: "Categories",
        src: categories,
    },
    {
        title: "Brands",
        src: brands,
    },
    {
        title: "Refunds",
        src: refunds,
    },
]

export const MENU_ITEMS_MORE = [
    {
        title: "Support",
        src: support,
    },
    {
        title: "Configuration",
        src: configuration,
    },
]