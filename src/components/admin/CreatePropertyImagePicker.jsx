"use client";

import { useCallback, useState } from "react";
import { Upload, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CreatePropertyImagePicker({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (newFiles) => {
      const valid = Array.from(newFiles || []).filter((f) => f && f.type?.startsWith("image/"));
      if (valid.length) setFiles((prev) => [...prev, ...valid]);
    },
    [setFiles]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback(
    (index) => setFiles((prev) => prev.filter((_, i) => i !== index)),
    [setFiles]
  );

  const setMain = useCallback(
    (index) => {
      setFiles((prev) => {
        const next = [...prev];
        const [main] = next.splice(index, 1);
        return [main, ...next];
      });
    },
    [setFiles]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Перетащите фото сюда или нажмите для выбора
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Можно выбрать несколько изображений
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file, index) => {
            const isMain = index === 0;
            return (
              <div
                key={`${file.name}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  {isMain && (
                    <div className="absolute left-2 top-2">
                      <Badge variant="default" className="shadow-md">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Основное
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 p-2">
                  {!isMain && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setMain(index)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Главная
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className={isMain ? "flex-1" : ""}
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="px-2 pb-2">
                  <p className="truncate text-[10px] text-muted-foreground" title={file.name}>
                    {file.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
