import { cn } from '@/lib/utils'

type PROPS = {
  title: string
  children: React.ReactNode
  length: string | number
}

export const AdminPageTopBar = ({
  title = 'Total Items',
  children,
  length = 0,
}: PROPS) => {
  return (
    <div className="flex justify-between items-center bg-background/95 px-3 py-2">
      <div className="flex items-center gap-2">
        <h1>{title}</h1>
        <span className="bg-black/10 dark:text-white font-semibold text-sm px-2 py-1 rounded-lg overflow-hidden">
          {length}
        </span>
      </div>
      <div className="flex gap-2 items-center">{children}</div>
    </div>
  )
}

export const AdminPageBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('bg-background/95 mt-4 p-3', className)}>{children}</div>
}
