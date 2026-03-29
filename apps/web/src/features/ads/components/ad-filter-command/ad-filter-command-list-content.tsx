import { Command, ScrollArea } from '@lumo/ui/components'
import type { Icon } from '@lumo/ui/icons'
import { CommandItem } from '~/features/ads/components/ad-filter-command/ad-filter-command-item'

export type ListFilterPageItem = { id: string; label: string }

export type ListFilterPage = {
  type: 'list'
  icon: Icon
  label: string
  placeholder: string
  data: { label: string; data: ListFilterPageItem[] }[]
  onSelect?: (item: ListFilterPageItem) => void
  disabled?: boolean
  active?: boolean
}

type ListStyles = {
  commandScrollAreaViewport: () => string
  commandScrollAreaScrollbar: () => string
  commandList: () => string
  commandItem: () => string
}

type ListFilterContentProps = {
  page: ListFilterPage
  scrollViewportRef: React.RefObject<HTMLDivElement | null>
  styles: ListStyles
}

function ListFilterContent(props: ListFilterContentProps) {
  const { page, scrollViewportRef, styles } = props

  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport
        className={styles.commandScrollAreaViewport()}
        ref={scrollViewportRef}
      >
        <ScrollArea.Content>
          <Command.List
            className={styles.commandList()}
            key={page.label}
          >
            {page.data.map((group) => (
              <Command.Group
                heading={group.label}
                key={group.label}
              >
                {group.data.map((item) => (
                  <CommandItem
                    className={styles.commandItem()}
                    key={item.id}
                    value={item.id}
                    onSelect={() => page.onSelect?.(item)}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </ScrollArea.Content>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className={styles.commandScrollAreaScrollbar()}
        >
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  )
}

export { ListFilterContent, type ListFilterContentProps }
