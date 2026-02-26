/* eslint-disable no-console */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedProperties() {
  const properties = [
    {
      slug: "apartment-sea-view-torrevieja",
      listingType: "sale",
      title: "Апартаменты с видом на море",
      city: "Торревьеха",
      bedrooms: 2,
      areaM2: 68,
      priceEur: 165000,
      rentEurPerMonth: null,
      badges: ["у моря", "после ремонта"],
      images: [
        "/photos/image.png",
        "/photos/image copy.png",
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
      ],
      views: 1240,
      rating: 4.8,
      description:
        "Светлые апартаменты в шаговой доступности от пляжа. Удобная планировка, терраса, развитая инфраструктура района.",
    },
    {
      slug: "villa-marabella-private-pool",
      listingType: "sale",
      title: "Вилла с приватным бассейном",
      city: "Марбелья",
      bedrooms: 4,
      areaM2: 210,
      priceEur: 1250000,
      rentEurPerMonth: null,
      badges: ["бассейн", "терраса"],
      images: [
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos2/image.png",
      ],
      views: 892,
      rating: 5.0,
      description:
        "Современная вилла в тихом районе. Просторная гостиная, 4 спальни, зона отдыха на участке и парковка.",
    },
    {
      slug: "new-build-valencia-city",
      listingType: "sale",
      title: "Новостройка в городе",
      city: "Валенсия",
      bedrooms: 3,
      areaM2: 92,
      priceEur: 315000,
      rentEurPerMonth: null,
      badges: ["новостройка", "инфраструктура"],
      images: [
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
      ],
      views: 1560,
      rating: 4.5,
      description:
        "Квартира в новом доме рядом с транспортом и сервисами. Подходит для жизни и долгосрочной аренды.",
    },
    {
      slug: "bungalow-finestrat-terrace",
      listingType: "sale",
      title: "Бунгало с террасой",
      city: "Финестрат",
      bedrooms: 2,
      areaM2: 74,
      priceEur: 249900,
      rentEurPerMonth: null,
      badges: ["терраса", "комплекс"],
      images: [
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
      ],
      views: 734,
      rating: 4.2,
      description:
        "Бунгало в жилом комплексе с зоной отдыха. Хороший вариант для отдыха и инвестиций.",
    },
    {
      slug: "apartment-madrid-center",
      listingType: "sale",
      title: "Квартира в центре города",
      city: "Мадрид",
      bedrooms: 1,
      areaM2: 48,
      priceEur: 290000,
      rentEurPerMonth: null,
      badges: ["центр", "инвестиция"],
      images: [
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
      ],
      views: 2100,
      rating: 4.8,
      description:
        "Компактная квартира в центре. Удобно для проживания или сдачи в аренду.",
    },
    {
      slug: "townhouse-costa-blanca-family",
      listingType: "sale",
      title: "Таунхаус на Коста-Бланка",
      city: "Коста-Бланка",
      bedrooms: 3,
      areaM2: 112,
      priceEur: 329000,
      rentEurPerMonth: null,
      badges: ["для семьи", "закрытый комплекс"],
      images: [
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
        "/photos2/image copy 3.png",
        "/photos2/image copy 4.png",
      ],
      views: 1340,
      rating: 4.6,
      description:
        "Уютный таунхаус в семейном комплексе с бассейном и зелёными зонами. Удобный доступ к пляжу и инфраструктуре.",
    },
    {
      slug: "penthouse-barcelona-terrace",
      listingType: "sale",
      title: "Пентхаус с террасой в Барселоне",
      city: "Барселона",
      bedrooms: 2,
      areaM2: 96,
      priceEur: 690000,
      rentEurPerMonth: null,
      badges: ["терраса", "вид на город"],
      images: [
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
        "/photos2/image copy 3.png",
        "/photos2/image copy 4.png",
      ],
      views: 1780,
      rating: 4.9,
      description:
        "Стильный пентхаус с большой террасой и панорамными видами. Идеален для жизни в динамичном городе у моря.",
    },
    {
      slug: "villa-alicante-modern",
      listingType: "sale",
      title: "Современная вилла в Аликанте",
      city: "Аликанте",
      bedrooms: 4,
      areaM2: 185,
      priceEur: 890000,
      rentEurPerMonth: null,
      badges: ["бассейн", "современный дизайн"],
      images: [
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
      ],
      views: 980,
      rating: 4.7,
      description:
        "Современная вилла с панорамным остеклением, частным бассейном и зоной барбекю. Спокойный район недалеко от моря.",
    },
    {
      slug: "apartment-malaga-old-town",
      listingType: "sale",
      title: "Апартаменты в старом городе Малаги",
      city: "Малага",
      bedrooms: 2,
      areaM2: 74,
      priceEur: 245000,
      rentEurPerMonth: null,
      badges: ["исторический центр", "инвестиция"],
      images: [
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
      ],
      views: 1640,
      rating: 4.4,
      description:
        "Атмосферные апартаменты в историческом центре, рядом с кафе, магазинами и набережной. Хороший вариант под аренду.",
    },
    {
      slug: "loft-valencia-river-park",
      listingType: "sale",
      title: "Лофт рядом с парком реки Турия",
      city: "Валенсия",
      bedrooms: 1,
      areaM2: 56,
      priceEur: 215000,
      rentEurPerMonth: null,
      badges: ["лофт", "рядом с парком"],
      images: [
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
      ],
      views: 1210,
      rating: 4.3,
      description:
        "Светлый лофт с высоким потолком и большими окнами. В нескольких минутах от парка и центра города.",
    },
    {
      slug: "bungalow-benidorm-sea",
      listingType: "sale",
      title: "Бунгало недалеко от моря в Бенидорме",
      city: "Бенидорм",
      bedrooms: 2,
      areaM2: 82,
      priceEur: 275000,
      rentEurPerMonth: null,
      badges: ["у моря", "комплекс"],
      images: [
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
      ],
      views: 1375,
      rating: 4.5,
      description:
        "Бунгало в комплексе с несколькими бассейнами и общей зоной отдыха. Пешая доступность до пляжа.",
    },
    {
      slug: "house-seville-patio",
      listingType: "sale",
      title: "Дом с внутренним патио в Севилье",
      city: "Севилья",
      bedrooms: 3,
      areaM2: 132,
      priceEur: 355000,
      rentEurPerMonth: null,
      badges: ["патио", "исторический район"],
      images: [
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
      ],
      views: 910,
      rating: 4.6,
      description:
        "Традиционный андалусский дом с внутренним патио и несколькими террасами. Тихая улица, но рядом с центром.",
    },
    // Rent properties
    {
      slug: "rent-apartment-alicante-long-term",
      listingType: "rent",
      title: "Апартаменты для длительной аренды",
      city: "Аликанте",
      bedrooms: 2,
      areaM2: 65,
      priceEur: null,
      rentEurPerMonth: 950,
      badges: ["длительная аренда"],
      images: [
        "/photos/image copy.png",
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
      ],
      views: 680,
      rating: 4.5,
      description:
        "Уютные апартаменты рядом с транспортом и магазинами. Для долгосрочного проживания.",
    },
    {
      slug: "rent-torrevieja-1br-near-beach",
      listingType: "rent",
      title: "1 спальня у моря",
      city: "Торревьеха",
      bedrooms: 1,
      areaM2: 44,
      priceEur: null,
      rentEurPerMonth: 700,
      badges: ["у моря"],
      images: [
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
      ],
      views: 1120,
      rating: 5.0,
      description:
        "Небольшая квартира в пешей доступности от пляжа. Отлично подходит для спокойной жизни.",
    },
    {
      slug: "rent-benidorm-3br-family",
      listingType: "rent",
      title: "Семейные апартаменты",
      city: "Бенидорм",
      bedrooms: 3,
      areaM2: 88,
      priceEur: null,
      rentEurPerMonth: 1400,
      badges: ["для семьи", "инфраструктура"],
      images: [
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
      ],
      views: 945,
      rating: 4.2,
      description:
        "Просторная квартира с 3 спальнями. Рядом школы, парки и удобные транспортные развязки.",
    },
    {
      slug: "rent-estepona-2br-terrace",
      listingType: "rent",
      title: "2 спальни с террасой",
      city: "Эстепона",
      bedrooms: 2,
      areaM2: 76,
      priceEur: null,
      rentEurPerMonth: 1200,
      badges: ["терраса"],
      images: [
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
      ],
      views: 520,
      rating: 4.8,
      description:
        "Комфортные апартаменты с террасой. Хорошее естественное освещение, ухоженный комплекс.",
    },
    {
      slug: "rent-barcelona-studio",
      listingType: "rent",
      title: "Студия в Барселоне",
      city: "Барселона",
      bedrooms: 0,
      areaM2: 32,
      priceEur: null,
      rentEurPerMonth: 1100,
      badges: ["центр"],
      images: [
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
      ],
      views: 1890,
      rating: 4.5,
      description:
        "Студия в городской локации: удобно для работы и поездок. Метро и сервисы рядом.",
    },
    {
      slug: "rent-valencia-river-park-2br",
      listingType: "rent",
      title: "2 спальни у парка реки Турия",
      city: "Валенсия",
      bedrooms: 2,
      areaM2: 70,
      priceEur: null,
      rentEurPerMonth: 1150,
      badges: ["рядом с парком"],
      images: [
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
        "/photos2/image copy 3.png",
        "/photos2/image copy 4.png",
        "/photos2/image copy 5.png",
      ],
      views: 760,
      rating: 4.4,
      description:
        "Уютные апартаменты рядом с зелёной зоной парка. Удобно для прогулок, спорта и жизни в городе.",
    },
    {
      slug: "rent-malaga-old-town-1br",
      listingType: "rent",
      title: "1 спальня в старом городе Малаги",
      city: "Малага",
      bedrooms: 1,
      areaM2: 52,
      priceEur: null,
      rentEurPerMonth: 980,
      badges: ["исторический центр"],
      images: [
        "/photos/image.png",
        "/photos/image copy.png",
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
      ],
      views: 540,
      rating: 4.3,
      description:
        "Аккуратные апартаменты в пешей доступности от набережной и старого города. Рядом кафе и магазины.",
    },
    {
      slug: "rent-alicante-sea-view-3br",
      listingType: "rent",
      title: "3 спальни с видом на море в Аликанте",
      city: "Аликанте",
      bedrooms: 3,
      areaM2: 96,
      priceEur: null,
      rentEurPerMonth: 1650,
      badges: ["у моря", "для семьи"],
      images: [
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
      ],
      views: 1320,
      rating: 4.7,
      description:
        "Семейные апартаменты с видом на море и просторной гостиной. Рядом пляж и прогулочная набережная.",
    },
    {
      slug: "rent-benidorm-cozy-studio",
      listingType: "rent",
      title: "Уютная студия в Бенидорме",
      city: "Бенидорм",
      bedrooms: 0,
      areaM2: 30,
      priceEur: null,
      rentEurPerMonth: 750,
      badges: ["для отдыха"],
      images: [
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
      ],
      views: 680,
      rating: 4.2,
      description:
        "Компактная студия в пешей доступности от моря и развлечений. Хороший вариант для отдыха парой.",
    },
    {
      slug: "rent-estepona-garden-2br",
      listingType: "rent",
      title: "Апартаменты с садиком в Эстепоне",
      city: "Эстепона",
      bedrooms: 2,
      areaM2: 78,
      priceEur: null,
      rentEurPerMonth: 1300,
      badges: ["садик", "комплекс"],
      images: [
        "/photos/image copy 6.png",
        "/photos/image copy 7.png",
        "/photos/image copy 8.png",
        "/photos/image copy 9.png",
        "/photos/image copy 10.png",
        "/photos/image copy 11.png",
        "/photos2/image.png",
      ],
      views: 590,
      rating: 4.6,
      description:
        "Квартира на первом этаже с небольшим частным садом. Закрытый комплекс с бассейном.",
    },
    {
      slug: "rent-barcelona-2br-eixample",
      listingType: "rent",
      title: "2 спальни в районе Эшампле",
      city: "Барселона",
      bedrooms: 2,
      areaM2: 68,
      priceEur: null,
      rentEurPerMonth: 1500,
      badges: ["центр", "балкон"],
      images: [
        "/photos/image copy 11.png",
        "/photos2/image.png",
        "/photos2/image copy.png",
        "/photos2/image copy 2.png",
        "/photos2/image copy 3.png",
        "/photos2/image copy 4.png",
        "/photos2/image copy 5.png",
      ],
      views: 1490,
      rating: 4.5,
      description:
        "Квартира с балконом в престижном районе Эшампле. Удобно для жизни и работы в Барселоне.",
    },
    {
      slug: "rent-seville-patio-1br",
      listingType: "rent",
      title: "Апартаменты с патио в Севилье",
      city: "Севилья",
      bedrooms: 1,
      areaM2: 54,
      priceEur: null,
      rentEurPerMonth: 900,
      badges: ["патио", "атмосфера"],
      images: [
        "/photos/image copy.png",
        "/photos/image copy 2.png",
        "/photos/image copy 3.png",
        "/photos/image copy 4.png",
        "/photos/image copy 5.png",
        "/photos/image copy 6.png",
      ],
      views: 430,
      rating: 4.4,
      description:
        "Тёплые апартаменты с небольшим патио во внутреннем дворе. Тихий переулок, но рядом центр города.",
    },
  ];

  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  for (const prop of properties) {
    const created = await prisma.property.create({
      data: {
        slug: prop.slug,
        listingType: prop.listingType,
        title: prop.title,
        city: prop.city,
        bedrooms: prop.bedrooms,
        areaM2: prop.areaM2,
        priceEur: prop.priceEur,
        rentEurPerMonth: prop.rentEurPerMonth,
        description: prop.description,
        badges: prop.badges,
        status: "published",
        views: prop.views,
        rating: prop.rating,
      },
    });

    if (prop.images && prop.images.length > 0) {
      await prisma.propertyImage.createMany({
        data: prop.images.map((url, index) => ({
          propertyId: created.id,
          url,
          sortOrder: index,
          isMain: index === 0,
        })),
      });
    }
  }
}

