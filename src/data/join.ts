export const JOIN_VIEWS = [
  {
    name: "Folders",
    body: "Walk folder by folder, sized as you go, the way a Mac actually stores things.",
  },
  {
    name: "Sunburst",
    body: "Rings radiating from the scan root so nested weight is obvious at a glance.",
  },
  {
    name: "Flame",
    body: "Depth top to bottom, size left to right — a heat map of what is heavy.",
  },
  {
    name: "Bubbles",
    body: "Nested bubbles, one per folder, so outliers pop before you click anything.",
  },
  {
    name: "Mind Map",
    body: "Branches from the root, weighted by size, for people who think in trees.",
  },
  {
    name: "Top Sizes",
    body: "The biggest items, ranked. Skip the hunt and start with the worst offenders.",
  },
  {
    name: "Age Map",
    body: "Where your bytes sit on a timeline. Surface large files you have not opened in a year.",
  },
  {
    name: "Treemap",
    body: "Every file as a rectangle, sized by bytes. The classic map, still the fastest read.",
  },
] as const;

export const JOIN_TOOLKIT = [
  {
    name: "Complete app uninstaller",
    body: "Every app listed with its true footprint — bundle plus caches, preferences, HTTP storage, and logs. Uninstall the whole set, not just the icon you dragged to Trash.",
  },
  {
    name: "Leftover cleanup",
    body: "Find orphaned Application Support, containers, and preference files from apps you deleted years ago. Reclaim that space in one review.",
  },
  {
    name: "Intelligent search",
    body: "Search the entire Mac in seconds. Faster than Finder, and it actually looks inside the places Finder pretends are empty.",
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
  },
  {
    name: "Beautiful themes",
    body: "Forest, Ocean, and Aurora. Built for macOS Dark Mode so the app sits next to the rest of your tools without shouting.",
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
    image: "/join-dupes.jpg",
    imageAlt: "Editorial print of stacked duplicate photos and documents",
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
    image: "/join-compare.jpg",
    imageAlt: "Two disk maps compared, one grown heavier",
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
    image: "/join-disk.jpg",
    imageAlt: "Editorial disk map drawn as nested rooms",
  },
] as const;

export const JOIN_FAQ = [
  {
    q: "Do I need an account?",
    a: "No. Pay $7 on Dodo. They collect your name and email. You get a licence key on the thank-you page and in Dodo’s receipt. No login on this site.",
  },
  {
    q: "What do I get for $7?",
    a: "Everything. All eight views, duplicate finder, complete app uninstaller, leftover cleanup, snapshots you can compare, cleanup presets, live monitor, staged cleanup queue, and every 1.x update. No subscription.",
  },
  {
    q: "When do I get the software?",
    a: "Your key is issued the moment payment clears. The Mac app is emailed to your Dodo checkout address when the build is ready. Paste the key on first launch to activate.",
  },
  {
    q: "Is scanning private?",
    a: "Yes. Scanning, hashing, and duplicate matching happen on your Mac. File names, folder structures, and scan results do not leave the machine.",
  },
  {
    q: "Can it delete something I still need?",
    a: "Not on its own. Everything is staged for review first. System-critical paths are excluded from staging. You decide what actually goes to Trash.",
  },
  {
    q: "How many Macs does one key cover?",
    a: "One at a time — same as DiskBuddy. The app registers a random install id. A second Mac is refused until you choose Deactivate this Mac on the first. Offline, it keeps working for 14 days.",
  },
  {
    q: "Silicon or Intel?",
    a: "Both. If your Mac has an M-series chip, pick Apple Silicon. Intel Macs (typically 2020 or earlier) pick Intel. Apple menu → About This Mac tells you which.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. 15-day money-back guarantee, no questions asked. Email support@scanmydisk.com.",
  },
] as const;
