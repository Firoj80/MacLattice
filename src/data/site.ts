export const SITE = {
  name: "Scan My Disk",
  /** Canonical brand string for titles, schema, and AI entity matching. */
  brand: "ScanMyDisk",
  origin: "https://www.scanmydisk.com",
  tagline: "A visual disk space analyzer. See what’s eating your disk space.",
  email: "support@scanmydisk.com",
  lifetimePrice: "$5",
  /** Windows build is what we sell today. macOS is planned, not shipping. */
  appReady: true,
} as const;

export type PlatformStatus = "available" | "coming-soon";

/**
 * Flip `macos.status` to "available" when the Mac app ships.
 * Titles, schema operatingSystem, and availability copy read this object.
 */
export const PLATFORMS = {
  windows: {
    id: "windows",
    name: "Windows",
    status: "available" as PlatformStatus,
    detail: "Windows 10 & 11",
    path: "/windows",
  },
  macos: {
    id: "macos",
    name: "macOS",
    status: "coming-soon" as PlatformStatus,
    detail: "macOS",
    path: "/macos",
  },
} as const;

export function macOSAvailable() {
  return PLATFORMS.macos.status === "available";
}

export function availabilitySentence() {
  return macOSAvailable()
    ? "Available for Windows 10 & 11 and macOS."
    : "Available now for Windows 10 & 11. macOS version coming soon.";
}

export function socialAvailability() {
  return macOSAvailable()
    ? "Available for Windows and macOS."
    : "Available for Windows. macOS coming soon.";
}

export function operatingSystems() {
  return macOSAvailable() ? "Windows 10, Windows 11, macOS" : "Windows 10, Windows 11";
}

export const PLATFORM_FAQ = [
  {
    q: "Is ScanMyDisk available for Windows?",
    a: "Yes. ScanMyDisk is currently available for Windows 10 and Windows 11.",
  },
  {
    q: "Is ScanMyDisk available for macOS?",
    a: macOSAvailable()
      ? "Yes. ScanMyDisk is available for macOS as well as Windows 10 and Windows 11."
      : "The macOS version of ScanMyDisk is currently in development and coming soon.",
  },
  {
    q: "What does ScanMyDisk do?",
    a: "ScanMyDisk helps users visualize disk usage, identify large files and folders, find duplicates, inspect storage-heavy files and understand what is consuming disk space.",
  },
  {
    q: "Does ScanMyDisk upload my files?",
    a: "No. Disk scanning and analysis are designed to run locally on the user’s device.",
  },
] as const;
