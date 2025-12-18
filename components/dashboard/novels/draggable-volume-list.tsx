"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NovelVolumeService } from "@/features/novel-volume/service";
import { NovelVolume } from "@/features/novel/types";
import { Link } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { BookText, FileEdit, GripVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

interface DraggableVolumeListProps {
  readonly initialVolumes: NovelVolume[];
  readonly novelId: string;
}

interface DraggableVolumeRowProps {
  readonly volume: NovelVolume;
  readonly index: number;
  readonly novelId: string;
  readonly moveVolume: (dragIndex: number, hoverIndex: number) => void;
  readonly onOrderUpdate: (volumeId: string, newOrder: number) => Promise<void>;
}

const ITEM_TYPE = "VOLUME_ROW";

// Volume Cover Component - using native img for drag preview compatibility
function VolumeCover({ volume }: { readonly volume: NovelVolume }) {
  const coverUrl = getImageUrl(volume.cover_image_url);
  const hasCover = coverUrl && coverUrl !== "";

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-muted flex items-center justify-center"
      style={{ width: 50, height: 75 }}
    >
      {hasCover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={volume.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-bold text-muted-foreground">
          {getInitials(volume.title)}
        </span>
      )}
    </div>
  );
}

function DraggableVolumeRow({
  volume,
  index,
  novelId,
  moveVolume,
  onOrderUpdate,
}: DraggableVolumeRowProps) {
  const t = useTranslations("dashboard.volumes");

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, volumeId: volume.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: async (item, monitor) => {
      if (monitor.didDrop()) {
        const newOrder = index + 1;
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
    <TableRow
      ref={(node) => {
        drag(drop(node));
      }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
      className={isOver ? "bg-accent/50" : ""}
    >
      {/* Drag Handle + Cover */}
      <TableCell>
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
          <VolumeCover volume={volume} />
        </div>
      </TableCell>

      {/* Info */}
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{volume.title}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{t("stats.chapters", { count: volume.chapter_count })}</span>
            <span>•</span>
            <span>
              {t("stats.words", { count: volume.word_count.toLocaleString() })}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={volume.is_published ? "default" : "secondary"}>
          {volume.is_published ? t("status.published") : t("status.draft")}
        </Badge>
      </TableCell>

      {/* Actions - Direct buttons instead of dropdown */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link
              href={`/dashboard/novels/${novelId}/volumes/${volume.id}/chapters`}
              title={t("actions.viewChapters")}
            >
              <BookText className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link
              href={`/dashboard/novels/${novelId}/volumes/${volume.id}/edit`}
              title={t("actions.edit")}
            >
              <FileEdit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title={t("actions.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DraggableVolumeList({
  initialVolumes,
  novelId,
}: DraggableVolumeListProps) {
  const [volumes, setVolumes] = useState<NovelVolume[]>(initialVolumes);
  const t = useTranslations("dashboard.volumes");
  const tTable = useTranslations("dashboard.volumes.table");

  const moveVolume = (dragIndex: number, hoverIndex: number) => {
    const draggedVolume = volumes[dragIndex];
    const newVolumes = [...volumes];
    newVolumes.splice(dragIndex, 1);
    newVolumes.splice(hoverIndex, 0, draggedVolume);
    setVolumes(newVolumes);
  };

  const handleOrderUpdate = async (volumeId: string, newOrder: number) => {
    try {
      await NovelVolumeService.updateDisplayOrder(volumeId, newOrder);
      toast.success(t("orderUpdated"));
    } catch (error) {
      console.error("Failed to update volume order:", error);
      toast.error(t("orderError"));
      setVolumes(initialVolumes);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">{tTable("cover")}</TableHead>
              <TableHead>{tTable("info")}</TableHead>
              <TableHead className="w-[120px]">{tTable("status")}</TableHead>
              <TableHead className="w-[120px]">{tTable("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volumes.map((volume, index) => (
              <DraggableVolumeRow
                key={volume.id}
                volume={volume}
                index={index}
                novelId={novelId}
                moveVolume={moveVolume}
                onOrderUpdate={handleOrderUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </DndProvider>
  );
}
