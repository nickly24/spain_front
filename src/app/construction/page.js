import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";
import { BeforeAfterGallery } from "../../components/BeforeAfterGallery";

export const metadata = {
  title: "Строительство и проекты",
};

export default function ConstructionPage() {
  const steps = [
    {
      n: "01",
      title: "Бриф и цели",
      text: "Уточняем задачу: что строим/обновляем, где, какие сроки и бюджет. Фиксируем требования к планировке и стилю.",
    },
    {
      n: "02",
      title: "Дизайн-проект",
      text: "Предлагаем подготовить дизайн-проект: планировки, визуализации, подбор материалов. Можем взять это на себя и согласовать с вами перед следующими этапами.",
    },
    {
      n: "03",
      title: "Концепция и смета",
      text: "Предлагаем варианты решений, предварительную смету и план этапов. Согласуем материалы и приоритеты.",
    },
    {
      n: "04",
      title: "Реализация и контроль",
      text: "Ведём работы по этапам, контролируем качество, держим коммуникацию. По запросу — фото/видео‑отчёты.",
    },
    {
      n: "05",
      title: "Сдача и рекомендации",
      text: "Финальная проверка, передача результата и рекомендации по эксплуатации/обслуживанию.",
    },
  ];

  const cases = [
    {
      title: "Квартира: косметическое обновление",
      beforeSrc: "/photos/image copy 4.png",
      afterSrc: "/photos/image copy 10.png",
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
      beforeSrc: "/photos/image copy 7.png",
      afterSrc: "/photos/image copy 11.png",
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
      beforeSrc: "/photos/image copy 8.png",
      afterSrc: "/photos/image copy 9.png",
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

  return (
    <div>
      <PageHero
        title="Строительство и проекты"
        subtitle="Проектирование, строительство, реконструкция и сопровождение. Аккуратный процесс, понятные этапы и результат, который приятно показывать."
        crumbs="Главная / Строительство и проекты"
        imageSrc="/photos/image copy 4.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          {/* How it works */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Процесс
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  Как мы ведём проекты
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Чёткие шаги, которые удобно показывать клиенту: от брифа до сдачи.
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-4">
              {/* Одна аккуратная линия на весь таймлайн */}
              <div className="pointer-events-none absolute left-5 top-6 bottom-6 w-px bg-slate-200" />

              {steps.map((s) => (
                <div key={s.n} className="relative pl-14">
                  <div className="absolute left-0 top-5 grid size-10 place-items-center rounded-2xl bg-[#ff6a3d] text-sm font-semibold text-white shadow-sm">
                    {s.n}
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">
                      {s.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">
                      {s.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BeforeAfterGallery cases={cases} />

          {/* Services */}
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Услуги
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  Что входит в сопровождение
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Набор блоков можно расширять/сужать под финальное ТЗ и макеты.
                </p>
              </div>
            </div>

            {/* Метки/чипы слева направо (как просил) */}
            <div className="mt-6 flex flex-wrap gap-2">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                  title={s.text}
                >
                  <span className="inline-block size-2 rounded-full bg-[#ff6a3d]" />
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <span className="hidden sm:inline text-slate-500">— {s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-[#ff6a3d] p-6 text-white shadow-sm">
            <div className="text-sm font-semibold">Нужен расчёт и консультация?</div>
            <p className="mt-2 text-sm leading-6 text-white/85">
              Напишите, что вы планируете построить или обновить — и мы предложим
              следующий шаг: оценка, этапы, сроки и ориентировочная стоимость.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <a
                href="tel:+34865450175"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/30"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +34 865 450 175
              </a>
              <a
                href="mailto:info@mggroup.es"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/30"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@mggroup.es
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

