// ─────────────────────────────────────────────────────────────
//  CodeBuild – editable site settings (no code knowledge needed)
//  Change values here; everything on the site picks them up.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "CodeBuild Academy",
  url: "https://codebuild.pk", // ← change to your real domain (used for SEO canonical + sitemap)
  whatsapp: "923284452954",    // digits only, with country code
  web3formsKey: "bee286f3-0072-4c0e-ba9b-bf28ff0728e7", // same key the old enroll form used
};

// Where students/customers send money. Empty rows are hidden automatically.
// ⚠ Replace the placeholder values below with your real account details.
export const PAYMENT_ACCOUNTS = [
  { method: "JazzCash",  title: "Shahida", number: "0323-4886113" },
  { method: "Easypaisa", title: "Shahida", number: "0323-4886113" },
  { method: "Bank Transfer", title: "Haroon latif", number: "00300 11085 4618", bank: "Meezan bank" },
];

// Course registration fee shown on the enrollment form (set null to hide)
export const REGISTRATION_FEE = null; // e.g. 2000

// Delivery estimate shown after an order is placed (working days)
export const DELIVERY = {
  digital: "Instantly after payment is verified (within 2–6 hours) – sent on WhatsApp & email",
  physicalDays: [3, 5],
  note: "Payment verification usually takes 2–6 hours (10am–10pm PKT).",
};

// Fallback demo video (the admin panel → Site Settings overrides this).
// `url` can be a YouTube link, a Facebook video link, or a direct .mp4 file. Leave null to show the WhatsApp invite.
export const DEMO_VIDEO = null; // e.g. { title: "Free demo: your first website", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", duration: "25 min", description: "..." }

// ─────────────────────────────────────────────────────────────
//  Current offer: 7-day AI for Kids (home page offer, demo class, sticky button, enroll page)
// ─────────────────────────────────────────────────────────────
export const KIDS_OFFER = {
  title: "AI for Kids – 7-Day Starter",
  price: 999,
  originalPrice: 4999,
  days: 7,
  ages: [6, 16],
  verifyHours: 12,
  refundAfterClasses: 2,
  // Free demo video: YouTube/Facebook link or direct .mp4. Leave null to show a "Book the demo on WhatsApp" card.
  demoVideo: null, // e.g. { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: "Watch the demo class" }
  modules: [
    { n: "01", title: "AI Bots Development", text: "Kids build their own chatbot, give it a personality and teach it to answer questions.", days: "Days 1–2" },
    { n: "02", title: "AI Storybooks", text: "Write and illustrate a full storybook with AI tools, then read it out to the family.", days: "Days 3–4" },
    { n: "03", title: "AI Video Development", text: "Turn a story into a short animated video with AI voices, scenes and music.", days: "Day 5" },
    { n: "04", title: "Prompt Engineering", text: "Learn how to ask AI the right way, so it gives better answers, ideas and pictures.", days: "Days 6–7" },
  ],
};