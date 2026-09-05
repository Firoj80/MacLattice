export const FAQS = [
  {
    question: "Which version should I download — Silicon or Intel?",
    answer:
      "If your Mac has an M1, M2, M3, M4, or any M-series chip, download the Silicon version. If your Mac has an Intel processor (typically 2020 or earlier), download the Intel version. Not sure? Click the Apple menu → About This Mac → look for 'Chip' (Silicon) or 'Processor' (Intel).",
  },
  {
    question: "Is MacLattice safe to use?",
    answer:
      "Yes. MacLattice is officially notarized by Apple, which means Apple has scanned our software for malicious code and confirmed it is safe. Additionally, the app runs 100% locally—your data never leaves your Mac.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. MacLattice is designed with privacy at its core. It runs 100% locally on your machine, meaning your file names, folder structures, and scan results never leave your Mac. We don't store your data, and we don't have access to it.",
  },
  {
    question: "What information is sent during a crash report?",
    answer:
      "MacLattice uses Sentry.io to detect and fix technical issues. To ensure your privacy, all data is scrubbed on your device before it is sent. We do not collect names, emails, or IP addresses, and we automatically redact folder names in file paths so your private structure stays hidden.",
  },
  {
    question: "What macOS versions are supported?",
    answer:
      "MacLattice supports macOS Monterey (12.0) and later. Fully optimized for Apple Silicon and Intel Macs.",
  },
  {
    question: "The app won't open. What do I do?",
    answer:
      "Since we distribute outside the Mac App Store, macOS may block the first launch. Simply right-click the app → click 'Open' → click 'Open' again. This is a one-time step.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. MacLattice Pro is a one-time purchase of $12.99. You get lifetime access to all current features and future updates.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes. We offer a 15-day money-back guarantee, no questions asked. Just email us at support@maclattice.com.",
  },
  {
    question: "How is MacLattice different from DaisyDisk or CleanMyMac?",
    answer:
      "MacLattice offers a generous free tier with treemap visualization. Unlike subscription-based tools, our Pro version is a one-time $12.99 purchase. We're privacy-focused with 100% local processing.",
  },
  {
    question: "What does 'System Data' or 'Other' mean on my Mac?",
    answer:
      "System Data includes caches, logs, app containers, and temporary files that macOS generates. MacLattice helps you visualize exactly what's in there so you can safely reclaim space.",
  },
] as const;