async function seedNews() {
  const posts = [
    {
      slug: "kak-vybrat-nedvizhimost-u-morya",
      title: "Как выбрать недвижимость у моря: основные критерии",
      date: "2026-02-11",
      excerpt:
        "Покупка жилья на побережье — это не только красивые фото. Разбираем локацию, инфраструктуру и нюансы выбора.",
      content: [
        "Выбор недвижимости на побережье начинается с цели: для жизни, отдыха или инвестиций. От этого зависит район, тип объекта и допустимый бюджет.",
        "Важные параметры: транспорт, инфраструктура (магазины, медицина, школы), расстояние до моря, шумность района и перспективы ликвидности.",
        "Если вы сомневаетесь, напишите MG Group — предложим несколько вариантов и объясним, чем они отличаются.",
      ],
    },
    {
      slug: "arenda-na-dlitelny-srok",
      title: "Длительная аренда в Испании: что важно учесть",
      date: "2026-02-10",
      excerpt:
        "Сроки, депозит, документы и коммунальные платежи — короткий чек‑лист перед подписанием договора.",
      content: [
        "Перед подписанием договора уточните срок, условия продления, размер депозита и какие расходы включены в стоимость (коммунальные, интернет, обслуживание комплекса).",
        "Сфотографируйте состояние жилья при въезде и зафиксируйте список техники и мебели. Это экономит время при выезде.",
        "Мы помогаем подобрать варианты под ваши критерии и организовать просмотр.",
      ],
    },
    {
      slug: "novostroyki-i-vtorichka",
      title: "Новостройки и вторичный рынок: что выбрать",
      date: "2026-02-08",
      excerpt:
        "Сравниваем плюсы и минусы, сроки, риски и сценарии — для жизни и инвестиций.",
      content: [
        "Новостройки — это современная планировка и новое инженерное оснащение, но иногда нужно подождать сдачу.",
        "Вторичный рынок даёт возможность быстрее въехать и увидеть реальное окружение, но может потребоваться ремонт.",
        "Под ваш сценарий мы подскажем оптимальную стратегию и подберём объекты для сравнения.",
      ],
    },
  ];

  await prisma.newsPost.deleteMany();

  for (const post of posts) {
    await prisma.newsPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content.join("\n\n"),
        status: "published",
        publishedAt: new Date(post.date),
      },
    });
  }
}

