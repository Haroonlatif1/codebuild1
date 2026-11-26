import React from "react";
import { ORG, SITE_URL, INSTRUCTORS, REVIEWS, LAST_UPDATED } from "../../config/entity";

const CTX = "https://schema.org";
const ORG_ID = SITE_URL + "/#organization";
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const orgNode = () => ({
  "@type": "EducationalOrganization",
  "@id": ORG_ID,
  name: ORG.name,
  legalName: ORG.legalName,
  url: ORG.url,
  logo: ORG.logo,
  telephone: ORG.telephone,
  email: ORG.email,
  address: ORG.address,
  sameAs: ORG.sameAs,
  ...(INSTRUCTORS.length ? { employee: INSTRUCTORS.map((p) => ({ "@id": `${SITE_URL}/#person-${slug(p.name)}` })) } : {}),
});

export const personNodes = () =>
  INSTRUCTORS.map((p) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/#person-${slug(p.name)}`,
    name: p.name,
    jobTitle: p.jobTitle,
    worksFor: { "@id": ORG_ID },
    ...(p.image ? { image: p.image } : {}),
    ...(p.knowsAbout?.length ? { knowsAbout: p.knowsAbout } : {}),
    ...(p.sameAs?.length ? { sameAs: p.sameAs } : {}),
  }));

export const reviewNodes = () =>
  REVIEWS.map((r) => ({
    "@type": "Review",
    itemReviewed: { "@id": ORG_ID },
    author: { "@type": "Person", name: r.name.replace(/\s*\(.*?\)\s*/g, "").trim() },
    reviewBody: r.text,
  }));

export const courseNode = (c, price) => ({
  "@type": "Course",
  "@id": `${SITE_URL}/offeredcourses#${slug(c.name)}`,
  name: c.name,
  description: c.desc,
  url: `${SITE_URL}/offeredcourses`,
  provider: { "@id": ORG_ID },
  teaches: c.skills,
  inLanguage: "en",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: `P${c.duration}M`,
    instructor: INSTRUCTORS.map((p) => ({ "@id": `${SITE_URL}/#person-${slug(p.name)}` })),
  },
  ...(price
    ? { offers: { "@type": "Offer", category: "Paid", price: String(price.price), priceCurrency: "PKR", availability: "https://schema.org/InStock", url: `${SITE_URL}/offeredcourses` } }
    : {}),
});

export const homeGraph = () => ({ "@context": CTX, "@graph": [orgNode(), ...personNodes(), ...reviewNodes()] });

export const coursesGraph = (courses, priceOf, qa) => ({
  "@context": CTX,
  "@graph": [
    orgNode(),
    ...personNodes(),
    ...courses.map((c) => courseNode(c, priceOf(c.label))),
    {
      "@type": "FAQPage",
      mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
    },
  ],
});

export const fmtDate = (iso = LAST_UPDATED) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function LastUpdated({ date = LAST_UPDATED, className = "" }) {
  return (
    <p
      className={`lu ${className}`}
      style={{ margin: "14px 0 0", textAlign: "center", fontSize: 13, color: "#6b7280" }}
    >
      Last updated: <time dateTime={date}>{fmtDate(date)}</time>
    </p>
  );
}

const money = (n) => `PKR ${Number(n).toLocaleString("en-US")}`;
const months = (n) => `${n} ${n === 1 ? "month" : "months"}`;
const list = (a) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0] || "");

export function buildQa(courses, priceOf) {
  return courses.map((c) => {
    const p = priceOf(c.label);
    const fee = p
      ? `The ${c.name} course at ${ORG.name} costs ${money(p.price)}${p.original ? ` (regular fee ${money(p.original)}, ${p.off}% off)` : ""}. `
      : `The fee for the ${c.name} course at ${ORG.name} is shared on request via WhatsApp. `;
    const a = `${fee}It runs for ${months(c.duration)} as live online classes with a certificate on completion, so you can join from Lahore or anywhere in Pakistan. You will learn ${list(c.skills)} and finish with hands-on project work.`;
    return { q: `How much does the ${c.name} course cost in Lahore?`, a, course: c, price: p };
  });
}

const css = `
.qa{max-width:1100px;margin:56px auto 0;padding:0 16px}
.qa h2{font-size:clamp(1.4rem,3vw,2rem);margin:0 0 6px}
.qa-lead{color:#6b7280;margin:0 0 22px;max-width:70ch}
.qa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.qa-item{border:1px solid rgba(128,128,128,.25);border-radius:12px;padding:16px 18px}
.qa-item h3{font-size:1rem;margin:0 0 8px;line-height:1.35}
.qa-item p{margin:0 0 8px;line-height:1.55;font-size:.93rem}
.qa-facts{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.82rem;color:#6b7280;margin:0;padding:0;list-style:none}
.qa > .lu{margin:18px 0 0 !important}
`;

export function CourseAnswers({ qa }) {
  return (
    <section className="qa" aria-labelledby="qa-h">
      <style>{css}</style>
      <h2 id="qa-h">Course fees, duration and outcomes</h2>
      <p className="qa-lead">Straight answers to the questions students ask most. Fees are in Pakistani rupees and apply to live online classes.</p>
      <div className="qa-grid">
        {qa.map((x) => (
          <article className="qa-item" key={x.course.name}>
            <h3>{x.q}</h3>
            <p>{x.a}</p>
            <ul className="qa-facts">
              <li>Duration: {months(x.course.duration)}</li>
              {x.price && <li>Fee: {money(x.price.price)}</li>}
              <li>Certificate included</li>
            </ul>
          </article>
        ))}
      </div>
      <LastUpdated className="qa-lu" />
    </section>
  );
}