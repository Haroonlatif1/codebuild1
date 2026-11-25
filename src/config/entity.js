// Single source of truth for entity data used by JSON-LD, llms.txt and visible text.
// EDIT the values marked CONFIRM before going live.

// CONFIRM: your real production domain (no trailing slash). Also update public/llms.txt, robots.txt, sitemap.xml.
export const SITE_URL = "https://codebuildacademy.com";

// Bump this whenever you actually update the page content.
export const LAST_UPDATED = "2026-11-22";

export const ORG = {
  name: "CodeBuild Academy",
  legalName: "CodeBuild Academy",
  url: SITE_URL,
  logo: SITE_URL + "/ll.png",
  telephone: "+92 328 4452954",
  email: "contact@codebuildacademy.com",
  // CONFIRM: street/city exactly as on Google Business Profile
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  // Add every profile you really own: Google Maps, directories, etc.
  sameAs: [
    "https://www.facebook.com/profile.php?id=61563588339796",
    "https://www.linkedin.com/company/codebuild-academy",
    "https://www.youtube.com/@CodeBuildAcademy",
    "https://www.instagram.com/codebuild1",
  ],
};

// CONFIRM: real instructors only. Add { name, jobTitle, image, sameAs: [linkedin], knowsAbout: [] }.
// Muhammad Haroon is named by a student in a testimonial; confirm his title and add profile links.
export const INSTRUCTORS = [
  { name: "Muhammad Haroon", jobTitle: "Instructor", knowsAbout: ["Full Stack Web Development", "MERN Stack", "Artificial Intelligence", "Ai automations"], sameAs: [] },
];

// Real testimonials already shown on the site (src/components/Reviews.js). Remove any you can't verify.
export const REVIEWS = [
  {
    "text": "I recently complete my Mern Stack course from this platform and learn lots of topics so I highly recommend this course for anyone.",
    "name": "Asad amin (FSWD-Ai)"
  },
  {
    "text": "Really enjoying the AI Web Dev Full Stack. Mr Muhammad Haroon teaches in a way that makes everything easy to understand, even the tricky parts. The course is hands-on and definitely worth it.",
    "name": "Hassan tanveer (FSWD-Ai)"
  },
  {
    "text": "such a wonderful journey with code build academy. I learned a lot and  work on many real time projects that help me in gaining a job. highly recommend",
    "name": "Mania malik"
  },
  {
    "text": "Outstanding course and knowledgeable Mentor highly recommended",
    "name": "Furqan shiekh (FSWD-AI)"
  },
  {
    "text": "Honestly Codebuild academy is really a passionate and amazing institute. Instructors are knowledgeable and professional also they offer some amazing courses in which they cover topics in a excellant way . Their Basic to advance courses are from scratch thats why everyone can learn from it even if you a begineer or have a NON-IT background",
    "name": "Mansha (FSWD-AI)"
  },
  {
    "text": "I am currently learning the Full-Stack Developer course at CodeBuild Academy, and I could be happier with my experience! The course is well-structured, covering everything from frontend to backend development in a way that is easy to understand. The instructors are knowledgeable and supportive, always ready to help with any doubts. The hands-on projects and real-world applications make learning even more engaging. If you're looking for a great place to learn full-stack development, I highly recommend CodeBuild Academy!",
    "name": "Zohaib ahmad (FSWD-AI)"
  }
];