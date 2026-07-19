type Listener = () => void

let activeType: string | null = null
const listeners = new Set<Listener>()

function notify(): void {
  for (const listener of listeners) listener()
}

/** Marks `type` as the widget currently being dragged from a palette. */
function startWidgetDrag(type: string): void {
  activeType = type
  notify()
}

function endWidgetDrag(): void {
  if (activeType === null) return
  activeType = null
  notify()
}

function subscribeWidgetDrag(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getActiveWidgetDrag(): string | null {
  return activeType
}

export { startWidgetDrag, endWidgetDrag, subscribeWidgetDrag, getActiveWidgetDrag }
