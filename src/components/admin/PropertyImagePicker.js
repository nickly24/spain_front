'use client';

import { useEffect, useMemo, useState } from "react";

function createPreviewObjects(fileList) {
  const files = Array.from(fileList || []);
  return files.map((file, index) => ({
    sourceIndex: index,
    file,
  }));
}

export function PropertyImagePicker() {
  const [items, setItems] = useState([]);
  const [mainOrder, setMainOrder] = useState(0);

  // Создаём object URL для предпросмотра
  const previews = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        url: URL.createObjectURL(item.file),
      })),
    [items],
  );

  useEffect(() => {
    return () => {
      // Чистим object URLs при размонтировании
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFilesChange = (event) => {
    const fileList = event.target.files;
    const next = createPreviewObjects(fileList);
    setItems(next);
    setMainOrder(0);
  };

  const handleMakeMain = (orderIndex) => {
    setMainOrder(orderIndex);
  };

  const handleRemove = (orderIndex) => {
    setItems((prev) => {
      const next = prev.filter((_, idx) => idx !== orderIndex);
      let nextMain = mainOrder;
      if (next.length === 0) {
        nextMain = 0;
      } else if (orderIndex === mainOrder) {
        nextMain = 0;
      } else if (orderIndex < mainOrder) {
        nextMain = Math.max(0, mainOrder - 1);
      }
      setMainOrder(nextMain);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <label className="space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Файлы изображений
        </div>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-secondary-foreground hover:file:opacity-90"
        />
      </label>
      <p className="mt-1 text-xs text-muted-foreground">
        Можно выбрать несколько изображений. Перед сохранением можно удалить лишние и выбрать
        главное фото.
      </p>

      {/* Скрытые поля, которые подсказывают серверу какие файлы оставить и какой индекс главный */}
      {items.map((item, orderIndex) => (
        <input
          key={item.sourceIndex}
          type="hidden"
          name="imageKeep"
          value={item.sourceIndex}
        />
      ))}
      {items.length > 0 && (
        <input type="hidden" name="imageMainOrder" value={mainOrder} />
      )}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((item, orderIndex) => (
            <div
              key={item.sourceIndex}
              className="group overflow-hidden rounded-xl border border-border bg-card text-xs shadow-sm"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <img
                  src={item.url}
                  alt={item.file.name}
                  className="h-full w-full object-cover"
                />
                {orderIndex === mainOrder && (
                  <div className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                    Основное
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <div className="line-clamp-1 text-muted-foreground" title={item.file.name}>
                  {item.file.name}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleMakeMain(orderIndex)}
                    className="flex-1 rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium hover:bg-muted"
                  >
                    Сделать главным
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(orderIndex)}
                    className="rounded-lg bg-destructive px-2 py-1 text-[11px] font-medium text-destructive-foreground hover:bg-destructive/90"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

