export const JOIN_VIEWS = [
  {
    name: "Folders",
    body: "Browse folder cards with their sizes and item counts, then open a folder to explore deeper.",
    image: "/windows-views/folders.png",
  },
  {
    name: "Sunburst",
    body: "Rings radiating from the scan root so nested weight is obvious at a glance.",
    image: "/windows-views/sunburst.png",
  },
  {
    name: "Flame",
    body: "Follow stacked folder levels, with wider blocks showing where more disk space is used.",
    image: "/windows-views/flame.png",
  },
  {
    name: "Bubbles",
    body: "Compare relative sizes with nested circles. Large circles make the biggest items stand out.",
    image: "/windows-views/bubbles.png",
  },
  {
    name: "Mind Map",
    body: "Follow branches from your scan root, with dots and links showing relative storage weight.",
    image: "/windows-views/mind-map.png",
  },
  {
    name: "Top Sizes",
    body: "The biggest items, ranked. Skip the hunt and start with the worst offenders.",
    image: "/windows-views/top-sizes.png",
  },
  {
    name: "Age Map",
    body: "Group storage by last-modified date and review large, older files. Age reflects modification, not last access.",
    image: "/windows-views/age-map.png",
  },
  {
    name: "Treemap",
    body: "See nested files and folders as rectangles sized by disk usage. Select a block to inspect it.",
    image: "/windows-views/treemap.png",
  },
] as const;

export const JOIN_TOOLKIT = [
  {
    name: "Complete app uninstaller",
    body: "Every app listed with its true footprint — bundle plus caches, preferences, HTTP storage, and logs. Uninstall the whole set, not just the icon you dragged to Trash.",
    image: "/feature-uninstaller.webp",
  },
  {
    name: "Leftover cleanup",
    body: "Find orphaned Application Support, containers, and preference files from apps you deleted years ago. Reclaim that space in one review.",
    image: "/join-presets.webp",
  },
  {
    name: "Intelligent search",
    body: "Search the entire Mac in seconds. Faster than Finder, and it actually looks inside the places Finder pretends are empty.",
    image: "/feature-search.webp",
  },
  {
    name: "Quick Wins on arrival",
    body: "Downloads, caches, logs, iOS Simulators, node_modules, build artifacts, and Xcode DerivedData are totalled the moment a scan lands.",
  },
  {
    name: "Big and untouched",
    body: "Age Map splits bytes by last-modified date and stages large files you have not opened in over a year — one click to review.",
  },
  {
    name: "Staged cleanup queue",
    body: "Nothing leaves without you. Items go to a review list first. System-critical paths stay excluded. Scan My Disk never deletes in the background.",
  },
  {
    name: "File inspector",
    body: "Size on disk vs logical size, APFS compression savings, file and folder counts, share of the parent, created and modified dates, and the largest things inside.",
  },
  {
    name: "External and network volumes",
    body: "Scan the full Mac, a home folder, an external SSD, or a mounted network share. Same map, same cleanup tools.",
  },
  {
    name: "Real-time monitoring",
    body: "Watch CPU load, memory pressure, and network activity while a heavy build is running so you can see what is actually bottlenecking the machine.",
    image: "/monitoring.webp",
  },
  {
    name: "Beautiful themes",
    body: "Forest, Ocean, and Aurora. Built for macOS Dark Mode so the app sits next to the rest of your tools without shouting.",
    image: "/foresttheme.webp",
  },
  {
    name: "Blazing native scan",
    body: "Apple Silicon and Intel. Incremental walking, so visualisations start filling in while the scan is still running.",
  },
  {
    name: "100% local, private",
    body: "Scanning, hashing, and duplicate matching happen on your Mac. File names never leave the machine.",
  },
] as const;

export const JOIN_SIGNATURE = [
  {
    id: "duplicates",
    kicker: "01 — Duplicate Detection",
    title: "Find every extra copy. Keep one.",
    body: "Scan My Disk matches files by content — photos, videos, documents, and everything else — not just by name. See the extra copies grouped together, then delete the ones you do not need and free the space they were wasting.",
    points: [
      "Detect duplicate files, photos, videos, and documents across the scan.",
      "See every extra copy of the same file, grouped in one place.",
      "Delete the unnecessary copies safely after you review the set.",
    ],
    image: "/join-dupes.webp",
    imageAlt: "Scan My Disk duplicate groups with size bars and keep/delete actions",
  },
  {
    id: "compare",
    kicker: "02 — Saved Scan Comparison",
    title: "Monday was 200 GB. Friday is 230. Where did it go?",
    body: "Save a scan. Run another later. Scan My Disk shows new files, deleted files, folders that grew or shrank, and exactly which path ate the extra storage — so a mysterious 30 GB jump is a list, not a guess.",
    points: [
      "Save the result of the current disk scan as a snapshot.",
      "Compare it against a later scan whenever the drive fills up.",
      "See new files, deleted files, size up or down, and the folder doing the damage.",
    ],
    image: "/join-compare.webp",
    imageAlt: "Scan My Disk comparing two scans with new growth highlighted",
  },
  {
    id: "presets",
    kicker: "03 — Cleanup Presets",
    title: "Pick a profile. Review. Clean.",
    body: "Ready-made cleanup profiles so you are not hunting files one by one. Choose Safe, Developer, Cache, or Large Junk, then walk the suggested set before anything is removed.",
    points: [
      "Safe Cleanup — conservative junk with almost no risk.",
      "Developer Cleanup — DerivedData, node_modules, simulators, build artifacts.",
      "Cache Cleanup and Large Junk Cleanup for the heavy, obvious waste.",
    ],
    image: "/join-presets.webp",
    imageAlt: "Scan My Disk cleanup presets: Safe, Developer, Cache, Large Junk",
  },
] as const;

export const JOIN_FAQ = [
  {
    q: "What does Scan My Disk actually do?",
    a: "It scans a drive or folder and maps every byte, then gives you eight ways to look at the result — folders, sunburst, flame, bubbles, mind map, top sizes, age map and treemap. From there you can find duplicates, compare saved scans, run a cleanup preset, uninstall leftovers, or stage files for review.",
  },
  {
    q: "Do I need an account?",
    a: "No. Buy a lifetime licence and the key shows on the next screen. Install the Windows app and paste the key on first launch.",
  },
  {
    q: "How many Macs can I use?",
    a: "One Mac at a time. Deactivate on the first machine, then activate on the next. Fourteen days offline grace if you forget.",
  },
  {
    q: "Is my data uploaded?",
    a: "No. Scanning, hashing, and duplicate matching all run on your Mac. File names never leave the machine.",
  },
  {
    q: "What if I want a refund?",
    a: "15-day money-back guarantee. Email support@scanmydisk.com.",
  },
];