async function seedConstruction() {
  const steps = [
    {
      order: 1,
      title: "Бриф и цели",
      text: "Уточняем задачу: что строим/обновляем, где, какие сроки и бюджет. Фиксируем требования к планировке и стилю.",
    },
    {
      order: 2,
      title: "Дизайн-проект",
      text: "Предлагаем подготовить дизайн-проект: планировки, визуализации, подбор материалов. Можем взять это на себя и согласовать с вами перед следующими этапами.",
    },
    {
      order: 3,
      title: "Концепция и смета",
      text: "Предлагаем варианты решений, предварительную смету и план этапов. Согласуем материалы и приоритеты.",
    },
    {
      order: 4,
      title: "Реализация и контроль",
      text: "Ведём работы по этапам, контролируем качество, держим коммуникацию. По запросу — фото/видео‑отчёты.",
    },
    {
      order: 5,
      title: "Сдача и рекомендации",
      text: "Финальная проверка, передача результата и рекомендации по эксплуатации/обслуживанию.",
    },
  ];

  const cases = [
    {
      title: "Квартира: косметическое обновление",
      beforeUrl: "/photos/image copy 4.png",
      afterUrl: "/photos/image copy 10.png",
      was: [
        "Устаревшая отделка и освещение",
        "Визуальный шум и разрозненные элементы",
      ],
      done: [
        "Обновили отделку и палитру материалов",
        "Пересобрали свет и расстановку под задачу",
      ],
    },
    {
      title: "Дом: реконструкция зоны кухни‑гостиной",
      beforeUrl: "/photos/image copy 7.png",
      afterUrl: "/photos/image copy 11.png",
      was: [
        "Неудобная планировка и мало хранения",
        "Недостаточно света в ключевых зонах",
      ],
      done: [
        "Оптимизировали планировку и места хранения",
        "Сделали сценарии освещения и акценты",
      ],
    },
    {
      title: "Объект под аренду: подготовка к сезону",
      beforeUrl: "/photos/image copy 8.png",
      afterUrl: "/photos/image copy 9.png",
      was: [
        "Слабая «продающая» картинка для объявлений",
        "Непрактичные решения для ежедневной эксплуатации",
      ],
      done: [
        "Усилили визуал и детали для фото/видео",
        "Подобрали износостойкие материалы и комплектацию",
      ],
    },
  ];

  const services = [
    {
      title: "Дизайн-проект",
      text: "Планировки, визуализации, подбор материалов и стиля. Согласуем с вами перед реализацией.",
    },
    {
      title: "Ремонт и отделка",
      text: "От косметики до капитального ремонта и комплектации «под ключ».",
    },
    {
      title: "Инженерные работы",
      text: "Электрика, сантехника, климат, освещение и смежные работы.",
    },
    {
      title: "Надзор и управление",
      text: "Контроль качества, график, коммуникация и прозрачный статус работ.",
    },
    {
      title: "Подбор материалов",
      text: "Комплектация, подбор решений под бюджет и задачу, согласование образцов.",
    },
    {
      title: "Проекты под инвестиции",
      text: "Сценарии, которые повышают ликвидность и привлекательность объекта для аренды.",
    },
  ];

  await prisma.constructionStep.deleteMany();
  await prisma.constructionCase.deleteMany();
  await prisma.constructionService.deleteMany();

  await prisma.constructionStep.createMany({ data: steps });

  for (const c of cases) {
    await prisma.constructionCase.create({
      data: {
        title: c.title,
        beforeUrl: c.beforeUrl,
        afterUrl: c.afterUrl,
        was: c.was,
        done: c.done,
      },
    });
  }

  await prisma.constructionService.createMany({ data: services });
}

