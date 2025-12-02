"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { NovelVolume } from "@/lib/api/models/content/novel";
import { updateVolumeDisplayOrder } from "@/lib/api/volumes";
import { BookText, FileEdit, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

interface DraggableVolumeListProps {
  initialVolumes: NovelVolume[];
  novelId: string;
}

interface DraggableVolumeCardProps {
  volume: NovelVolume;
  index: number;
  novelId: string;
  moveVolume: (dragIndex: number, hoverIndex: number) => void;
  onOrderUpdate: (volumeId: string, newOrder: number) => Promise<void>;
}

const ITEM_TYPE = "VOLUME_CARD";

function DraggableVolumeCard({
  volume,
  index,
  novelId,
  moveVolume,
  onOrderUpdate,
}: DraggableVolumeCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, volumeId: volume.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: async (item, monitor) => {
      if (monitor.didDrop()) {
        // Update display order when drop is successful
        const newOrder = index + 1; // display_order is 1-indexed
        await onOrderUpdate(item.volumeId, newOrder);
      }
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number; volumeId: string }) => {
      if (item.index !== index) {
        moveVolume(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
    >
      <Card
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
        }}
        className={
          isOver ? "border-primary shadow-lg transition-all" : "transition-all"
        }
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">
                    Volume {volume.volume_number}: {volume.title}
                  </CardTitle>
                  <Badge
                    variant={volume.is_published ? "default" : "secondary"}
                  >
                    {volume.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{volume.chapter_count} chapters</span>
              <span>{volume.word_count.toLocaleString()} words</span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/dashboard/novels/${novelId}/volumes/${volume.id}/chapters`}
                >
                  <BookText className="h-4 w-4 mr-2" />
                  Chapters
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/dashboard/novels/${novelId}/volumes/${volume.id}/edit`}
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Sửa
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DraggableVolumeList({
  initialVolumes,
  novelId,
}: DraggableVolumeListProps) {
  const [volumes, setVolumes] = useState<NovelVolume[]>(initialVolumes);

  const moveVolume = (dragIndex: number, hoverIndex: number) => {
    const draggedVolume = volumes[dragIndex];
    const newVolumes = [...volumes];
    newVolumes.splice(dragIndex, 1);
    newVolumes.splice(hoverIndex, 0, draggedVolume);
    setVolumes(newVolumes);
  };

  const handleOrderUpdate = async (volumeId: string, newOrder: number) => {
    try {
      await updateVolumeDisplayOrder(volumeId, newOrder);
      toast.success("Đã cập nhật thứ tự volume");
    } catch (error) {
      console.error("Failed to update volume order:", error);
      toast.error("Không thể cập nhật thứ tự volume");
      // Revert to initial order on error
      setVolumes(initialVolumes);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid gap-4">
        {volumes.map((volume, index) => (
          <DraggableVolumeCard
            key={volume.id}
            volume={volume}
            index={index}
            novelId={novelId}
            moveVolume={moveVolume}
            onOrderUpdate={handleOrderUpdate}
          />
        ))}
      </div>
    </DndProvider>
  );
}
