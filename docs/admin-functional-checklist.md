# Чек‑лист функционала админки (CMS)

Цель: **пересобрать UX/дизайн, не потеряв ни одной функции**. Этот файл — источник правды для регрессионной проверки после редизайна.

## 0) Доступ и защита
- **Маршруты**: всё под `/admin/*` должно требовать авторизацию, кроме `/admin/login`.
- **Механика**: пароль `ADMIN_PASSWORD` → cookie `mg_admin_auth=1`.
- **Редиректы**:
  - неавторизован → на `/admin/login?next=/admin/...`
  - авторизован и идёт на `/admin/login` → на `/admin`

## 1) Дашборд (`/admin`)
- **Показывает**:
  - общее количество объектов
  - количество объектов по sale / rent
  - количество новостей/статей

## 2) Объекты

### 2.1 Список (`/admin/properties`)
- **Два списка**: продажа (sale) и аренда (rent).
- **Колонки**: ID, Заголовок+slug, город, площадь+спальни, цена/аренда, просмотры, рейтинг, статус.
- **Действия**:
  - «Создать объект» → `/admin/properties/new`
  - «Редактировать» → `/admin/properties/[id]`

### 2.2 Создание (`/admin/properties/new`)
- **Поля**: title, slug, city, listingType, bedrooms, areaM2, priceEur, rentEurPerMonth, description.
- **После сохранения**: redirect на `/admin/properties/[id]`.

### 2.3 Редактирование (`/admin/properties/[id]`)
- **Базовые поля**: title, slug, city, listingType, bedrooms, areaM2, priceEur, rentEurPerMonth, views, rating, status, description.
- **Переводы**: EN/ES (title, description, seoTitle, seoDescription)
  - пусто → fallback на RU (как сейчас).
- **Теги**:
  - выбираются чекбоксами
  - фильтруются по `section` = sale|rent в зависимости от `listingType`
  - сохранение заменяет набор связей целиком
- **Фотографии**:
  - загрузка файла (multipart) → сохранение в `public/uploads`
  - создание `PropertyImage` с `sortOrder`
  - если нет `isMain`, первая загруженная становится `isMain`
  - «Сделать главным» (сброс всех `isMain` → true для одной)
  - «Удалить фото»:
    - удалить файл с диска (если есть)
    - удалить запись из БД
- **Удаление объекта**:
  - удалить `PropertyImage` + сам `Property`
- **Ссылки**:
  - «Открыть объект на сайте» ведёт на публичный URL объекта

## 3) Новости и статьи

### 3.1 Список (`/admin/news`)
- **Показывает**: title, slug, publishedAt, status.
- **Действия**:
  - «Добавить публикацию» → `/admin/news/new`
  - переход по заголовку → `/admin/news/[id]`

### 3.2 Создание (`/admin/news/new`)
- **Поля**: title, slug, excerpt, content, status, publishedAt.
- **После создания**: redirect на `/admin/news/[id]`.

### 3.3 Редактирование (`/admin/news/[id]`)
- **Поля**: title, slug, excerpt, content, status, publishedAt.
- **Ссылка**: «Открыть статью на сайте».

## 4) Строительство (`/admin/construction`)
- **Разделы**:
  - Этапы: order, переводы RU/EN/ES (title, text)
  - Услуги: sortOrder, iconUrl, переводы RU/EN/ES (title, text)
  - Кейсы: beforeUrl/afterUrl (или загрузка файлов), переводы RU/EN/ES (title?, was[], done[])
- **Операции**:
  - создать кейс
  - удалить кейс
  - обновить кейс (в т.ч. загрузкой изображений)

## 5) Контакты (`/admin/contacts`)
- **Сущности**: `Contact` с `type="phone"`.
- **Обязательно**:
  - phone обязателен
  - переводы RU/EN/ES для topic/name/person/languages
  - RU используется как fallback в базовых полях

## 6) Теги (`/admin/tags`)
- **CRUD**:
  - create: section, key, sortOrder, visible, label_ru/en/es
  - update: то же + upsert переводов
  - delete: удаление `Tag`
- **Импорт**:
  - «Импортировать из старых badges» переносит значения `Property.badges` в `Tag` + `PropertyTag`
- **Отображение**:
  - группировка по section (sale/rent/construction)
  - счётчик привязок к объектам

## 7) Города (`/admin/cities`)
- **CRUD**:
  - create/update/delete: key, sortOrder, visible, label_ru/en/es
  - счётчик объектов
- **Импорт**:
  - «Импортировать из объектов»:
    - создаёт города по уникальным `Property.city`
    - ставит `cityId` объектам, где он `null`

## 8) Соцсети (`/admin/social`)
- **Платформы**: facebook/instagram/youtube.
- **Операции**:
  - upsert (url, sortOrder, visible)
  - delete (если записи нет — не падать)

## 9) Навигация (`/admin/navigation`)
- **Показывает**: header/topbar/footer группы, label+href.
- **Важно**: сейчас это read-only; редизайн не должен «потерять» просмотр.

## 10) Страницы и баннеры

### 10.1 Список (`/admin/pages`)
- **Показывает**: slug, title, hero image (если есть), действие «Редактировать текст».

### 10.2 Редактор страницы (`/admin/pages/[slug]`)
- **Локали**: RU/EN/ES переключение (в URL query `?lang=`).
- **Превью**: iframe публичной страницы.
- **Сохранение**:
  - общий блок: `__page_content__` (в `PageContent` по locale)
  - поля: `field__*` (в `PageContent` по locale)
  - RU дополнительно пишет fallback в `Page.content`

## 11) Медиа / загрузка
- **`/admin/media`**:
  - редактирование `HeroBanner.imageUrl` для `pageSlug` (upsert)
- **API `POST /api/upload`**:
  - принимает multipart `file`, опционально `kind=hero` + `pageSlug`
  - сохраняет файл в `public/uploads`
  - возвращает `{ url }`
  - если `kind=hero` и есть `pageSlug`: upsert `HeroBanner.imageUrl`

