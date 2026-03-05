"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatePropertyImagePicker } from "./CreatePropertyImagePicker";

export function CreatePropertyForm({ createProperty, cities = [] }) {
  const [files, setFiles] = useState([]);
  const [isPending, setIsPending] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Удаляем стандартные images — добавим наши в нужном порядке
    formData.delete("images");
    files.forEach((file) => formData.append("images", file));

    // Главное фото — первое в списке
    formData.set("mainImageIndex", "0");

    setIsPending(() => {
      createProperty(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Базовые данные</CardTitle>
          <CardDescription>
            Можно заполнить минимально, остальное — после создания.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input name="title" />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input name="slug" />
              </div>
              <div className="space-y-2">
                <Label>Город</Label>
                <select
                  name="cityId"
                  defaultValue=""
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Не выбрано</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Формат</Label>
                  <select
                    name="listingType"
                    defaultValue="sale"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="sale">Продажа</option>
                    <option value="rent">Аренда</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Спальни</Label>
                  <Input name="bedrooms" type="number" defaultValue={0} />
                </div>
                <div className="space-y-2">
                  <Label>Площадь, м²</Label>
                  <Input name="areaM2" type="number" defaultValue={0} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Цена, €</Label>
                  <Input name="priceEur" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Аренда, €/мес</Label>
                  <Input name="rentEurPerMonth" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea name="description" rows={6} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Статус и метрики</CardTitle>
            <CardDescription>
              Можно сразу задать статус и базовые показатели.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Статус</Label>
              <select
                name="status"
                defaultValue="draft"
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="archived">Архив</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Просмотры</Label>
                <Input name="views" type="number" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label>Рейтинг (0-5)</Label>
                <Input name="rating" type="number" step="0.1" min={0} max={5} defaultValue={0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Фотографии</CardTitle>
            <CardDescription>
              Загрузите фото с превью. Первое в списке — главное. Можно выбрать другую главную или
              удалить до сохранения.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePropertyImagePicker files={files} setFiles={setFiles} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Создание…" : "Создать объект"}
        </Button>
      </div>
    </form>
  );
}
