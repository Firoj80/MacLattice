export const BLOG_SEO: Record<string, { description: string }> = {
  "daisydisk-alternatives": {
    description:
      "Looking for a free DaisyDisk alternative for Mac? We tested GrandPerspective, MacLattice & more on M1/M2/M3. See which disk analyzer wins →",
  },
  "grandperspective-vs-dissectmac": {
    description:
      "GrandPerspective is free but feels dated on Apple Silicon Macs. Compare speed, UI & features with a modern alternative. Both are free →",
  },
  "other-volumes-container": {
    description:
      "Confused by 'Other Volumes in Container' in Disk Utility? It's not a bug—it's APFS. Learn what it means and 3 ways to reclaim space →",
  },
  "macos-system-data-guide": {
    description:
      "That grey 'System Data' bar in macOS Settings is frustratingly vague. We break down the 3 main components—Caches, Logs, and App Support—and show you how to investigate them.",
  },
  "recursive-node-modules-cleaner": {
    description:
      "If you have 50 side projects, you have 50GB of dead dependencies. Learn how to recursively search your Mac for 'node_modules' folders and delete the ones you forgot about.",
  },
  "shrink-docker-mac-disk": {
    description:
      "Deleting Docker images doesn't always free up Mac disk space. We explain the 'sparse file' problem with Docker.raw and how to actually reclaim that 60GB of phantom storage.",
  },
  "clean-xcode-derived-data": {
    description:
      "Xcode's DerivedData folder is a notorious drive hog. We explain what it is, why it grows so big, and how to safely navigate ~/Library/Developer to clear build artifacts and simulator caches.",
  },
  "docker-ios-cleanup": {
    description:
      "That Docker.raw file can grow to 60GB+. Your DerivedData keeps expanding. iOS Simulator caches pile up. Here's how to clean it all.",
  },
  "android-emulator-cleanup": {
    description:
      "Those AVD emulator images and Gradle caches don't delete themselves. Here's where they hide and how to reclaim 50-100GB safely.",
  },
  "npm-node-modules-cleanup": {
    description:
      "Every abandoned side project has a 500MB-1GB node_modules folder. Here's how to find and delete them without breaking your active work.",
  },
  "sequoia-disk-full": {
    description:
      "Updated to Sequoia and now your disk seems even more full? It's probably snapshots, installer leftovers, or re-indexing. Here's how to fix it.",
  },
  "cleanmymac-alternative": {
    description:
      "Not everyone wants to pay a recurring fee to clean their hard drive. Here's why we built MacLattice as a one-time purchase alternative to CleanMyMac X.",
  },
  "delete-duplicates-mac": {
    description:
      "Duplicate finder apps can be pricey for something you can often do manually. Here are practical ways to find and delete duplicate files.",
  },
  "delete-hidden-caches": {
    description:
      "The hidden ~/Library folder is probably holding 50GB+ of caches you don't need. Here's what you can safely delete.",
  },
  "system-data-mystery": {
    description:
      "That grey 'System Data' bar eating 100GB+? We'll show you exactly what's hiding in there and which folders you can safely delete.",
  },
  "beginner-mac-cleanup": {
    description:
      "That 'disk almost full' message doesn't tell you anything useful. Here's exactly where your storage went and how to get 20GB back in 10 minutes.",
  },
};

export function blogSeoDescription(slug: string, fallback: string) {
  return BLOG_SEO[slug]?.description ?? fallback;
}
