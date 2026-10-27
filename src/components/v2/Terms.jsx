import React from "react";
import "./v2.css";
import { useSeo } from "./seo";
import { SITE } from "../../config/siteConfig";

const Terms = () => {
  useSeo({ title: "Terms, Refunds & Delivery", description: "Terms of use, refund policy and delivery information for CodeBuild Academy courses and store products.", path: "/terms" });
  const H = ({ children }) => <h2 style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: ".04em", margin: "34px 0 8px" }}>{children}</h2>;
  const P = ({ children }) => <p style={{ color: "var(--cb-mute)", fontSize: 17, lineHeight: 1.75, margin: "0 0 10px" }}>{children}</p>;
  return (
    <main className="v2 co"><div className="v2-wrap" style={{ maxWidth: 820 }}>
      <div className="v2-eyebrow">Legal</div>
      <h1 className="v2-h2">Terms, refunds &amp; delivery</h1>
      <p style={{ color: "var(--cb-dim)" }}>Last updated: October 2026</p>
      <H>Enrollment and payment</H>
      <P>Enrollment is confirmed once we verify the payment screenshot you upload. Payments are made by bank transfer, JazzCash or Easypaisa to the accounts shown on the enrollment and checkout pages. We never ask for card numbers or passwords.</P>
      <H>Refunds</H>
      <P>If you are not satisfied with a course, tell us within the first 7 days of your batch start date and we will refund the unused portion of the fee. Digital products (e-books, bundles) are non-refundable once delivered, unless the file is defective.</P>
      <H>Delivery</H>
      <P>Digital products are sent on WhatsApp and email within hours of payment verification. Physical items such as robotics kits are dispatched after verification and usually arrive in 3–5 working days, depending on your city. You will receive tracking details on WhatsApp.</P>
      <H>Acceptable use</H>
      <P>Course materials and recordings are for the enrolled student’s personal use and may not be resold or shared publicly.</P>
      <H>Contact</H>
      <P>Questions? WhatsApp us on +{SITE.whatsapp} or use the <a href="/contactus" style={{ color: "var(--cb-accent)" }}>contact page</a>. See also our <a href="/privacy-policy" style={{ color: "var(--cb-accent)" }}>privacy policy</a>.</P>
    </div></main>
  );
};
export default Terms;
