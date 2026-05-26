import { FormEvent, KeyboardEvent, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cardHover, fadeIn, fadeUp, staggerContainer, tapScale, viewportOnce } from "./motion";

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

type ServiceIconName = "credit_card" | "task_alt" | "home" | "attach_money";
type ServiceMarkerModel = { type: "text"; value: string } | { type: "icons"; value: ServiceIconName[] };
type LeadStatus = "idle" | "sending" | "sent" | "fallback" | "error";

type Service = {
  marker: ServiceMarkerModel;
  title: string;
  mobileTitle?: string;
  text: string;
  mobileText?: string;
  proof: string;
};

const services: Service[] = [
  {
    marker: { type: "text", value: "₽ → ฿" },
    title: "RUB → местная валюта",
    text: "Помогаем согласовать обмен рублей на местную валюту под страну, город, сумму и удобный способ получения.",
    mobileText: "Согласуем обмен рублей на местную валюту под страну, город и сумму.",
    proof: "Таиланд, Вьетнам, Грузия",
  },
  {
    marker: { type: "text", value: "USDT" },
    title: "USDT → наличные",
    text: "Подбираем понятный маршрут, если нужно получить наличные за границей после согласования условий с менеджером.",
    mobileText: "Маршрут для получения наличных за границей после согласования условий.",
    proof: "Порядок и сроки до сделки",
  },
  {
    marker: { type: "icons", value: ["credit_card", "task_alt"] },
    title: "Оплата бронирований",
    mobileTitle: "Оплата броней",
    text: "Помогаем разобраться с оплатой отелей, авиабилетов, Booking, Agoda, Airbnb и других сервисов для поездки.",
    mobileText: "Отели, авиабилеты, Booking, Agoda, Airbnb и сервисы для поездки.",
    proof: "Сначала уточнение сервиса",
  },
  {
    marker: { type: "icons", value: ["home", "attach_money"] },
    title: "Аренда и бытовые платежи",
    mobileTitle: "Аренда и платежи",
    text: "Поддержка с арендой жилья, депозитами и бытовыми платежами, когда нужен понятный порядок действий за границей.",
    mobileText: "Аренда, депозиты и бытовые платежи за границей.",
    proof: "Без предоплаты",
  },
];

const steps = [
  {
    title: "Оставьте заявку или напишите в Max/Telegram",
    text: "Коротко опишите страну, сумму, город и задачу. Можно сразу перейти в мессенджер.",
  },
  {
    title: "Менеджер уточнит страну, город, сумму и сроки",
    text: "На этом шаге согласуется маршрут, доступность направления и удобный формат получения.",
  },
  {
    title: "Согласуйте условия до сделки",
    text: "Вы принимаете решение только после понятного разбора курса, порядка и сроков.",
  },
];

const faqs = [
  {
    question: "Нужно ли вносить предоплату?",
    answer: "Нет. Сначала менеджер уточняет задачу, направление и условия, затем вы принимаете решение.",
  },
  {
    question: "Какие страны доступны?",
    answer: "Фокус AntEx - Таиланд, Вьетнам и Грузия. Доступность конкретного города и направления уточняется индивидуально.",
  },
  {
    question: "Можно ли решить задачу через Telegram?",
    answer: "Да. Можно написать менеджеру в Telegram или Max, а форму использовать, если удобнее заранее описать детали.",
  },
  {
    question: "С какими валютами вы помогаете?",
    answer: "Чаще всего обращаются с RUB и USDT. Итоговый маршрут зависит от страны, суммы и способа получения.",
  },
  {
    question: "Можно ли получить наличные?",
    answer: "Возможность, город, сумма и порядок передачи согласуются с менеджером до сделки.",
  },
  {
    question: "Помогаете ли с оплатой бронирований?",
    answer: "Да, можно обсудить отели, авиабилеты, Booking, Agoda, Airbnb и другие сервисы для поездки.",
  },
];

const problemCards = [
  {
    title: "Оплатить жилье или бронь сложнее",
    text: "Российская карта может не пройти, сервисы меняют правила, а хозяин или отель просит понятный способ оплаты.",
  },
  {
    title: "Наличные нужны в конкретном месте",
    text: "В поездке важны город, сумма, время и порядок получения, а не абстрактная возможность обмена.",
  },
  {
    title: "Курс и условия хочется знать заранее",
    text: "Перед сделкой нужно понимать маршрут, сроки, комиссию, формат связи и кто отвечает на вопросы.",
  },
];

const trustItems = [
  "Без предоплаты: сначала согласование условий",
  "Менеджер объясняет маршрут простым языком",
  "Фокус на Таиланде, Вьетнаме и Грузии",
  "Отзывы, новости и открытые каналы доступны до обращения",
];

