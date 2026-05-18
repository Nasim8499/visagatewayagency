export type TemplateField = {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "image" | "qr" | "barcode" | "signature";
  required?: boolean;
};

export type Template = {
  id: string;
  name: string;
  tag: string;
  uses: number;
  pages: number;
  updated: string;
  description: string;
  color: string;
  fields: TemplateField[];
};

export const templates: Template[] = [
  {
    id: "work-permit",
    name: "Work Permit",
    tag: "Government",
    uses: 1284,
    pages: 2,
    updated: "2 days ago",
    description: "MOM Work Permit card layout with QR verification and watermark seal.",
    color: "from-cyan-500/25 to-blue-500/25",
    fields: [
      { key: "FULL_NAME", label: "Full Name", type: "text", required: true },
      { key: "PASSPORT_NUMBER", label: "Passport No.", type: "text", required: true },
      { key: "DATE_OF_BIRTH", label: "Date of Birth", type: "date", required: true },
      { key: "NATIONALITY", label: "Nationality", type: "text", required: true },
      { key: "EMPLOYER_NAME", label: "Employer", type: "text", required: true },
      { key: "ISSUE_DATE", label: "Issue Date", type: "date" },
      { key: "EXPIRY_DATE", label: "Expiry Date", type: "date" },
      { key: "QR_CODE", label: "Verification QR", type: "qr" },
      { key: "PHOTO", label: "Applicant Photo", type: "image" },
    ],
  },
  {
    id: "employment-contract",
    name: "Employment Contract",
    tag: "Legal",
    uses: 842,
    pages: 6,
    updated: "5 days ago",
    description: "Standard bilingual employment contract with signature blocks.",
    color: "from-emerald-500/25 to-teal-500/25",
    fields: [
      { key: "FULL_NAME", label: "Full Name", type: "text", required: true },
      { key: "PASSPORT_NUMBER", label: "Passport No.", type: "text", required: true },
      { key: "EMPLOYER_NAME", label: "Employer", type: "text", required: true },
      { key: "JOB_TITLE", label: "Job Title", type: "text", required: true },
      { key: "SALARY", label: "Monthly Salary", type: "number", required: true },
      { key: "ISSUE_DATE", label: "Start Date", type: "date" },
      { key: "SIGNATURE", label: "Employer Signature", type: "signature" },
    ],
  },
  {
    id: "ipa-letter",
    name: "IPA Letter",
    tag: "Government",
    uses: 612,
    pages: 1,
    updated: "1 week ago",
    description: "In-Principle Approval letter with embassy header and barcode.",
    color: "from-violet-500/25 to-purple-500/25",
    fields: [
      { key: "FULL_NAME", label: "Full Name", type: "text", required: true },
      { key: "APPLICATION_ID", label: "Application ID", type: "text", required: true },
      { key: "VISA_TYPE", label: "Visa Type", type: "text" },
      { key: "ISSUE_DATE", label: "Issue Date", type: "date" },
      { key: "BARCODE", label: "Tracking Barcode", type: "barcode" },
    ],
  },
  {
    id: "offer-letter",
    name: "Offer Letter",
    tag: "HR",
    uses: 548,
    pages: 2,
    updated: "3 days ago",
    description: "Branded company offer letter with salary breakdown table.",
    color: "from-amber-500/25 to-orange-500/25",
    fields: [
      { key: "FULL_NAME", label: "Candidate", type: "text", required: true },
      { key: "JOB_TITLE", label: "Position", type: "text", required: true },
      { key: "SALARY", label: "Salary", type: "number", required: true },
      { key: "EMPLOYER_NAME", label: "Company", type: "text", required: true },
      { key: "ISSUE_DATE", label: "Offer Date", type: "date" },
      { key: "SIGNATURE", label: "HR Signature", type: "signature" },
    ],
  },
  {
    id: "visa-letter",
    name: "Visa Letter",
    tag: "Embassy",
    uses: 421,
    pages: 1,
    updated: "1 day ago",
    description: "Embassy invitation/visa support letter with consular seal area.",
    color: "from-rose-500/25 to-pink-500/25",
    fields: [
      { key: "FULL_NAME", label: "Full Name", type: "text", required: true },
      { key: "PASSPORT_NUMBER", label: "Passport No.", type: "text", required: true },
      { key: "NATIONALITY", label: "Nationality", type: "text" },
      { key: "VISA_TYPE", label: "Visa Type", type: "text" },
      { key: "ISSUE_DATE", label: "Date", type: "date" },
    ],
  },
  {
    id: "worker-id",
    name: "Worker ID Card",
    tag: "ID",
    uses: 380,
    pages: 1,
    updated: "4 days ago",
    description: "Plastic-print ready worker ID with photo, QR and barcode.",
    color: "from-sky-500/25 to-indigo-500/25",
    fields: [
      { key: "FULL_NAME", label: "Worker Name", type: "text", required: true },
      { key: "PASSPORT_NUMBER", label: "Passport No.", type: "text" },
      { key: "EMPLOYER_NAME", label: "Employer", type: "text" },
      { key: "PHOTO", label: "Photo", type: "image" },
      { key: "QR_CODE", label: "QR", type: "qr" },
      { key: "BARCODE", label: "Barcode", type: "barcode" },
    ],
  },
];

export const allVariables: { key: string; label: string; type: TemplateField["type"]; group: string }[] = [
  { key: "FULL_NAME", label: "Full Name", type: "text", group: "Applicant" },
  { key: "PASSPORT_NUMBER", label: "Passport Number", type: "text", group: "Applicant" },
  { key: "DATE_OF_BIRTH", label: "Date of Birth", type: "date", group: "Applicant" },
  { key: "NATIONALITY", label: "Nationality", type: "text", group: "Applicant" },
  { key: "PHOTO", label: "Applicant Photo", type: "image", group: "Applicant" },
  { key: "EMPLOYER_NAME", label: "Employer Name", type: "text", group: "Employer" },
  { key: "JOB_TITLE", label: "Job Title", type: "text", group: "Employer" },
  { key: "SALARY", label: "Salary", type: "number", group: "Employer" },
  { key: "VISA_TYPE", label: "Visa Type", type: "text", group: "Application" },
  { key: "APPLICATION_ID", label: "Application ID", type: "text", group: "Application" },
  { key: "ISSUE_DATE", label: "Issue Date", type: "date", group: "Application" },
  { key: "EXPIRY_DATE", label: "Expiry Date", type: "date", group: "Application" },
  { key: "QR_CODE", label: "Verification QR", type: "qr", group: "Smart" },
  { key: "BARCODE", label: "Tracking Barcode", type: "barcode", group: "Smart" },
  { key: "SIGNATURE", label: "Signature", type: "signature", group: "Smart" },
];
