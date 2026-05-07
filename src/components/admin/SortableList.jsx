"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";

export default function SortableList({ items, onReorder, getId, renderItem }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((it) => getId(it) === active.id);
    const newIndex = items.findIndex((it) => getId(it) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    onReorder(next);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2.5">
          {items.map((item, index) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {(handleProps) => renderItem(item, handleProps, index)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  const handleProps = {
    ...attributes,
    ...listeners,
    className:
      "st-icon-btn cursor-grab touch-none active:cursor-grabbing",
    "aria-label": "Drag to reorder",
    children: <LuGripVertical className="h-4 w-4" />,
  };

  return (
    <li ref={setNodeRef} style={style}>
      {children(handleProps)}
    </li>
  );
}
