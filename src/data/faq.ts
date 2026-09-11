export const FAQS = [
  {
    question: "Which version should I download — Silicon or Intel?",
    answer:
      "If your Mac has an M1, M2, M3, M4, or any M-series chip, download the Silicon version. If your Mac has an Intel processor (typically 2020 or earlier), download the Intel version. Not sure? Click the Apple menu → About This Mac → look for 'Chip' (Silicon) or 'Processor' (Intel).",
  },
  {
    question: "Is Scan My Disk safe to use?",
    answer:
      "Yes. Scan My Disk is officially notarized by Apple, which means Apple has scanned our software for malicious code and confirmed it is safe. Additionally, the app runs 100% locally—your data never leaves your Mac.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. Scan My Disk is designed with privacy at its core. It runs 100% locally on your machine, meaning your file names, folder structures, and scan results never leave your Mac. We don't store your data, and we don't have access to it.",
  },
  {
    question: "What information is sent during a crash report?",
    answer:
      "Scan My Disk uses Sentry.io to detect and fix technical issues. To ensure your privacy, all data is scrubbed on your device before it is sent. We do not collect names, emails, or IP addresses, and we automatically redact folder names in file paths so your private structure stays hidden.",
  },
  {
    question: "What macOS versions are supported?",
    answer:
      "Scan My Disk supports macOS Monterey (12.0) and later. Fully optimized for Apple Silicon and Intel Macs.",
  },
  {
    question: "The app won't open. What do I do?",
    answer:
      "Since we distribute outside the Mac App Store, macOS may block the first launch. Simply right-click the app → click 'Open' → click 'Open' again. This is a one-time step.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. Scan My Disk is a one-time purchase of $7. You get lifetime access to all current features and future updates.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes. We offer a 15-day money-back guarantee, no questions asked. Just email us at support@scanmydisk.com.",
  },
  {
    question: "How is Scan My Disk different from DaisyDisk or CleanMyMac?",
    answer:
      "Scan My Disk offers treemap visualization plus uninstall, leftovers, duplicates, scan comparison, and cleanup presets. Unlike subscription-based tools, we charge a one-time $7. We're privacy-focused with 100% local processing.",
  },
  {
    question: "What does 'System Data' or 'Other' mean on my Mac?",
    answer:
      "System Data includes caches, logs, app containers, and temporary files that macOS generates. Scan My Disk helps you visualize exactly what's in there so you can safely reclaim space.",
  },
] as const;
