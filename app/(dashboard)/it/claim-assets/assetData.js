import { Laptop, Tablet, Smartphone, Monitor, Printer, Headphones, CheckCircle, Clock, XCircle, Cpu, HardDrive, Keyboard, Mouse, Camera, Watch } from "lucide-react";

export const ICON_MAP = {
  Laptop:            Laptop,
  MacBook:           Laptop,
  iPad:              Tablet,
  "Android Tablets": Tablet,
  "Android Phone":   Smartphone,
  iPhone:            Smartphone,
  Monitor:           Monitor,
  Printer:           Printer,
  Headphones:        Headphones,
};

/**
 * Maps Font Awesome class strings returned by the API (e.g. "fa-solid fa-laptop")
 * to Lucide React icon components so we don't need the FA library.
 * Falls back to Laptop for any unrecognised class.
 */
export function faClassToLucide(faClass = "") {
  const cls = faClass.toLowerCase();
  if (cls.includes("laptop") || cls.includes("macbook"))        return Laptop;
  if (cls.includes("tablet") || cls.includes("ipad"))           return Tablet;
  if (cls.includes("mobile") || cls.includes("phone") || cls.includes("iphone")) return Smartphone;
  if (cls.includes("desktop") || cls.includes("monitor") || cls.includes("display")) return Monitor;
  if (cls.includes("printer"))                                  return Printer;
  if (cls.includes("headphone") || cls.includes("headset"))     return Headphones;
  if (cls.includes("camera"))                                   return Camera;
  if (cls.includes("keyboard"))                                 return Keyboard;
  if (cls.includes("mouse"))                                    return Mouse;
  if (cls.includes("watch"))                                    return Watch;
  if (cls.includes("hdd") || cls.includes("hard-drive") || cls.includes("storage")) return HardDrive;
  if (cls.includes("cpu") || cls.includes("microchip") || cls.includes("chip"))     return Cpu;
  return Laptop; // sensible default
}

export const ASSETS = [
  { id: 1,  name: "Laptop",                      category: "Laptop",          available: true,  assignedTo: null,              assignedDate: null         },
  { id: 2,  name: "Macbook",                      category: "MacBook",         available: true,  assignedTo: null,              assignedDate: null         },
  { id: 3,  name: "IPAD PRO (MHC-004)",           category: "iPad",            available: false, assignedTo: "Abhishek Badiger", assignedDate: "2026-04-10" },
  { id: 4,  name: "32GB I Pad 9.7 (MHC-001)",     category: "iPad",            available: true,  assignedTo: null,              assignedDate: null         },
  { id: 5,  name: "Samsung Galaxy Tab S10 Ultra",  category: "Android Tablets", available: true,  assignedTo: null,              assignedDate: null         },
  { id: 6,  name: "32GB I Pad Wi-Fi (MHC-005)",   category: "iPad",            available: false, assignedTo: "Darshan T",        assignedDate: "2026-03-22" },
  { id: 7,  name: "Samsung Tab S7 (MHC-006)",     category: "Android Tablets", available: true,  assignedTo: null,              assignedDate: null         },
  { id: 8,  name: "Ipad pro 5G (MHC-007)",        category: "iPad",            available: true,  assignedTo: null,              assignedDate: null         },
  { id: 9,  name: "Samsung Galaxy J8",            category: "Android Phone",   available: true,  assignedTo: null,              assignedDate: null         },
  { id: 10, name: "One plus R 5G",                category: "Android Phone",   available: false, assignedTo: "Priya Sharma",     assignedDate: "2026-05-01" },
  { id: 11, name: "Apple iPhone 13",              category: "iPhone",          available: true,  assignedTo: null,              assignedDate: null         },
  { id: 12, name: "Apple iPhone 15 Plus",         category: "iPhone",          available: true,  assignedTo: null,              assignedDate: null         },
];

export const MY_REQUESTS = [
  { id: 1, name: "Macbook",           category: "MacBook",       status: "Approved", date: "2026-06-10" },
  { id: 2, name: "Samsung Galaxy J8", category: "Android Phone", status: "Pending",  date: "2026-06-20" },
  { id: 3, name: "Apple iPhone 13",   category: "iPhone",        status: "Rejected", date: "2026-06-25" },
];

export const STATUS_CONFIG = {
  Approved: { icon: CheckCircle, cls: "text-green-600 bg-green-50 border-green-200",  dark: "text-green-400 bg-green-500/10 border-green-500/20" },
  Pending:  { icon: Clock,       cls: "text-amber-600 bg-amber-50 border-amber-200",  dark: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  Rejected: { icon: XCircle,     cls: "text-red-600 bg-red-50 border-red-200",        dark: "text-red-400 bg-red-500/10 border-red-500/20"       },
};
