export const LEASE_TYPES = [
  "Residential lease",
  "Commercial lease",
  "Sublease / room rental",
  "Short-term rental",
  "Agricultural lease",
  "Vehicle lease",
  "Equipment lease",
  "Other / not sure",
];

export const LANGUAGES = [
  { code: "English", label: "English", flag: "🇬🇧" },
  { code: "Spanish", label: "Español", flag: "🇪🇸" },
  { code: "French", label: "Français", flag: "🇫🇷" },
  { code: "German", label: "Deutsch", flag: "🇩🇪" },
  { code: "Portuguese", label: "Português", flag: "🇵🇹" },
  { code: "Italian", label: "Italiano", flag: "🇮🇹" },
  { code: "Dutch", label: "Nederlands", flag: "🇳🇱" },
  { code: "Polish", label: "Polski", flag: "🇵🇱" },
  { code: "Russian", label: "Русский", flag: "🇷🇺" },
  { code: "Turkish", label: "Türkçe", flag: "🇹🇷" },
  { code: "Arabic", label: "العربية", flag: "🇸🇦" },
  { code: "Hindi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "Chinese", label: "中文", flag: "🇨🇳" },
  { code: "Japanese", label: "日本語", flag: "🇯🇵" },
  { code: "Korean", label: "한국어", flag: "🇰🇷" },
  { code: "Yoruba", label: "Yorùbá", flag: "🇳🇬" },
  { code: "Swahili", label: "Kiswahili", flag: "🇰🇪" },
];

export const JURISDICTIONS = [
  // North America
  { label: "United States — California", flag: "🇺🇸", group: "North America" },
  { label: "United States — New York", flag: "🇺🇸", group: "North America" },
  { label: "United States — Texas", flag: "🇺🇸", group: "North America" },
  { label: "United States — Florida", flag: "🇺🇸", group: "North America" },
  { label: "United States — Illinois", flag: "🇺🇸", group: "North America" },
  { label: "United States — Other state", flag: "🇺🇸", group: "North America" },
  { label: "Canada — Ontario", flag: "🇨🇦", group: "North America" },
  { label: "Canada — British Columbia", flag: "🇨🇦", group: "North America" },
  { label: "Canada — Quebec", flag: "🇨🇦", group: "North America" },
  { label: "Canada — Other province", flag: "🇨🇦", group: "North America" },
  { label: "Mexico", flag: "🇲🇽", group: "North America" },
  // South America
  { label: "Brazil", flag: "🇧🇷", group: "South America" },
  { label: "Argentina", flag: "🇦🇷", group: "South America" },
  { label: "Chile", flag: "🇨🇱", group: "South America" },
  { label: "Colombia", flag: "🇨🇴", group: "South America" },
  { label: "Peru", flag: "🇵🇪", group: "South America" },
  // Europe
  { label: "United Kingdom", flag: "🇬🇧", group: "Europe" },
  { label: "Ireland", flag: "🇮🇪", group: "Europe" },
  { label: "Germany", flag: "🇩🇪", group: "Europe" },
  { label: "France", flag: "🇫🇷", group: "Europe" },
  { label: "Spain", flag: "🇪🇸", group: "Europe" },
  { label: "Italy", flag: "🇮🇹", group: "Europe" },
  { label: "Netherlands", flag: "🇳🇱", group: "Europe" },
  { label: "Belgium", flag: "🇧🇪", group: "Europe" },
  { label: "Switzerland", flag: "🇨🇭", group: "Europe" },
  { label: "Austria", flag: "🇦🇹", group: "Europe" },
  { label: "Portugal", flag: "🇵🇹", group: "Europe" },
  { label: "Sweden", flag: "🇸🇪", group: "Europe" },
  { label: "Norway", flag: "🇳🇴", group: "Europe" },
  { label: "Denmark", flag: "🇩🇰", group: "Europe" },
  { label: "Finland", flag: "🇫🇮", group: "Europe" },
  { label: "Poland", flag: "🇵🇱", group: "Europe" },
  { label: "Czechia", flag: "🇨🇿", group: "Europe" },
  { label: "Hungary", flag: "🇭🇺", group: "Europe" },
  { label: "Greece", flag: "🇬🇷", group: "Europe" },
  // Middle East
  { label: "Turkey", flag: "🇹🇷", group: "Middle East" },
  { label: "Israel", flag: "🇮🇱", group: "Middle East" },
  { label: "United Arab Emirates", flag: "🇦🇪", group: "Middle East" },
  { label: "Saudi Arabia", flag: "🇸🇦", group: "Middle East" },
  { label: "Egypt", flag: "🇪🇬", group: "Middle East" },
  // Africa
  { label: "Nigeria — Lagos", flag: "🇳🇬", group: "Africa" },
  { label: "Nigeria — Abuja FCT", flag: "🇳🇬", group: "Africa" },
  { label: "Nigeria — Other state", flag: "🇳🇬", group: "Africa" },
  { label: "South Africa", flag: "🇿🇦", group: "Africa" },
  { label: "Kenya", flag: "🇰🇪", group: "Africa" },
  { label: "Ghana", flag: "🇬🇭", group: "Africa" },
  { label: "Morocco", flag: "🇲🇦", group: "Africa" },
  // Asia
  { label: "India", flag: "🇮🇳", group: "Asia" },
  { label: "Pakistan", flag: "🇵🇰", group: "Asia" },
  { label: "Japan", flag: "🇯🇵", group: "Asia" },
  { label: "South Korea", flag: "🇰🇷", group: "Asia" },
  { label: "China", flag: "🇨🇳", group: "Asia" },
  { label: "Hong Kong", flag: "🇭🇰", group: "Asia" },
  { label: "Singapore", flag: "🇸🇬", group: "Asia" },
  { label: "Malaysia", flag: "🇲🇾", group: "Asia" },
  { label: "Indonesia", flag: "🇮🇩", group: "Asia" },
  { label: "Philippines", flag: "🇵🇭", group: "Asia" },
  { label: "Thailand", flag: "🇹🇭", group: "Asia" },
  { label: "Vietnam", flag: "🇻🇳", group: "Asia" },
  // Oceania
  { label: "Australia — New South Wales", flag: "🇦🇺", group: "Oceania" },
  { label: "Australia — Victoria", flag: "🇦🇺", group: "Oceania" },
  { label: "Australia — Other state", flag: "🇦🇺", group: "Oceania" },
  { label: "New Zealand", flag: "🇳🇿", group: "Oceania" },
  // Other
  { label: "Other / Not sure", flag: "🏳️", group: "Other" },
];

export function getJurisdiction(value) {
  return JURISDICTIONS.find((j) => j.label === value) || { label: value || "Unknown", flag: "🏳️" };
}

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) || { code: "English", label: "English", flag: "🇬🇧" };
}