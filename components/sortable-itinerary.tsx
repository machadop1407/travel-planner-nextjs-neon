"use client";
import React, { useId, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Import the server action to update order in the database.
import { reorderItineraries } from "@/lib/actions/reorder-location";

export interface ItineraryItem {
  id: string;
  location: string;
  lat: number;
  lng: number;
  order: number;
}

interface SortableItineraryProps {
  items: ItineraryItem[];
  tripId: string;
}

function SortableItem({ item }: { item: ItineraryItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800">{item.location}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">
          {`Lat: ${item.lat}, Lng: ${item.lng}`}
        </p>
      </div>
      <div className="text-sm text-gray-600">Day {item.order}</div>
    </div>
  );
}

export default function SortableItinerary({
  items,
  tripId,
}: SortableItineraryProps) {
  const [localItems, setLocalItems] = useState(items);
  const id = useId();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = localItems.findIndex((item) => item.id === active.id);
      const newIndex = localItems.findIndex((item) => item.id === over!.id);
      const newItems = arrayMove(localItems, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );
      setLocalItems(newItems);
      // Update the backend with the new order.
      await reorderItineraries(
        tripId,
        newItems.map((item) => item.id)
      );
    }
  };

  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {localItems.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