const socialLinks = [
  { label: "Отзывы", href: reviewsLink },
  { label: "Новости", href: telegramNewsLink },
  { label: "Instagram", href: instagramLink },
  { label: "VK", href: vkLink },
  { label: "Max", href: maxLink },
  { label: "Threads", href: threadsLink },
];

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "logo-mark logo-mark--compact" : "logo-mark"}>
      <div className="logo-mark__glow" aria-hidden="true" />
      <img className="logo-mark__image" src={logoUrl} alt="AntEx" />
    </div>
  );
}

function StickyHeader() {
  return (
    <div className="sticky-header">
      <a className="sticky-header__brand" href="#top" aria-label="AntEx - к началу страницы">
        <LogoMark compact />
        <span>AntEx</span>
      </a>
      <nav className="sticky-header__nav" aria-label="Навигация по странице">
        <a href="#services">Услуги</a>
        <a href="#process">Как работаем</a>
        <a href="#lead">Заявка</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="sticky-header__cta sticky-header__cta--desktop" href={maxLink} target="_blank" rel="noreferrer">
        Max
      </a>
      <a className="sticky-header__cta sticky-header__cta--mobile" href="#lead">
        Связаться
      </a>
    </div>
  );
}

function CtaLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex w-full flex-col gap-3 ${compact ? "sm:flex-row sm:justify-center" : "sm:flex-row"}`}>
      <motion.a className="button-primary" href={maxLink} target="_blank" rel="noreferrer" whileTap={tapScale}>
        Написать в Max
      </motion.a>
      <motion.a className="button-secondary" href={telegramManagerLink} target="_blank" rel="noreferrer" whileTap={tapScale}>
        Написать в Telegram
      </motion.a>
    </div>
  );
}

function RouteCard() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.28], [0, -26]);

  return (
    <motion.aside className="route-card" style={{ y: reduceMotion ? 0 : y }} variants={fadeUp}>
      <div className="route-card__header">
        <span>Маршруты</span>
        <strong>RUB / USDT</strong>
      </div>
      <div className="route-card__flow" aria-label="RUB и USDT в THB, VND и GEL">
        <span>RUB</span>
        <span>USDT</span>
        <i aria-hidden="true">→</i>
        <span>THB</span>
        <span>VND</span>
        <span>GEL</span>
      </div>
      <div className="route-card__chips" aria-label="Страны">
        <span>Таиланд</span>
        <span>Вьетнам</span>
        <span>Грузия</span>
      </div>
      <div className="route-card__footer">
        <span>Без предоплаты</span>
        <span>Менеджер подберет маршрут</span>
      </div>
    </motion.aside>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const layerY = useTransform(scrollYProgress, [0, 0.24], [0, 42]);

  return (
    <header id="top" className="hero-shell">
      <motion.div className="hero-glow" style={{ y: reduceMotion ? 0 : layerY }} aria-hidden="true" />
      <div className="hero-grid">
        <motion.div className="hero-copy" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeIn}>
            <LogoMark />
          </motion.div>
          <motion.p className="hero-kicker" variants={fadeUp}>
            <span className="sm:hidden">ANTEX • TH • VN • GE</span>
            <span className="hidden sm:inline">AntEx • Таиланд, Вьетнам, Грузия</span>
          </motion.p>
          <motion.h1 className="hero-title" variants={fadeUp}>
            <span className="sm:hidden">
              RUB/USDT,
              <br />
              наличные и оплаты
              <br />
              за границей
            </span>
            <span className="hidden sm:inline">
              RUB/USDT, наличные и <span className="gold-gradient">оплаты за границей</span> через менеджера
            </span>
          </motion.h1>
          <motion.p className="hero-text" variants={fadeUp}>
            <span className="sm:hidden">
              Таиланд, Вьетнам, Грузия.
              <br />
              Обмен, наличные, брони и аренда -
              <br />
              без предоплаты, через менеджера.
            </span>
            <span className="hidden sm:inline">
              Обмен RUB/USDT на местную валюту, наличные, бронирования, аренда и бытовые платежи в Таиланде, Вьетнаме
              и Грузии. Без предоплаты. Через менеджера. В Max или Telegram.
            </span>
          </motion.p>
          <motion.p className="hero-proof" variants={fadeUp}>
            Сначала уточняем задачу, маршрут и условия. Вы соглашаетесь только после понятного разбора.
          </motion.p>
          <motion.div className="mt-8 w-full max-w-2xl" variants={fadeUp}>
            <CtaLinks />
          </motion.div>
          <motion.div className="hero-badges" variants={fadeUp}>
            <TrustBadge>Без предоплаты</TrustBadge>
            <TrustBadge>Через менеджера</TrustBadge>
            <TrustBadge>Max или Telegram</TrustBadge>
          </motion.div>
        </motion.div>
        <motion.div className="hero-route" variants={fadeUp} initial="hidden" animate="visible">
          <RouteCard />
        </motion.div>
      </div>
    </header>
  );
}

function ProblemSection() {
  return (
    <section className="section-shell pt-0">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <SectionIntro
          title="За границей финансовые задачи быстро становятся бытовыми"
          mobileTitle="За границей все сложнее"
          text="Когда нужно оплатить жилье, получить наличные или понять курс, важны не громкие обещания, а спокойное согласование маршрута до сделки."
          mobileText="Оплаты, наличные и курс лучше согласовать заранее, пока задача не стала срочной."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {problemCards.map((item) => (
            <motion.article className="info-card premium-card" key={item.title} variants={fadeUp} whileHover={cardHover}>
              <h3 className="text-xl font-bold leading-snug text-main">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted sm:text-base">{item.text}</p>
            </motion.article>
          ))}
        </div>
        <motion.p className="mx-auto mt-8 max-w-3xl text-center text-base font-bold leading-7 text-gold-soft sm:text-lg" variants={fadeUp}>
          AntEx помогает разложить задачу по шагам и согласовать условия до того, как вы принимаете решение.
        </motion.p>
      </motion.div>
    </section>
  );
}

function TrustBadge({ children }: { children: string }) {
  return (
    <div className="trust-badge">
      <span className="trust-badge__icon" aria-hidden="true">
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}

function SectionIntro({ title, text, mobileTitle, mobileText }: { title: string; text: string; mobileTitle?: string; mobileText?: string }) {
  return (
    <motion.div className="mx-auto w-full max-w-3xl text-center" variants={fadeUp}>
      <h2 className="font-heading text-3xl font-bold leading-tight text-main sm:text-5xl">
        <span className={mobileTitle ? "sm:hidden" : undefined}>{mobileTitle ?? title}</span>
        {mobileTitle && <span className="hidden sm:inline">{title}</span>}
      </h2>
      <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
        <span className={mobileText ? "sm:hidden" : undefined}>{mobileText ?? text}</span>
        {mobileText && <span className="hidden sm:inline">{text}</span>}
      </p>
    </motion.div>
  );
}

function Services() {
  return (
    <section className="section-shell" id="services">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <SectionIntro
          title="Что можно решить через AntEx"
          mobileTitle="Что решаем"
          text="Один вход - несколько финансовых и бытовых задач для поездки, переезда или жизни за границей."
          mobileText="Коротко опишите ситуацию - менеджер предложит понятный маршрут решения."
        />
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.article className="service-card premium-card" key={service.title} variants={fadeUp} whileHover={cardHover}>
              <ServiceMarker marker={service.marker} />
              <h3 className="service-card-title">
                <span className={service.mobileTitle ? "sm:hidden" : undefined}>{service.mobileTitle ?? service.title}</span>
                {service.mobileTitle && <span className="hidden sm:inline">{service.title}</span>}
              </h3>
              <p className="service-card-text">
                <span className={service.mobileText ? "sm:hidden" : undefined}>{service.mobileText ?? service.text}</span>
                {service.mobileText && <span className="hidden sm:inline">{service.text}</span>}
              </p>
              <p className="service-proof">{String(index + 1).padStart(2, "0")} • {service.proof}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
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
    <section className="section-shell process-section" id="process">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <SectionIntro
          title="Как проходит согласование"
          text="Три шага до понятных условий: сначала обращение, затем уточнение деталей, потом решение без давления и предоплаты."
        />
        <div className="process-timeline">
          {steps.map((step, index) => (
            <motion.article className="step-card premium-card" key={step.title} variants={fadeUp}>
              <p className="step-card__number">{String(index + 1).padStart(2, "0")}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function TrustSection() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0.3, 0.72], [22, -24]);

  return (
    <section className="section-shell trust-section">
      <motion.div className="trust-section__glow" style={{ y: reduceMotion ? 0 : glowY }} aria-hidden="true" />
      <motion.div className="trust-layout" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <motion.div variants={fadeUp}>
          <p className="section-eyebrow">Доверие до обращения</p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-main sm:text-5xl">Почему обращаются в AntEx</h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            Здесь не нужно угадывать маршрут самому. Менеджер уточняет вводные, объясняет порядок и согласует условия до
            сделки.
          </p>
          <a className="trust-section__reviews" href={reviewsLink} target="_blank" rel="noreferrer">
            Смотреть Telegram-отзывы
          </a>
        </motion.div>
        <div className="trust-points">
          {trustItems.map((item) => (
            <motion.div className="trust-point premium-card" key={item} variants={fadeUp}>
              <span className="trust-point__icon" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LeadForm() {
  const [messenger, setMessenger] = useState("Max");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("Обмен");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<LeadStatus>("idle");

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
    <section className="section-shell" id="lead">
      <motion.div className="lead-layout" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <motion.div variants={fadeUp}>
          <p className="section-eyebrow">Заявка</p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-main sm:text-5xl">Оставьте заявку или напишите напрямую</h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            Форма нужна для тех, кто хочет заранее описать задачу. Для быстрых вопросов - кнопки Max и Telegram.
          </p>
          <div className="mt-8">
            <CtaLinks />
          </div>
        </motion.div>

        <motion.form className="form-card premium-card" onSubmit={submit} variants={fadeUp}>
          <label>
            <span>Мессенджер для обратной связи</span>
            <MessengerSelect value={messenger} onChange={setMessenger} />
          </label>
          <label>
            <span>Контакт</span>
            <input required value={contact} onChange={(event) => setContact(event.target.value)} placeholder="@username или номер" />
          </label>
          <label>
            <span>Тема</span>
            <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Например: обмен, наличные, бронь или аренда" />
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
            <small>Чем конкретнее вводные, тем быстрее менеджер проверит доступный маршрут.</small>
          </label>
          <motion.button className="button-primary" type="submit" disabled={status === "sending"} whileTap={tapScale}>
            {status === "sending" ? (
              <span className="sending-label">
                Отправляем<span aria-hidden="true" />
              </span>
            ) : (
              "Отправить заявку"
            )}
          </motion.button>
          <AnimatedStatus status={status} />
        </motion.form>
      </motion.div>
    </section>
  );
}

function MessengerSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const options = ["Max", "Telegram"];

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className="custom-select"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="custom-select-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{value}</span>
        <span className="custom-select-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="custom-select-menu"
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            id={listId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            role="listbox"
            aria-label="Мессенджер"
            transition={{ duration: 0.18 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimatedStatus({ status }: { status: LeadStatus }) {
  if (status === "idle") {
    return <p className="status-block status-block--idle" aria-live="polite" />;
  }

  const copy: Record<Exclude<LeadStatus, "idle">, string> = {
    sending: "Отправляем заявку менеджеру.",
    sent: "Заявка отправлена. Менеджер свяжется с вами в выбранном мессенджере.",
    fallback: "Открыли Telegram-бота. Текст заявки скопирован, отправьте его боту.",
    error: "Не удалось отправить заявку. Напишите менеджеру в Max или Telegram.",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        aria-live="polite"
        className={`status-block status-block--${status}`}
        exit={{ opacity: 0, y: -6 }}
        initial={{ opacity: 0, y: 8 }}
        key={status}
        role="status"
      >
        {copy[status]}
      </motion.p>
    </AnimatePresence>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-accordion" id="faq">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;

        return (
          <div className="faq-item" key={faq.question}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="faq-trigger"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              type="button"
            >
              <span>{faq.question}</span>
              <span aria-hidden="true">+</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="faq-panel"
                  exit={{ height: 0, opacity: 0 }}
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function FinalCta() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const lightY = useTransform(scrollYProgress, [0.66, 1], [20, -34]);

  return (
    <section className="section-shell final-section pb-16 lg:pb-24">
      <motion.div className="final-panel" initial="hidden" whileInView="visible" variants={fadeUp} viewport={viewportOnce}>
        <motion.div className="final-panel__light" style={{ y: reduceMotion ? 0 : lightY }} aria-hidden="true" />
        <h2 className="font-heading text-3xl font-bold text-main sm:text-5xl">Нужно решить финансовый вопрос за границей?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Напишите в Max или Telegram. Без предоплаты. Сначала согласование условий.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <CtaLinks compact />
        </div>

        <h3 className="mt-12 font-heading text-2xl font-bold text-main sm:text-3xl">FAQ</h3>
        <FaqAccordion />

        <nav className="social-chips" aria-label="Социальные ссылки">
          {socialLinks.map((link) => (
            <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mx-auto mt-8 max-w-4xl border-t border-gold/20 pt-6 text-xs leading-6 text-muted sm:text-sm">
          Условия и доступность зависят от страны, города и суммы. Детали уточняет менеджер.
        </p>
      </motion.div>
    </section>
  );
}

export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink font-body text-main">
      <StickyHeader />
      <Hero />
      <ProblemSection />
      <Services />
      <Process />
      <TrustSection />
      <LeadForm />
      <FinalCta />
    </main>
  );
}