async function seedContactsAndNavigation() {
  const phoneContacts = [
    {
      topic: "Продажа",
      name: "Менеджер по продаже",
      person: "Мария",
      phone: "+34 612 345 678",
      languages: "RU / EN",
    },
    {
      topic: "Аренда",
      name: "Менеджер по аренде",
      person: "Андрей",
      phone: "+34 633 987 210",
      languages: "RU / EN / ES",
    },
    {
      topic: "Строительство",
      name: "Менеджер по строительству",
      person: "Сергей",
      phone: "+34 644 112 233",
      languages: "RU / ES",
    },
  ];

  const navigationLinks = [
    { location: "header", href: "/sale", sortOrder: 1, labelRu: "Продажа", labelEn: "Sale", labelEs: "Venta" },
    { location: "header", href: "/rent", sortOrder: 2, labelRu: "Аренда", labelEn: "Rent", labelEs: "Alquiler" },
    { location: "header", href: "/construction", sortOrder: 3, labelRu: "Строительство", labelEn: "Construction", labelEs: "Construcción" },
    { location: "header", href: "/about", sortOrder: 4, labelRu: "О компании", labelEn: "About", labelEs: "Nosotros" },
    { location: "header", href: "/news", sortOrder: 5, labelRu: "Новости и статьи", labelEn: "News & Articles", labelEs: "Noticias" },
    { location: "header", href: "/contacts", sortOrder: 6, labelRu: "Контакты", labelEn: "Contacts", labelEs: "Contactos" },
    { location: "footer", href: "/", sortOrder: 1, labelRu: "Главная", labelEn: "Home", labelEs: "Inicio" },
    { location: "footer", href: "/sale", sortOrder: 2, labelRu: "Продажа недвижимости", labelEn: "Property for sale", labelEs: "Venta de inmuebles" },
    { location: "footer", href: "/rent", sortOrder: 3, labelRu: "Аренда недвижимости", labelEn: "Property for rent", labelEs: "Alquiler de inmuebles" },
    { location: "footer", href: "/construction", sortOrder: 4, labelRu: "Строительство и проекты", labelEn: "Construction & projects", labelEs: "Construcción y proyectos" },
    { location: "footer", href: "/about", sortOrder: 5, labelRu: "О компании", labelEn: "About", labelEs: "Nosotros" },
    { location: "footer", href: "/news", sortOrder: 6, labelRu: "Новости и статьи", labelEn: "News & Articles", labelEs: "Noticias" },
    { location: "footer", href: "/contacts", sortOrder: 7, labelRu: "Контакты", labelEn: "Contacts", labelEs: "Contactos" },
    { location: "topbar", href: "/partners", sortOrder: 1, labelRu: "Партнёрам", labelEn: "For partners", labelEs: "Para socios" },
    { location: "topbar", href: "/sale", sortOrder: 2, labelRu: "Продажа с MG Group", labelEn: "Sale with MG Group", labelEs: "Venta con MG Group" },
    { location: "topbar", href: "/news", sortOrder: 3, labelRu: "Новости", labelEn: "News", labelEs: "Noticias" },
    { location: "topbar", href: "/about", sortOrder: 4, labelRu: "О компании", labelEn: "About", labelEs: "Nosotros" },
  ];

  await prisma.contact.deleteMany();
  await prisma.navigationLinkTranslation.deleteMany();
  await prisma.navigationLink.deleteMany();

  await prisma.contact.createMany({
    data: phoneContacts.map((p) => ({
      topic: p.topic,
      name: p.name,
      person: p.person,
      phone: p.phone,
      languages: p.languages,
      type: "phone",
    })),
  });

  for (const l of navigationLinks) {
    const link = await prisma.navigationLink.create({
      data: {
        location: l.location,
        label: l.labelRu,
        href: l.href,
        sortOrder: l.sortOrder,
        visible: true,
      },
    });
    await prisma.navigationLinkTranslation.createMany({
      data: [
        { linkId: link.id, locale: "ru", label: l.labelRu },
        { linkId: link.id, locale: "en", label: l.labelEn },
        { linkId: link.id, locale: "es", label: l.labelEs },
      ],
    });
  }
}

