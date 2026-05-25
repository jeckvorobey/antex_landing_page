/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--bg-ink)",
        panel: "var(--bg-panel)",
        card: "var(--bg-card)",
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        "gold-bright": "var(--gold-bright)",
        muted: "var(--text-muted)",
        main: "var(--text-main)",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Funnel Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        gold: "0 0 44px rgba(216, 168, 75, 0.2)",
        panel: "0 28px 80px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};
