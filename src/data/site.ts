export const SITE = {
  name: "MacLattice",
  origin: "https://maclattice.com",
  tagline: "Visualize your disk usage and reclaim space on your Mac.",
  email: "support@maclattice.com",
  reddit: "https://reddit.com/r/maclattice",
  siliconDmg:
    "https://pub-ce87a2625bef4c2dae47d7d3202def2e.r2.dev/DissectMac.dmg",
  intelDmg:
    "https://pub-ce87a2625bef4c2dae47d7d3202def2e.r2.dev/DissectMac-x64.dmg",
  afterDownload: "https://dissectmac.com/?ref=firoj",
  checkout:
    "https://checkout.dodopayments.com/buy/pdt_0NWbed6DlbTojUeaLK1yH?quantity=1&redirect_url=https://www.dissectmac.com%2Fthanks",
} as const;

export const ROTATING_WORDS = [
  "storage",
  "system data",
  "cache",
  "cpu usage",
  "memory",
  "app leftovers",
  "docker.raw",
  "large files",
  "local llm",
] as const;

export const FEATURES = [
  {
    name: "Blazing Fast",
    description: "Native Apple Silicon support. Scans your entire drive in seconds.",
    icon: "rotate",
  },
  {
    name: "Visual Clarity",
    description: "Interactive map shows exactly what's taking up your space.",
    icon: "grid",
  },
  {
    name: "Privacy First",
    description: "100% local processing. Your files never leave your Mac.",
    icon: "shield",
  },
  {
    name: "App Uninstaller",
    description: "Remove apps and their hidden leftover files completely.",
    icon: "trash",
  },
  {
    name: "Smart Search",
    description:
      "Tired of default finder? Try MacLattice for blazing fast search across mac in seconds.",
    icon: "search",
  },
  {
    name: "Live Monitoring",
    description: "Track CPU, RAM, and Network usage in real-time.",
    icon: "activity",
  },
] as const;

export const SHOWCASES = [
  {
    title: "Visualize Your Space",
    description:
      "See your entire drive at a glance. The interactive treemap makes it instantly obvious what's eating up your storage—from massive Video archives to hidden `System Data`.",
    image: "/dissectmac-home.webp",
  },
  {
    title: "Intelligent Search",
    description:
      "Tired of the default Finder? Use our blazing fast search to find anything on your entire Mac in seconds. It's the file search you've always wanted.",
    image: "/search.webp",
  },
  {
    title: "App Uninstaller",
    description:
      "Remove apps completely. MacLattice scans for associated `~/Library/Containers`, caches, and preference files to ensure no junk is left behind.",
    image: "/appuninstaller.webp",
  },
  {
    title: "Cleanup Leftovers",
    description:
      "Found old app residue? Detect and remove orphaned `Application Support` files from apps you deleted years ago. Reclaim gigabytes in a single click.",
    image: "/moving-to-trashlist.webp",
  },
  {
    title: "Real-time Monitoring",
    description:
      "Keep an eye on system resources. Monitor CPU load, memory pressure, and network activity to identify performance bottlenecks during heavy builds.",
    image: "/monitoring.webp",
  },
  {
    title: "Beautiful Themes",
    description:
      "Make it yours with premium themes. Choose from Forest, Ocean, and Aurora. Fully compatible with macOS Dark Mode for a seamless developer experience.",
    image: "/foresttheme.webp",
  },
] as const;

export const STEPS = [
  { n: "01", title: "Download", body: "Get the lightweight native macOS app." },
  { n: "02", title: "Scan", body: "Select any drive or folder to analyze." },
  { n: "03", title: "Find", body: "See storage hogs instantly in the treemap." },
  { n: "04", title: "Reclaim", body: "Delete unwanted files and free up space." },
] as const;
