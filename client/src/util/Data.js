// src/util/Data.js
const treatments = [
  {
    category: "Preventive Dentistry",
    treatments: [
      { name: "Dental check-ups & consultations" },
      { name: "Oral examination & diagnosis", examples: ["X-rays", "scans"] },
      { name: "Dental cleaning / Scaling & polishing" },
      { name: "Fluoride treatment" },
      { name: "Dental sealants" },
      { name: "Preventive resin restorations" },
      { name: "Oral hygiene instructions" },
    ],
    fee: 500, // 💰 You can set default fee if you want
  },
  {
    category: "Restorative Dentistry",
    treatments: [
      { name: "Dental fillings", types: ["composite", "amalgam", "GIC"] },
      { name: "Inlays & Onlays" },
      {
        name: "Dental crowns",
        types: ["metal", "ceramic", "zirconia", "porcelain-fused-to-metal"],
      },
      { name: "Bridges (fixed partial dentures)" },
      { name: "Dental bonding" },
    ],
    fee: 1500,
  },
  {
    category: "Cosmetic Dentistry",
    treatments: [
      { name: "Teeth whitening / bleaching", modes: ["in-office", "at-home"] },
      { name: "Dental veneers", types: ["porcelain", "composite"] },
      { name: "Cosmetic bonding" },
      { name: "Smile design / makeover" },
      { name: "Tooth reshaping / contouring" },
      { name: "Gum contouring / gingival depigmentation" },
      { name: "Cosmetic crowns" },
    ],
    fee: 2500,
  },
  {
    category: "Prosthodontics",
    description: "Artificial teeth & replacements",
    treatments: [
      { name: "Dentures", types: ["complete", "partial"] },
      { name: "Flexible dentures" },
      { name: "Implant-supported dentures" },
      {
        name: "Dental implants",
        variants: ["single tooth", "multiple", "full arch"],
      },
      { name: "All-on-4 / All-on-6 implants" },
    ],
    fee: 5000,
  },
  // ... you can continue same for Endodontics, Periodontics, etc
];

export default treatments;
