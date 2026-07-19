import * as React from "react"
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  DropIndicator,
  useDragAndDrop,
} from "react-aria-components"
import { DotsSixVerticalIcon, XIcon } from "@phosphor-icons/react"

import { applyFieldMove } from "@nhic/currantui/lib/field-well"
import { filterChipVariants } from "@nhic/currantui/components/filter-chip"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  DropItem,
  ItemDropTarget,
  TextDropItem,
} from "react-aria-components"
import type {
  FieldMove,
  FieldWellDefinition,
  FieldWellValue,
  WellField,
} from "@nhic/currantui/lib/field-well"

declare const process: { env: { NODE_ENV?: string } }
const isDevelopment = process.env.NODE_ENV !== "production"

const FIELD_DRAG_TYPE = "application/x-nhic-field"

interface FieldDragPayload {
  field: WellField
  from?: string
  /** Per-FieldWellGroup instance id; drops from a different group are copies, never moves */
  groupId: string
}

async function readPayload(
  items: Array<DropItem>
): Promise<FieldDragPayload | null> {
  const item = items.find(
    (candidate): candidate is TextDropItem =>
      candidate.kind === "text" && candidate.types.has(FIELD_DRAG_TYPE)
  )
  if (!item) return null
  return JSON.parse(await item.getText(FIELD_DRAG_TYPE)) as FieldDragPayload
}

/** Position `target` (an insert-between or reorder target) resolves to in `items` */
function insertionIndex(
  items: Array<WellField>,
  target: ItemDropTarget
): number {
  const at = items.findIndex((item) => item.id === target.key)
  if (at === -1) return items.length
  return target.dropPosition === "before" ? at : at + 1
}

function FieldList({
  fields,
  groupId,
  className,
}: {
  fields: Array<WellField>
  groupId: string
  className?: string
}) {
  const byId = React.useMemo(
    () => new Map(fields.map((field) => [field.id, field])),
    [fields]
  )
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => {
        const field = byId.get(key as string)!
        const payload: FieldDragPayload = { field, groupId }
        return { [FIELD_DRAG_TYPE]: JSON.stringify(payload) }
      }),
  })

  return (
    <AriaGridList
      aria-label="Available fields"
      items={fields}
      dragAndDropHooks={dragAndDropHooks}
      className={cn("flex flex-col gap-1 outline-none", className)}
    >
      {(field) => (
        <AriaGridListItem
          textValue={field.label}
          className={cn(
            filterChipVariants({ active: false }),
            "cursor-grab justify-start gap-1.5 outline-none data-[dragging]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30"
          )}
        >
          <Button slot="drag" className="outline-none">
            <DotsSixVerticalIcon size={12} aria-hidden />
          </Button>
          {field.label}
        </AriaGridListItem>
      )}
    </AriaGridList>
  )
}

function FieldWell({
  definition,
  items,
  groupId,
  onMove,
}: {
  definition: FieldWellDefinition
  items: Array<WellField>
  groupId: string
  onMove: (move: FieldMove) => void
}) {
  const byId = React.useMemo(
    () => new Map(items.map((field) => [field.id, field])),
    [items]
  )

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => {
        const field = byId.get(key as string)!
        const payload: FieldDragPayload = { field, from: definition.id, groupId }
        return { [FIELD_DRAG_TYPE]: JSON.stringify(payload) }
      }),
    acceptedDragTypes: [FIELD_DRAG_TYPE],
    getDropOperation: () => "move",
    async onInsert(event) {
      const payload = await readPayload(event.items)
      if (!payload) return
      const from = payload.groupId === groupId ? payload.from : undefined
      onMove({
        field: payload.field,
        from,
        to: definition.id,
        index: insertionIndex(items, event.target),
      })
    },
    async onRootDrop(event) {
      const payload = await readPayload(event.items)
      if (!payload) return
      const from = payload.groupId === groupId ? payload.from : undefined
      onMove({ field: payload.field, from, to: definition.id })
    },
    onReorder(event) {
      const [key] = [...event.keys]
      const field = byId.get(key as string)
      if (!field) return
      onMove({
        field,
        from: definition.id,
        to: definition.id,
        index: insertionIndex(items, event.target),
      })
    },
    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className="my-0.5 h-0.5 rounded-full outline-none data-[drop-target]:bg-primary"
      />
    ),
  })

  return (
    <div role="group" aria-label={definition.label} className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">
        {definition.label}
      </span>
      <AriaGridList
        aria-label={definition.label}
        items={items}
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => (
          <span className="block rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground">
            Drag fields here
          </span>
        )}
        className="flex min-h-9 flex-col gap-1 outline-none"
      >
        {(field) => (
          <AriaGridListItem
            textValue={field.label}
            className={cn(
              filterChipVariants({ active: true }),
              "cursor-grab justify-between gap-2 outline-none data-[dragging]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Button slot="drag" className="outline-none">
                <DotsSixVerticalIcon size={12} aria-hidden />
              </Button>
              {field.aggregate ? `${field.aggregate} · ${field.label}` : field.label}
            </span>
            <button
              type="button"
              aria-label={`Remove ${field.label} from ${definition.label}`}
              onClick={() => onMove({ field, from: definition.id })}
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <XIcon size={12} />
            </button>
          </AriaGridListItem>
        )}
      </AriaGridList>
    </div>
  )
}

export interface FieldWellGroupProps {
  fields: Array<WellField>
  wells: Array<FieldWellDefinition>
  value: FieldWellValue
  onValueChange: (next: FieldWellValue) => void
  "aria-label": string
  className?: string
}

function FieldWellGroup({
  fields,
  wells,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}: FieldWellGroupProps) {
  const groupId = React.useId()

  React.useEffect(() => {
    if (!isDevelopment) return
    const wellIds = new Set(wells.map((well) => well.id))
    for (const key of Object.keys(value)) {
      if (!wellIds.has(key)) {
        console.warn(`FieldWellGroup: value contains unknown well id "${key}".`)
      }
    }
  }, [value, wells])

  const moveField = React.useCallback(
    (move: FieldMove) => {
      const next = applyFieldMove(value, wells, move)
      if (next !== value) onValueChange(next)
    },
    [value, wells, onValueChange]
  )

  return (
    <div role="group" aria-label={ariaLabel} className={cn("flex gap-4", className)}>
      <FieldList fields={fields} groupId={groupId} className="w-48 shrink-0" />
      <div className="flex flex-1 flex-col gap-3">
        {wells.map((well) => (
          <FieldWell
            key={well.id}
            definition={well}
            items={value[well.id] ?? []}
            groupId={groupId}
            onMove={moveField}
          />
        ))}
      </div>
    </div>
  )
}

export { FieldWellGroup }
