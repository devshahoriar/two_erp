'use client'

import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getMenuList } from '@/lib/menu-list'
import { cn } from '@/lib/utils'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname()
  const menuList = getMenuList()

  return (
    <ScrollArea className="[&>div>div[style]]:!block px-3 max-h-[90vh]">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-full items-start space-y-1 px-3">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <div className="w-full flex justify-center items-center">
                  <Ellipsis size={18} />
                </div>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <Button
                        variant={
                          (active === undefined && pathname.endsWith(href)) ||
                          active
                            ? 'secondary'
                            : 'ghost'
                        }
                        className="w-full justify-start h-8 mb-1"
                        asChild
                        size="sm"
                      >
                        <Link href={href}>
                          <span className={cn(isOpen === false ? '' : 'mr-4')}>
                            <Icon size={18} />
                          </span>
                          <p
                            className={cn(
                              'max-w-[200px] truncate',
                              isOpen === false
                                ? '-translate-x-96 opacity-0'
                                : 'translate-x-0 opacity-100'
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end"></li>
        </ul>
      </nav>
    </ScrollArea>
  )
}
