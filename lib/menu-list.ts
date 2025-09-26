import {
  BadgePercent,
  LayoutGrid,
  LucideIcon,
  Package,
  ScrollText,
  Settings,
  Shield,
  ShoppingBag,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin',
          label: 'Dashboard',
          icon: LayoutGrid,
        },
      ],
    },
    {
      groupLabel: 'Menu',
      menus: [
        {
          href: '',
          label: 'Admin',
          icon: Shield,
          submenus: [
            {
              href: '/admin/data/organization',
              label: 'Organization',
            },
            {
              href: '/admin/data/branch',
              label: 'Branch',
            },
            {
              href: '/admin/data/warehouse',
              label: 'WareHouse',
            },
            {
              href: '/admin/data/product-unit',
              label: 'Product Unit',
            },
            {
              href: '/admin/data/product-group',
              label: 'Product Group',
            },
            {
              href: '/admin/data/products',
              label: 'Products',
            },
          ],
        },
        {
          href: '',
          label: 'Purchase',
          icon: ShoppingBag,
          submenus: [
            {
              href: '/admin/purchase/supplier',
              label: 'Supplier Info',
            },
            {
              href: '/admin/purchase/requisition',
              label: 'Requisition',
            },
            {
              href: '/admin/purchase/order',
              label: 'Order',
            },
            {
              href: '/admin/purchase/challan',
              label: 'Challan',
            },
            {
              href: '/admin/purchase/invoice',
              label: 'Invoice',
            },
            {
              href: '/admin/purchase/return',
              label: 'Return',
            },
          ],
        },
        {
          href: '',
          label: 'Sales',
          icon: BadgePercent,
          submenus: [
            {
              href: '/admin/sales/customer',
              label: 'Customer Info',
            },
            {
              href: '/admin/sales/quotation',
              label: 'Quotation',
            },
            {
              href: '/admin/sales/order',
              label: 'Order',
            },
            {
              href: '/admin/sales/challan',
              label: 'Challan',
            },
            {
              href: '/admin/sales/invoice',
              label: 'Invoice',
            },
            {
              href: '/admin/sales/return',
              label: 'Return',
            },
          ],
        },
        {
          href: '',
          label: 'Inventory',
          icon: Package,
          submenus: [
            {
              href: '/admin/inventory/stock-items',
              label: 'Stock Items',
            },
            {
              href: '/admin/inventory/damage-items',
              label: 'Damage',
            },
            // {
            //   href: '/admin/inventory/warehouse',
            //   label: 'Warehouse',
            // },
            // {
            //   href: '/admin/inventory/batch',
            //   label: 'Batch',
            // },
            {
              href: '/admin/inventory/opening-balance',
              label: 'Opening Balance',
            },
          ],
        },
        {
          href: '',
          label: 'Reports',
          icon: ScrollText,
          submenus: [
            {
              href: '/admin/report/purchase',
              label: 'Purchase Report',
            },
            {
              href: '/admin/report/sales',
              label: 'Sales Report',
            },
            {
              href: '/admin/report/monthly',
              label: 'Monthly Report',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/admin/account',
          label: 'Account',
          icon: Settings,
        },
      ],
    },
  ]
}