async function seedPagesAndHeroes() {
  const pages = [
    {
      slug: "about",
      title: "О компании",
      content: null,
    },
    {
      slug: "partners",
      title: "Партнёрам",
      content: null,
    },
    {
      slug: "privacy",
      title: "Политика конфиденциальности",
      content: null,
    },
    {
      slug: "construction",
      title: "Строительство и проекты",
      content: null,
    },
    {
      slug: "contacts",
      title: "Контакты",
      content: null,
    },
    {
      slug: "news",
      title: "Новости и статьи",
      content: null,
    },
    {
      slug: "sale",
      title: "Продажа недвижимости",
      content: null,
    },
    {
      slug: "rent",
      title: "Аренда недвижимости",
      content: null,
    },
    {
      slug: "home",
      title: "Главная",
      content: null,
    },
  ];

  const heroes = [
    {
      pageSlug: "home",
      imageUrl: "/photos/poster.jpg",
      title: "MG Group — недвижимость в Испании",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "sale",
      imageUrl: "/photos/image.png",
      title: "Продажа недвижимости",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "rent",
      imageUrl: "/photos/image copy 2.png",
      title: "Аренда недвижимости",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "news",
      imageUrl: "/photos/image copy 5.png",
      title: "Новости и статьи",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "construction",
      imageUrl: "/photos/image copy 4.png",
      title: "Строительство и проекты",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "about",
      imageUrl: "/photos/image copy 3.png",
      title: "О компании",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "contacts",
      imageUrl: "/photos/image copy 7.png",
      title: "Контакты",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "partners",
      imageUrl: "/photos/image copy 9.png",
      title: "Партнёрам",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
    {
      pageSlug: "privacy",
      imageUrl: "/photos/image copy 8.png",
      title: "Политика конфиденциальности",
      subtitle: null,
      ctaText: null,
      ctaHref: null,
    },
  ];

  const pageContentTriples = [
    { pageSlug: "home", key: "home.hero.title.line1", ru: "Недвижимость в Испании", en: "Real Estate in Spain", es: "Inmuebles en España" },
    { pageSlug: "home", key: "home.hero.title.line2", ru: "с подбором под ваш запрос", en: "tailored to your needs", es: "adaptado a lo que buscas" },
    { pageSlug: "home", key: "home.hero.mainCta", ru: "Перейти в раздел", en: "Go to section", es: "Ir a la sección" },
    { pageSlug: "home", key: "home.hero.callCta", ru: "Позвонить", en: "Call", es: "Llamar" },
    { pageSlug: "home", key: "home.hero.sale.label", ru: "Продажа", en: "Sale", es: "Venta" },
    { pageSlug: "home", key: "home.hero.sale.subtitle", ru: "Подборка объектов для покупки. Используйте фильтры по городу, количеству спален и стоимости — чтобы быстрее найти подходящий вариант.", en: "Selection of properties for purchase. Use filters by city, bedrooms and price to find the right option faster.", es: "Selección de inmuebles en venta. Usa filtros por ciudad, habitaciones y precio para encontrar la opción ideal." },
    { pageSlug: "home", key: "home.hero.rent.label", ru: "Аренда", en: "Rent", es: "Alquiler" },
    { pageSlug: "home", key: "home.hero.rent.subtitle", ru: "Квартиры и дома в аренду. Удобно сравнивать по параметрам и быстро связаться с нами для просмотра.", en: "Apartments and houses for rent. Easy to compare and get in touch for a viewing.", es: "Pisos y casas en alquiler. Fácil comparar y contactar para una visita." },
    { pageSlug: "home", key: "home.hero.construction.label", ru: "Строительство", en: "Construction", es: "Construcción" },
    { pageSlug: "home", key: "home.hero.construction.subtitle", ru: "Проектирование, строительство и реконструкция. От идеи до результата — с понятными этапами и контролем качества.", en: "Design, construction and refurbishment. From idea to result with clear stages and quality control.", es: "Proyecto, construcción y reformas. De la idea al resultado con etapas claras y control de calidad." },
    { pageSlug: "home", key: "home.hot.badge", ru: "Подборка", en: "Selection", es: "Selección" },
    { pageSlug: "home", key: "home.hot.title", ru: "Актуальные объекты", en: "Featured properties", es: "Propiedades destacadas" },
    { pageSlug: "home", key: "home.hot.description", ru: "Несколько вариантов, с которых удобно начать. Полный список — в каталоге.", en: "A few options to get you started. Full list in the catalogue.", es: "Algunas opciones para empezar. Listado completo en el catálogo." },
    { pageSlug: "home", key: "home.hot.cta", ru: "В каталог →", en: "To catalogue →", es: "Al catálogo →" },
    { pageSlug: "home", key: "home.quick.sale.title", ru: "Продажа недвижимости", en: "Property for sale", es: "Venta de inmuebles" },
    { pageSlug: "home", key: "home.quick.sale.text", ru: "Подборка актуальных объектов с фильтрами по городу, спальням и цене.", en: "Selection of current listings with filters by city, bedrooms and price.", es: "Selección de ofertas con filtros por ciudad, habitaciones y precio." },
    { pageSlug: "home", key: "home.quick.sale.cta", ru: "Открыть каталог →", en: "Open catalogue →", es: "Abrir catálogo →" },
    { pageSlug: "home", key: "home.quick.rent.title", ru: "Аренда недвижимости", en: "Property for rent", es: "Alquiler de inmuebles" },
    { pageSlug: "home", key: "home.quick.rent.text", ru: "Квартиры и дома в аренду. Удобно сравнивать по параметрам и быстро связаться с нами.", en: "Apartments and houses for rent. Easy to compare and get in touch.", es: "Pisos y casas en alquiler. Fácil comparar y contactarnos." },
    { pageSlug: "home", key: "home.quick.rent.cta", ru: "Смотреть аренду →", en: "View rentals →", es: "Ver alquileres →" },
    { pageSlug: "home", key: "home.quick.construction.title", ru: "Строительство и проекты", en: "Construction & projects", es: "Construcción y proyectos" },
    { pageSlug: "home", key: "home.quick.construction.text", ru: "Услуги, реализованные и текущие проекты. От идеи до результата.", en: "Services, completed and ongoing projects. From idea to delivery.", es: "Servicios, proyectos realizados y en curso. De la idea al resultado." },
    { pageSlug: "home", key: "home.quick.construction.cta", ru: "Перейти в раздел →", en: "Go to section →", es: "Ir a la sección →" },
    { pageSlug: "about", key: "about.mainText", ru: "Помогаем подобрать объекты под ваш запрос (город, спальни, стоимость), а также подключаем проектное направление, когда требуется ремонт или решение «под ключ». Ниже — визуальные блоки «в цифрах» и история в формате, который удобно показывать клиенту.", en: "We help you find properties to match your criteria (city, bedrooms, budget) and provide project services when you need refurbishment or a turnkey solution. Below: key figures and company history in a clear format.", es: "Ayudamos a encontrar inmuebles según tu criterio (ciudad, habitaciones, presupuesto) y ofrecemos servicios de proyecto para reformas o llave en mano. Abajo: cifras y trayectoria en un formato claro." },
    { pageSlug: "news", key: "news.hero.subtitle", ru: "Публикуем новости компании и полезные материалы о недвижимости в Испании: выбор локации, покупка, аренда, проекты.", en: "Company news and useful content on property in Spain: location, purchase, rent, projects.", es: "Noticias de la empresa y contenidos útiles sobre inmuebles en España: ubicación, compra, alquiler, proyectos." },
    { pageSlug: "contacts", key: "contacts.hero.subtitle", ru: "Свяжитесь с MG Group по вопросам покупки, аренды и строительства недвижимости в Испании. Мы ответим и предложим варианты под ваш запрос.", en: "Contact MG Group about buying, renting or construction in Spain. We will reply and suggest options for you.", es: "Contacta con MG Group sobre compra, alquiler o construcción en España. Respondemos y proponemos opciones." },
    { pageSlug: "contacts", key: "contacts.header.label", ru: "MG Group (Marescol S.L)", en: "MG Group (Marescol S.L)", es: "MG Group (Marescol S.L)" },
    { pageSlug: "contacts", key: "contacts.header.title", ru: "КОНТАКТЫ", en: "CONTACTS", es: "CONTACTOS" },
    { pageSlug: "contacts", key: "contacts.header.text", ru: "По продаже, аренде и строительству — звоните или пишите.", en: "For sale, rent and construction — call or write.", es: "Para venta, alquiler y construcción — llama o escribe." },
    { pageSlug: "contacts", key: "contacts.phones.title", ru: "ТЕЛЕФОНЫ", en: "PHONES", es: "TELÉFONOS" },
    { pageSlug: "contacts", key: "contacts.email.label", ru: "Почта", en: "Email", es: "Correo" },
    { pageSlug: "contacts", key: "contacts.email.address", ru: "info@mggroup.es", en: "info@mggroup.es", es: "info@mggroup.es" },
    { pageSlug: "contacts", key: "contacts.address.label", ru: "Адрес", en: "Address", es: "Dirección" },
    { pageSlug: "contacts", key: "contacts.address.text", ru: "Испания, [уточним адрес офиса]", en: "Spain, [office address TBC]", es: "España, [dirección de oficina por confirmar]" },
    { pageSlug: "contacts", key: "contacts.hours.label", ru: "Время работы", en: "Opening hours", es: "Horario" },
    { pageSlug: "contacts", key: "contacts.hours.text", ru: "Пн–Пт 10:00–19:00", en: "Mon–Fri 10:00–19:00", es: "Lun–Vie 10:00–19:00" },
    { pageSlug: "construction", key: "construction.hero.subtitle", ru: "Проектирование, строительство, реконструкция и сопровождение. Аккуратный процесс, понятные этапы и результат, который приятно показывать.", en: "Design, construction, refurbishment and project management. Clear process, defined stages and a result you can be proud of.", es: "Proyecto, construcción, reformas y dirección de obra. Proceso claro, etapas definidas y un resultado que da gusto mostrar." },
    { pageSlug: "sale", key: "sale.hero.subtitle", ru: "Подборка объектов для покупки. Используйте фильтры по городу, количеству спален и стоимости, чтобы быстрее найти подходящий вариант.", en: "Selection of properties for purchase. Use filters by city, bedrooms and price to find the right option.", es: "Selección de inmuebles en venta. Usa filtros por ciudad, habitaciones y precio para encontrar la opción ideal." },
    { pageSlug: "rent", key: "rent.hero.subtitle", ru: "Квартиры и дома в аренду. Фильтры по городу, количеству спален и стоимости помогут подобрать вариант под ваш бюджет.", en: "Apartments and houses for rent. Filters by city, bedrooms and price to match your budget.", es: "Pisos y casas en alquiler. Filtros por ciudad, habitaciones y precio para ajustarse a tu presupuesto." },
  ];

  await prisma.heroBanner.deleteMany();
  await prisma.page.deleteMany();
  await prisma.pageContent.deleteMany();

  await prisma.page.createMany({ data: pages });
  await prisma.heroBanner.createMany({ data: heroes });

  const pageContentRu = pageContentTriples.map(({ pageSlug, key, ru }) => ({ pageSlug, key, value: ru, locale: "ru" }));
  const pageContentEn = pageContentTriples.map(({ pageSlug, key, en }) => ({ pageSlug, key, value: en, locale: "en" }));
  const pageContentEs = pageContentTriples.map(({ pageSlug, key, es }) => ({ pageSlug, key, value: es, locale: "es" }));
  await prisma.pageContent.createMany({ data: [...pageContentRu, ...pageContentEn, ...pageContentEs] });
}

async function seedTranslations() {
  await prisma.pageTranslation.deleteMany();
  await prisma.propertyTranslation.deleteMany();
  await prisma.newsPostTranslation.deleteMany();

  const pages = await prisma.page.findMany();
  const properties = await prisma.property.findMany({ orderBy: { id: "asc" } });
  const posts = await prisma.newsPost.findMany({ orderBy: { id: "asc" } });

  const pageBySlug = new Map(pages.map((p) => [p.slug, p]));
  const pageTranslations = [];

  function addPageTr(slug, ruTitle, enTitle, esTitle, enSeoTitle = null, esSeoTitle = null, enSeoDesc = null, esSeoDesc = null) {
    const page = pageBySlug.get(slug);
    if (!page) return;
    pageTranslations.push(
      {
        pageId: page.id,
        locale: "ru",
        title: ruTitle,
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null,
      },
      {
        pageId: page.id,
        locale: "en",
        title: enTitle,
        seoTitle: enSeoTitle,
        seoDescription: enSeoDesc,
      },
      {
        pageId: page.id,
        locale: "es",
        title: esTitle,
        seoTitle: esSeoTitle,
        seoDescription: esSeoDesc,
      }
    );
  }

  addPageTr("home", "Главная", "Home", "Inicio", "MG Group — Real Estate in Spain", "MG Group — Inmuebles en España", "Property for sale and rent in Spain. Selection by city, bedrooms and budget.", "Inmuebles en venta y alquiler en España. Selección por ciudad, habitaciones y presupuesto.");
  addPageTr("about", "О компании", "About the Company", "Sobre la empresa", "About MG Group — Real Estate Spain", "Sobre MG Group — Inmuebles España", "We help you find property and manage projects in Spain.", "Te ayudamos a encontrar inmuebles y gestionar proyectos en España.");
  addPageTr("construction", "Строительство и проекты", "Construction & Projects", "Construcción y proyectos", "Construction & Projects — MG Group Spain", "Construcción y proyectos — MG Group España", "Design, construction and refurbishment in Spain.", "Proyecto, construcción y reformas en España.");
  addPageTr("contacts", "Контакты", "Contacts", "Contactos", "Contact MG Group — Spain", "Contactar MG Group — España", "Contact us for sale, rent and construction.", "Contáctanos para venta, alquiler y construcción.");
  addPageTr("news", "Новости и статьи", "News & Articles", "Noticias y artículos", "News & Articles — MG Group", "Noticias y artículos — MG Group", "Company news and property guides.", "Noticias y guías sobre inmuebles.");
  addPageTr("sale", "Продажа недвижимости", "Property for Sale", "Venta de inmuebles", "Property for Sale Spain — MG Group", "Venta de inmuebles España — MG Group", "Apartments and houses for sale. Filters by city and price.", "Pisos y casas en venta. Filtros por ciudad y precio.");
  addPageTr("rent", "Аренда недвижимости", "Property for Rent", "Alquiler de inmuebles", "Property for Rent Spain — MG Group", "Alquiler de inmuebles España — MG Group", "Apartments and houses for rent.", "Pisos y casas en alquiler.");
  addPageTr("partners", "Партнёрам", "For Partners", "Para socios", "For Partners — MG Group", "Para socios — MG Group", "Partnership and cooperation.", "Colaboración y cooperación.");
  addPageTr("privacy", "Политика конфиденциальности", "Privacy Policy", "Política de privacidad", "Privacy Policy — MG Group", "Política de privacidad — MG Group", "Personal data and privacy.", "Datos personales y privacidad.");

  if (pageTranslations.length > 0) {
    await prisma.pageTranslation.createMany({ data: pageTranslations });
  }

  const propertyEnEs = [
    { titleEn: "Sea view apartment Torrevieja", titleEs: "Apartamento con vistas al mar Torrevieja", descEn: "Bright apartment steps from the beach. Good layout, terrace, local amenities.", descEs: "Apartamento luminoso a pasos de la playa. Buena distribución, terraza, servicios cercanos." },
    { titleEn: "Villa with private pool Marbella", titleEs: "Villa con piscina privada Marbella", descEn: "Modern villa in a quiet area. Spacious lounge, 4 bedrooms, outdoor area and parking.", descEs: "Villa moderna en zona tranquila. Salón amplio, 4 dormitorios, zona exterior y parking." },
    { titleEn: "New build Valencia city", titleEs: "Nueva construcción Valencia centro", descEn: "Apartment in a new building near transport and services. Suitable for living or long-term rent.", descEs: "Piso en edificio nuevo cerca de transporte y servicios. Ideal para vivir o alquilar." },
    { titleEn: "Bungalow with terrace Finestrat", titleEs: "Bungalow con terraza Finestrat", descEn: "Bungalow in a residential complex with pool. Good option for holidays or investment.", descEs: "Bungalow en complejo con piscina. Buena opción para vacaciones o inversión." },
    { titleEn: "City centre apartment Madrid", titleEs: "Piso centro Madrid", descEn: "Compact apartment in the centre. Convenient for living or renting out.", descEs: "Piso compacto en el centro. Cómodo para vivir o alquilar." },
    { titleEn: "Townhouse Costa Blanca family", titleEs: "Townhouse Costa Blanca familiar", descEn: "Cosy townhouse in a family complex with pool and greenery. Easy access to beach and amenities.", descEs: "Townhouse acogedor en complejo familiar con piscina y zonas verdes. Cerca de playa y servicios." },
    { titleEn: "Penthouse with terrace Barcelona", titleEs: "Ático con terraza Barcelona", descEn: "Stylish penthouse with large terrace and city views. Ideal for city life by the sea.", descEs: "Ático con gran terraza y vistas. Ideal para vivir en la ciudad junto al mar." },
    { titleEn: "Modern villa Alicante", titleEs: "Villa moderna Alicante", descEn: "Modern villa with panoramic glazing, private pool and barbecue area. Quiet area near the sea.", descEs: "Villa moderna con grandes ventanales, piscina privada y zona barbacoa. Zona tranquila cerca del mar." },
    { titleEn: "Old town apartment Málaga", titleEs: "Piso centro histórico Málaga", descEn: "Character apartment in the historic centre, near cafés, shops and promenade. Good for rental.", descEs: "Piso con carácter en el centro histórico, cerca de cafés, tiendas y paseo marítimo. Bueno para alquilar." },
    { titleEn: "Loft near Turia park Valencia", titleEs: "Loft junto al parque del Turia Valencia", descEn: "Bright loft with high ceilings and large windows. Minutes from the park and city centre.", descEs: "Loft luminoso con techos altos y grandes ventanales. A minutos del parque y del centro." },
    { titleEn: "Bungalow near sea Benidorm", titleEs: "Bungalow cerca del mar Benidorm", descEn: "Bungalow in a complex with pools and shared area. Walking distance to the beach.", descEs: "Bungalow en complejo con piscinas y zona común. A pie de playa." },
    { titleEn: "House with patio Seville", titleEs: "Casa con patio Sevilla", descEn: "Traditional Andalusian house with interior patio and terraces. Quiet street, close to centre.", descEs: "Casa andaluza con patio interior y terrazas. Calle tranquila, cerca del centro." },
    { titleEn: "Long-term rental apartment Alicante", titleEs: "Apartamento alquiler largo Alicante", descEn: "Cosy apartment near transport and shops. For long-term stay.", descEs: "Apartamento acogedor cerca de transporte y tiendas. Para estancia larga." },
    { titleEn: "1 bed near beach Torrevieja", titleEs: "1 dormitorio cerca playa Torrevieja", descEn: "Small flat within walking distance of the beach. Great for a quiet life.", descEs: "Piso pequeño a pie de playa. Ideal para una vida tranquila." },
    { titleEn: "Family apartment Benidorm", titleEs: "Apartamento familiar Benidorm", descEn: "Spacious 3-bed apartment. Near schools, parks and transport.", descEs: "Piso amplio de 3 dormitorios. Cerca de colegios, parques y transporte." },
    { titleEn: "2 beds with terrace Estepona", titleEs: "2 dormitorios con terraza Estepona", descEn: "Comfortable apartment with terrace. Good natural light, well-kept complex.", descEs: "Apartamento cómodo con terraza. Buena luz natural, complejo cuidado." },
    { titleEn: "Studio Barcelona", titleEs: "Estudio Barcelona", descEn: "Studio in a central location: convenient for work and travel. Metro and services nearby.", descEs: "Estudio en ubicación céntrica: cómodo para trabajar y moverte. Metro y servicios cerca." },
    { titleEn: "2 beds near Turia park Valencia", titleEs: "2 dormitorios parque Turia Valencia", descEn: "Cosy apartment near the park. Great for walks, sport and city life.", descEs: "Piso acogedor junto al parque. Ideal para pasear, deporte y vida en la ciudad." },
    { titleEn: "1 bed old town Málaga", titleEs: "1 dormitorio centro Málaga", descEn: "Neat apartment within walking distance of the promenade and old town. Cafés and shops nearby.", descEs: "Piso cuidado a pie de paseo marítimo y centro histórico. Cafés y tiendas cerca." },
    { titleEn: "3 beds sea view Alicante", titleEs: "3 dormitorios vistas mar Alicante", descEn: "Family apartment with sea views and spacious lounge. Beach and promenade nearby.", descEs: "Apartamento familiar con vistas al mar y salón amplio. Playa y paseo cerca." },
    { titleEn: "Cosy studio Benidorm", titleEs: "Estudio acogedor Benidorm", descEn: "Compact studio within walking distance of the sea and entertainment. Good for a couple.", descEs: "Estudio compacto a pie de mar y ocio. Bueno para pareja." },
    { titleEn: "2 beds with garden Estepona", titleEs: "2 dormitorios con jardín Estepona", descEn: "Ground-floor flat with small private garden. Gated complex with pool.", descEs: "Piso bajo con pequeño jardín privado. Complejo cerrado con piscina." },
    { titleEn: "2 beds Eixample Barcelona", titleEs: "2 dormitorios Eixample Barcelona", descEn: "Apartment with balcony in the Eixample district. Convenient for living and working in Barcelona.", descEs: "Piso con balcón en el Eixample. Cómodo para vivir y trabajar en Barcelona." },
    { titleEn: "1 bed with patio Seville", titleEs: "1 dormitorio con patio Sevilla", descEn: "Warm apartment with small patio in an inner courtyard. Quiet alley, close to centre.", descEs: "Piso acogedor con pequeño patio interior. Callejón tranquilo, cerca del centro." },
  ];

  const propertyTranslations = [];
  properties.forEach((prop, i) => {
    const t = propertyEnEs[i];
    if (!t) return;
    propertyTranslations.push(
      { propertyId: prop.id, locale: "ru", title: prop.title, description: prop.description, seoTitle: prop.seoTitle || null, seoDescription: prop.seoDescription || null },
      { propertyId: prop.id, locale: "en", title: t.titleEn, description: t.descEn, seoTitle: null, seoDescription: null },
      { propertyId: prop.id, locale: "es", title: t.titleEs, description: t.descEs, seoTitle: null, seoDescription: null }
    );
  });
  if (propertyTranslations.length > 0) {
    await prisma.propertyTranslation.createMany({ data: propertyTranslations });
  }

  const newsEnEs = [
    {
      titleEn: "How to choose property by the sea: key criteria",
      titleEs: "Cómo elegir inmueble junto al mar: criterios clave",
      excerptEn: "Buying on the coast is not just about nice photos. We look at location, infrastructure and what to consider.",
      excerptEs: "Comprar en la costa no es solo fotos bonitas. Repasamos ubicación, infraestructura y qué tener en cuenta.",
      contentEn: "Choosing property on the coast starts with your goal: to live, holiday or invest. That drives area, type and budget.\n\nKey factors: transport, infrastructure (shops, healthcare, schools), distance to the sea, noise and liquidity.\n\nIf you are unsure, contact MG Group — we can suggest options and explain the differences.",
      contentEs: "Elegir inmueble en la costa empieza por tu objetivo: vivir, vacaciones o invertir. De ahí salen zona, tipo y presupuesto.\n\nFactores clave: transporte, infraestructura (tiendas, salud, colegios), distancia al mar, ruido y liquidez.\n\nSi tienes dudas, contacta con MG Group — proponemos opciones y te explicamos las diferencias.",
    },
    {
      titleEn: "Long-term rent in Spain: what to consider",
      titleEs: "Alquiler largo en España: qué tener en cuenta",
      excerptEn: "Term, deposit, paperwork and utilities — a short checklist before signing the contract.",
      excerptEs: "Plazo, fianza, papeles y suministros — un breve checklist antes de firmar.",
      contentEn: "Before signing, clarify the term, renewal conditions, deposit amount and what is included (utilities, internet, community fees).\n\nTake photos of the condition when moving in and list fixtures and furniture. It saves time when leaving.\n\nWe help find options to match your criteria and arrange viewings.",
      contentEs: "Antes de firmar, aclara plazo, condiciones de prórroga, importe de la fianza y qué incluye (suministros, internet, comunidad).\n\nHaz fotos del estado al entrar y lista el mobiliario. Ahorra tiempo al salir.\n\nAyudamos a encontrar opciones según tus criterios y a organizar visitas.",
    },
    {
      titleEn: "New build vs resale: what to choose",
      titleEs: "Nueva construcción vs segunda mano: qué elegir",
      excerptEn: "We compare pros and cons, timing, risks and scenarios — for living and investing.",
      excerptEs: "Comparamos ventajas e inconvenientes, plazos, riesgos y escenarios — para vivir e invertir.",
      contentEn: "New builds offer modern layout and new fittings, but you may wait for completion.\n\nResale lets you move in sooner and see the real area, but may need refurbishment.\n\nWe can suggest the best strategy for your case and find properties to compare.",
      contentEs: "La obra nueva ofrece distribución moderna y instalaciones nuevas, pero a veces hay que esperar a la entrega.\n\nLa segunda mano permite entrar antes y ver el entorno real, pero puede requerir reforma.\n\nTe orientamos sobre la mejor estrategia y buscamos inmuebles para comparar.",
    },
  ];

  const newsTranslations = [];
  posts.forEach((post, i) => {
    const t = newsEnEs[i];
    if (!t) return;
    newsTranslations.push(
      { postId: post.id, locale: "ru", title: post.title, excerpt: post.excerpt || null, content: post.content, seoTitle: post.seoTitle || null, seoDescription: post.seoDescription || null },
      { postId: post.id, locale: "en", title: t.titleEn, excerpt: t.excerptEn, content: t.contentEn, seoTitle: null, seoDescription: null },
      { postId: post.id, locale: "es", title: t.titleEs, excerpt: t.excerptEs, content: t.contentEs, seoTitle: null, seoDescription: null }
    );
  });
  if (newsTranslations.length > 0) {
    await prisma.newsPostTranslation.createMany({ data: newsTranslations });
  }
}

async function main() {
  console.log("Seeding database...");
  await seedProperties();
  await seedNews();
  await seedConstruction();
  await seedContactsAndNavigation();
  await seedPagesAndHeroes();
  await seedTranslations();
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

