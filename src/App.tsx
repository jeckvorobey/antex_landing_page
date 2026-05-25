import { FormEvent, useMemo, useState } from "react";

const maxLink = "https://max.ru/u/f9LHodD0cOJldnxoo8T-CJxSYCOJHc6iRrlAGZiUJLMLr0ZdJMj1yUfpBmg";
const telegramManagerLink = "https://t.me/m/ntagYZyVZjVl";
const telegramNewsLink = "https://t.me/+vN7FXrXBReszNDg1";
const telegramLeadBotLink = "https://t.me/posts_serg_bot";
const leadWebhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL;
const reviewsLink = "https://t.me/+Rw2BRymXRnk1ZGUy";
const instagramLink = "https://www.instagram.com/antex.change";
const vkLink = "https://vk.ru/antex.finance";
const threadsLink = "https://www.threads.com/@antex.change?igshid=NTc4MTIwNjQ2YQ==";
const logoUrl = `${import.meta.env.BASE_URL}logo.PNG`;

type ServiceIconName = "payments" | "local_taxi" | "credit_card" | "task_alt" | "home" | "attach_money";

type ServiceMarkerModel = { type: "text"; value: string } | { type: "icons"; value: ServiceIconName[] };

type Service = {
  marker: ServiceMarkerModel;
  title: string;
  mobileTitle?: string;
  text: string;
  mobileText?: string;
};

const services: Service[] = [
  {
    marker: { type: "text", value: "₽ ⇄ ₿" },
    title: "Обмен валют / криптовалют",
    text: "RUB / USDT → местная валюта. Помогаем подобрать понятный маршрут под страну и задачу.",
    mobileText: "RUB / USDT → местная валюта под вашу страну и город.",
  },
  {
    marker: { type: "icons", value: ["payments", "local_taxi"] },
    title: "Доставка наличных",
    text: "Передача наличных в городе вашего пребывания после согласования деталей с менеджером.",
    mobileText: "Согласуем детали и город вашего пребывания.",
  },
  {
    marker: { type: "icons", value: ["credit_card", "task_alt"] },
    title: "Бронирования и онлайн-оплаты",
    mobileTitle: "Бронирования и оплаты",
    text: "Помощь с отелями, авиабилетами, Booking, Agoda, Airbnb и оплатой онлайн-сервисов.",
    mobileText: "Отели, авиабилеты, Booking, Agoda, Airbnb и онлайн-сервисы.",
  },
  {
    marker: { type: "icons", value: ["home", "attach_money"] },
    title: "Аренда жилья",
    text: "Поддержка при аренде жилья для путешествий, зимовки или релокации.",
    mobileText: "Поддержка при аренде для поездки, зимовки или релокации.",
  },
];

const steps = [
  "Опишите страну, сумму, город и сроки",
  "Менеджер предложит маршрут решения",
  "Выберите Max, Telegram или заявку",
];

const faqs = [
  {
    question: "Нужно ли вносить предоплату?",
    answer: "Без предоплаты. Детали менеджер уточнит по вашей задаче.",
  },
  {
    question: "Какие страны доступны?",
    answer: "Таиланд, Вьетнам и Грузия",
  },
];

function LogoMark() {
  return (
    <div className="logo-mark">
      <div className="logo-mark__glow" aria-hidden="true" />
      <img className="logo-mark__image" src={logoUrl} alt="AntEx" />
    </div>
  );
}

function CtaLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex w-full flex-col gap-3 ${compact ? "sm:flex-row sm:justify-center" : "sm:flex-row"}`}>
      <a className="button-primary" href={maxLink} target="_blank" rel="noreferrer">
        Написать менеджеру в Max
      </a>
      <a className="button-secondary" href={telegramManagerLink} target="_blank" rel="noreferrer">
        Написать менеджеру в Telegram
      </a>
    </div>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24 lg:pt-16">
      <div className="hero-glow" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <LogoMark />
        <p className="mt-8 w-full max-w-[25rem] font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft sm:max-w-4xl sm:text-base">
          <span className="sm:hidden">ANTEX • TH • VN • GE</span>
          <span className="hidden sm:inline">AntEx • финансовый сервис для путешествий и релокации</span>
        </p>
        <h1 className="mt-7 w-full max-w-5xl font-heading text-[38px] font-bold leading-[1.04] text-main sm:text-6xl sm:leading-[1.03] lg:text-[76px]">
          <span className="sm:hidden">
            Бесплатно разберём
            <br />
            вашу задачу за
            <br />
            границей
          </span>
          <span className="hidden sm:inline">Бесплатно разберем вашу задачу по деньгам, поездке или релокации</span>
        </h1>
        <p className="mt-6 w-full max-w-[24rem] text-base leading-8 text-muted sm:max-w-3xl sm:text-xl">
          <span className="sm:hidden">
            Обмен RUB/USDT, наличные,
            <br />
            бронирования и аренда жилья в
            <br />
            Таиланде, Вьетнаме и Грузии - без
            <br />
            предоплаты.
          </span>
          <span className="hidden sm:inline">
            Обмен RUB/USDT на местную валюту, доставка наличных, бронирования и аренда жилья в Таиланде, Вьетнаме и
            Грузии - без предоплаты и лишней переписки.
          </span>
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          <TrustBadge>Более 3 лет работы</TrustBadge>
          <TrustBadge>Без предоплаты</TrustBadge>
        </div>

        <div className="mt-8 w-full max-w-2xl">
          <CtaLinks />
        </div>

        <p className="mt-7 rounded-full border border-gold/40 px-5 py-3 font-heading text-xl font-bold text-main sm:text-2xl">
          Таиланд • Вьетнам • Грузия
        </p>
      </div>
    </header>
  );
}

function TrustBadge({ children }: { children: string }) {
  return (
    <div className="trust-badge flex items-center justify-center gap-3 border border-gold/60 bg-[#091A17]/80 px-5 py-4 text-main shadow-panel">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-black text-[#071412]">✓</span>
      <span className="font-body text-base font-extrabold">{children}</span>
    </div>
  );
}

function SectionIntro({ title, text, mobileTitle, mobileText }: { title: string; text: string; mobileTitle?: string; mobileText?: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl text-center">
      <h2 className="font-heading text-3xl font-bold leading-tight text-main sm:text-5xl">
        <span className={mobileTitle ? "sm:hidden" : undefined}>{mobileTitle ?? title}</span>
        {mobileTitle && <span className="hidden sm:inline">{title}</span>}
      </h2>
      <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
        <span className={mobileText ? "sm:hidden" : undefined}>{mobileText ?? text}</span>
        {mobileText && <span className="hidden sm:inline">{text}</span>}
      </p>
    </div>
  );
}

function Services() {
  return (
    <section className="section-shell">
      <SectionIntro
        title="Что можно решить через AntEx"
        mobileTitle="Что решаем"
        text="Один вход - несколько финансовых и бытовых задач для поездки, переезда или жизни за границей."
        mobileText="Коротко опишите ситуацию - менеджер предложит понятный маршрут решения."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {services.map((service, index) => (
          <article className="reveal-card service-card" key={service.title} style={{ animationDelay: `${index * 90}ms` }}>
            <ServiceMarker marker={service.marker} />
            <h3 className="service-card-title">
              <span className={service.mobileTitle ? "sm:hidden" : undefined}>{service.mobileTitle ?? service.title}</span>
              {service.mobileTitle && <span className="hidden sm:inline">{service.title}</span>}
            </h3>
            <p className="service-card-text">
              <span className={service.mobileText ? "sm:hidden" : undefined}>{service.mobileText ?? service.text}</span>
              {service.mobileText && <span className="hidden sm:inline">{service.text}</span>}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceMarker({ marker }: { marker: ServiceMarkerModel }) {
  if (marker.type === "text") {
    return <div className="service-marker service-marker-text">{marker.value}</div>;
  }

  return (
    <div className="service-marker service-marker-icons" aria-hidden="true">
      {marker.value.map((icon) => (
        <ServiceIcon icon={icon} key={icon} />
      ))}
    </div>
  );
}

function ServiceIcon({ icon }: { icon: ServiceIconName }) {
  const commonProps = {
    className: "service-icon",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (icon === "payments") {
    return (
      <svg {...commonProps}>
        <rect x="7" y="13" width="34" height="23" rx="4" stroke="currentColor" strokeWidth="3" />
        <path d="M7 20h34" stroke="currentColor" strokeWidth="3" />
        <path d="M14 29h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "local_taxi") {
    return (
      <svg {...commonProps}>
        <path d="M14 22l4-9h12l4 9" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M11 22h26l4 7v8h-5l-2-4H14l-2 4H7v-8l4-7z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 13h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="29" r="2.5" fill="currentColor" />
        <circle cx="32" cy="29" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "credit_card") {
    return (
      <svg {...commonProps}>
        <rect x="6" y="13" width="36" height="25" rx="4" stroke="currentColor" strokeWidth="3" />
        <path d="M6 21h36" stroke="currentColor" strokeWidth="3" />
        <path d="M13 31h9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "task_alt") {
    return (
      <svg {...commonProps}>
        <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="3" />
        <path d="M16 24.5l5.2 5.2L33 17.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "home") {
    return (
      <svg {...commonProps}>
        <path d="M8 23L24 10l16 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 22v17h22V22" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 39V28h8v11" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M24 8v32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 16c-2.6-2.7-12.5-4.2-13.6 1.7-1.4 7.5 15.8 4.1 14.2 13-1.3 7.1-13.1 5.8-17.2 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Process() {
  return (
    <section className="section-shell bg-[#081815]/70">
      <SectionIntro
        title="Как проходит бесплатный разбор"
        text="Коротко опишите ситуацию - менеджер предложит понятный маршрут решения."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article className="step-card" key={step}>
            <p className="font-mono text-sm font-extrabold text-gold-bright">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-6 text-xl font-bold leading-snug text-main sm:text-2xl">{step}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function LeadForm() {
  const [messenger, setMessenger] = useState("Max");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("Обмен");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");

  const leadText = useMemo(() => {
    return [`Заявка с лендинга AntEx`, `Мессенджер для обратной связи: ${messenger}`, `Контакт: ${contact}`, `Тема: ${topic}`, `Сообщение: ${message}`]
      .filter(Boolean)
      .join("\n");
  }, [contact, message, messenger, topic]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    if (leadWebhookUrl) {
      try {
        const response = await fetch(leadWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messenger, contact, topic, message, source: "antex-landing" }),
        });

        if (!response.ok) {
          throw new Error(`Lead webhook failed with ${response.status}`);
        }

        setStatus("sent");
        setContact("");
        setMessage("");
        return;
      } catch {
        setStatus("error");
        return;
      }
    }

    await navigator.clipboard?.writeText(leadText).catch(() => undefined);
    setStatus("fallback");
    window.open(telegramLeadBotLink, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <h2 className="font-heading text-3xl font-bold leading-tight text-main sm:text-5xl">Оставьте заявку или напишите напрямую</h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            Форма нужна для тех, кто хочет заранее описать задачу. Для быстрых вопросов - кнопки Max и Telegram.
          </p>
          <div className="mt-8">
            <CtaLinks />
          </div>
        </div>

        <form className="form-card" onSubmit={submit}>
          <label>
            <span>Мессенджер для обратной связи</span>
            <MessengerSelect value={messenger} onChange={setMessenger} />
          </label>
          <label>
            <span>Контакт</span>
            <input
              required
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="@username или номер"
            />
          </label>
          <label>
            <span>Тема</span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Например: обмен, наличные, бронь или аренда"
            />
          </label>
          <label>
            <span>Сообщение</span>
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Коротко опишите страну, сумму, город и сроки"
              rows={5}
            />
          </label>
          <button className="button-primary" type="submit">
            {status === "sending" ? "Отправляем..." : "Отправить заявку"}
          </button>
          <p className="min-h-6 text-sm leading-6 text-muted" role="status" aria-live="polite">
            {status === "sent" && "Заявка отправлена. Менеджер свяжется с вами в выбранном мессенджере."}
            {status === "fallback" && "Открыли Telegram-бота. Текст заявки скопирован, отправьте его боту."}
            {status === "error" && "Не удалось отправить заявку. Напишите менеджеру в Max или Telegram."}
          </p>
        </form>
      </div>
    </section>
  );
}

function MessengerSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Max", "Telegram"];

  return (
    <div
      className="custom-select"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="custom-select-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{value}</span>
        <span className="custom-select-chevron" aria-hidden="true">⌄</span>
      </button>
      {isOpen && (
        <div className="custom-select-menu" role="listbox" aria-label="Мессенджер">
          {options.map((option) => (
            <button
              aria-selected={value === option}
              className="custom-select-option"
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FinalCta() {
  return (
    <section className="section-shell pb-16 lg:pb-24">
      <div className="rounded-[28px] border border-gold/40 bg-[#0A201C]/80 p-6 text-center shadow-panel sm:p-10 lg:p-14">
        <h2 className="font-heading text-3xl font-bold text-main sm:text-5xl">Начните с одного сообщения</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Max, Telegram или форма заявки - пользователь сам выбирает удобный способ связи.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <CtaLinks compact />
        </div>

        <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
          {faqs.map((faq) => (
            <article className="rounded-3xl border border-gold/30 bg-[#071412]/70 p-5" key={faq.question}>
              <h3 className="text-lg font-black text-main">{faq.question}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{faq.answer}</p>
            </article>
          ))}
        </div>

        <nav className="mt-9 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-bold text-gold-soft" aria-label="Социальные ссылки">
          <a href={reviewsLink} target="_blank" rel="noreferrer">Отзывы</a>
          <a href={telegramNewsLink} target="_blank" rel="noreferrer">Новости</a>
          <a href={instagramLink} target="_blank" rel="noreferrer">Instagram</a>
          <a href={vkLink} target="_blank" rel="noreferrer">VK</a>
          <a href={maxLink} target="_blank" rel="noreferrer">Max</a>
          <a href={threadsLink} target="_blank" rel="noreferrer">Threads</a>
        </nav>
      </div>
    </section>
  );
}

export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink font-body text-main">
      <Hero />
      <Services />
      <Process />
      <LeadForm />
      <FinalCta />
    </main>
  );
}
