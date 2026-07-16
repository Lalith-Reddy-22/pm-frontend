export const CLIENTS = [
  { name: "Redwine",       poValue: 681864,    predictedGP: 587218,    predictedGPPct: 67.5,  actualGP: 345568.75,  currentGPPct: -4.55,  variance: -330050.25, status: "Low" },
  { name: "Adenys",        poValue: 1186377,   predictedGP: 546084,    predictedGPPct: 46.8,  actualGP: 331438.55,  currentGPPct: -28.42, variance: -807492.55, status: "Low" },
  { name: "Berlin Chemie", poValue: 735155,    predictedGP: 390582.73, predictedGPPct: 53.2,  actualGP: 376680.27,  currentGPPct: 51.24,  variance: -4102.46,   status: "Medium" },
  { name: "BGB",           poValue: 415000,    predictedGP: 310100,    predictedGPPct: 76.7,  actualGP: 317026.75,  currentGPPct: 42.67,  variance: -14921.25,  status: "Medium" },
  { name: "Ditirom",       poValue: 424035,    predictedGP: 424035,    predictedGPPct: 100,   actualGP: 272315,     currentGPPct: 64.22,  variance: -151720,    status: "High" },
  { name: "Eli Lily",      poValue: 172500,    predictedGP: 172500,    predictedGPPct: 100,   actualGP: 123138,     currentGPPct: 71.38,  variance: -49362,     status: "High" },
  { name: "Exelt",         poValue: 250000,    predictedGP: 250000,    predictedGPPct: 100,   actualGP: 199487.5,   currentGPPct: 79.8,   variance: -50512.5,   status: "High" },
  { name: "Ferring",       poValue: 168032,    predictedGP: 168032,    predictedGPPct: 100,   actualGP: 97923.95,   currentGPPct: 57.46,  variance: -71608.05,  status: "Medium" },
  { name: "Lannickday",    poValue: 520000,    predictedGP: 480000,    predictedGPPct: 92.3,  actualGP: 291840,     currentGPPct: 56.11,  variance: -188160,    status: "Medium" },
  { name: "Aaxvis",        poValue: 95000,     predictedGP: 85000,     predictedGPPct: 89.5,  actualGP: 17622.5,    currentGPPct: 18.55,  variance: -67377.5,   status: "Low" },
];

// Derived from CLIENTS — actual GP vs predicted GP per client
export const BAR_DATA = CLIENTS.map(c => ({
  month:     c.name,
  actual:    Math.round(c.actualGP),
  predicted: Math.round(c.predictedGP),
}));

// Derived from CLIENTS — count by currentGPPct bracket
const high   = CLIENTS.filter(c => c.currentGPPct >  60).length;
const medium = CLIENTS.filter(c => c.currentGPPct >= 20 && c.currentGPPct <= 60).length;
const low    = CLIENTS.filter(c => c.currentGPPct <  20).length;

export const PIE_DATA = [
  { name: "High (>60%)",      value: high,   fill: "#dc2626" },
  { name: "Medium (20%-60%)", value: medium, fill: "#9ca3af" },
  { name: "Low (<20%)",       value: low,    fill: "#d1d5db" },
];

// Derived from CLIENTS — top 5 by currentGPPct
export const TOP_PERFORMERS = [...CLIENTS]
  .sort((a, b) => b.currentGPPct - a.currentGPPct)
  .slice(0, 5)
  .map(c => ({ name: c.name, pct: c.currentGPPct }));

const totalPredictedGP  = CLIENTS.reduce((s, c) => s + c.predictedGP, 0);
const totalActualGP     = CLIENTS.reduce((s, c) => s + c.actualGP, 0);
const avgCurrentGPPct   = CLIENTS.reduce((s, c) => s + c.currentGPPct, 0) / CLIENTS.length;
const totalVariance     = CLIENTS.reduce((s, c) => s + c.variance, 0);

export const SUMMARY = {
  totalClients: CLIENTS.length,
  predictedGP:  totalPredictedGP,
  actualGP:     totalActualGP,
  currentGPPct: Math.round(avgCurrentGPPct * 100) / 100,
  variance:     totalVariance,
};

export const barConfig = {
  actual:    { label: "Actual GP",    color: "#dc2626" },
  predicted: { label: "Predicted GP", color: "#9ca3af" },
};

export const pieConfig = {
  high:   { label: "High",   color: "#dc2626" },
  medium: { label: "Medium", color: "#9ca3af" },
  low:    { label: "Low",    color: "#d1d5db" },
};

export const perfConfig = {
  value: { label: "GP%", color: "#dc2626" },
};

export const fmt    = (n) => n == null ? "-" : `$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtM   = (n) => `${n < 0 ? "-" : ""}$${(Math.abs(n) / 1e6).toFixed(2)}M`;
export const fmtPct = (n) => `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(2)}%`;
