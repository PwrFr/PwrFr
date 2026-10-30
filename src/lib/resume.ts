export const profile = {
  name: ["Pawaris", "Wongsaied"],
  role: "Frontend Developer",
  tagline:
    "I build the frontends businesses run on: calls, CRM, commerce, training and the tools around them.",
  summary:
    "Frontend developer with range: real-time communication (WebRTC/SIP), CRM, POS, e-learning and data-driven internal tools. I have built telephony and PBX-integrated features, configurable UI systems and scalable component architectures with Vue and React, and introduced tools and standards such as shadcn/ui and TanStack that made teams more consistent and faster.",
  email: "pwrfrii@gmail.com",
  phone: "0886199959",
  github: "https://github.com/PwrFr",
};

export type Role = {
  company: string;
  place: string;
  title: string;
  from: string;
  to: string;
  ghost: string;
  points: string[];
};

export const roles: Role[] = [
  {
    company: "CANS Communication Co., Ltd.",
    place: "Mint Tower",
    title: "Frontend Developer",
    from: "Jul 2025",
    to: "Present",
    ghost: "Present",
    points: [
      "Built and maintained a WebRTC/SIP softphone (sip.js) integrated with a FreeSWITCH PBX, handling call signaling, ICE/STUN/TURN negotiation and multi-device audio routing.",
      "Implemented real-time noise cancellation (RNNoise) through a custom SDP handler layer, with dynamic mic and speaker switching during active calls.",
      "Proposed and introduced shadcn/ui as the component library for the team's design system. UI/UX adopted it to keep components consistent and reusable across projects.",
      "Wrote unit tests with Vitest and end-to-end tests with Playwright to validate data handling and UI behavior, catching regressions before release and reducing reliance on manual QA.",
      "Integrated Meta APIs for omnichannel communication and built the frontend for real-time conversation handling inside the platform.",
    ],
  },
  {
    company: "Cloudsoft Co., Ltd.",
    place: "Flourish Building",
    title: "Frontend Developer",
    from: "Jun 2022",
    to: "Jul 2025",
    ghost: "2022",
    points: [
      "Built a drag-and-drop form builder in Vue so each business domain can configure its own forms (input, dropdown, multi-select, image fields) without developer involvement, ending inconsistent form requirements across business units.",
      "Integrated the CRM with 3CX for telephony, bringing call-related workflows directly into the platform.",
      "Built the frontend for a TV shopping platform integrating 3CX and Avaya PBX systems, matching incoming customer calls to real-time on-air promotions and enabling live product inventory management.",
      "Built an internal e-learning platform for onboarding new customer service staff, including a KPI dashboard that gives leadership visibility into training progress and performance.",
    ],
  },
];

export type Domain = {
  title: string;
  text: string;
  tags: string[];
};

/**
 * The same work as the roles above, grouped by the kind of product instead of by
 * employer, so the range is visible at a glance. Everything here comes from the resume.
 */
export const domains: Domain[] = [
  {
    title: "Telephony and real-time calling",
    text: "A browser softphone that handles call signaling, network negotiation and audio routing, with live noise cancellation, plus call workflows wired into other platforms.",
    tags: ["WebRTC", "SIP", "sip.js", "FreeSWITCH", "RNNoise", "3CX", "Avaya"],
  },
  {
    title: "CRM",
    text: "A CRM integrated with 3CX, so call-related workflows happen inside the platform instead of beside it.",
    tags: ["CRM", "3CX", "Vue"],
  },
  {
    title: "Live shopping and commerce",
    text: "A TV shopping platform that matches incoming customer calls to the promotion on air and manages product inventory live.",
    tags: ["3CX", "Avaya", "Inventory", "Real-time"],
  },
  {
    title: "E-learning and dashboards",
    text: "An internal platform for onboarding new customer service staff, with a KPI dashboard that shows leadership training progress and performance.",
    tags: ["E-learning", "KPI dashboard", "Charts"],
  },
  {
    title: "Configurable forms",
    text: "A drag-and-drop form builder so each business domain can set up its own forms without a developer, which ended inconsistent form requirements across units.",
    tags: ["Vue", "Drag and drop", "Form builder"],
  },
  {
    title: "Omnichannel messaging",
    text: "Meta API integrations and the frontend for handling real-time conversations inside the platform.",
    tags: ["Meta APIs", "Real-time"],
  },
  {
    title: "Component systems and testing",
    text: "Proposed shadcn/ui for the team's design system, and cover data handling and UI behavior with unit and end-to-end tests.",
    tags: ["shadcn/ui", "TanStack", "Vitest", "Playwright"],
  },
];

export type SkillGroup = {
  label: string;
  items: { name: string; level?: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Core web",
    items: [
      { name: "TypeScript", level: "Expert" },
      { name: "JavaScript", level: "Expert" },
      { name: "HTML", level: "Expert" },
      { name: "CSS", level: "Expert" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "Vue", level: "Expert" },
      { name: "Nuxt.js", level: "Intermediate" },
      { name: "React", level: "Intermediate" },
      { name: "Next.js", level: "Intermediate" },
      { name: "React Native", level: "Intermediate" },
    ],
  },
  {
    label: "Interface and data",
    items: [
      { name: "shadcn/ui" },
      { name: "TanStack" },
      { name: "Chart.js / Recharts / Vue Data UI" },
    ],
  },
  {
    label: "Real-time",
    items: [
      { name: "WebRTC" },
      { name: "SIP / sip.js" },
      { name: "Real-time audio processing" },
    ],
  },
];

export const education = {
  school: "King Mongkut's Institute of Technology Ladkrabang",
  program: "Information Technology, Software Engineer",
  years: "2019 to 2022",
};

export const languages = [{ name: "English", level: "Advanced" }];
