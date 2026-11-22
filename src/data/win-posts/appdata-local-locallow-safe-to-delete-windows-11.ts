export const appDataLocalGuideBody = `![AppData Local and LocalLow in Windows 11 - What Is Actually Safe to Delete](/blog/appdata-local-locallow-windows-11.webp)

If your \`C:\\Users\\<YourName>\\AppData\` folder has quietly ballooned to **40 GB, 90 GB, or even 100+ GB**, you are not alone. On modern Windows 10 and Windows 11 PCs, **\`AppData\\Local\`** is almost always the single biggest source of hidden C: drive bloat.

**Can you delete the \`AppData\` folder itself? No.** Deleting all of \`AppData\` (or wiping \`AppData\\Local\` blindly) will nuke your browser bookmarks, saved logins, VS Code extensions, game saves, and Microsoft Store apps.

**Can you safely reclaim tens of gigabytes inside \`AppData\\Local\` and \`AppData\\LocalLow\`? Absolutely** — as long as you know which subfolders are disposable caches and which ones store live programs or save data.

Below is the exact folder-by-folder breakdown of what lives inside \`AppData\\Local\` and \`AppData\\LocalLow\`, what is safe to delete, and the safest way to clear it without breaking Windows.

---

## First: How to See What’s Actually Bloating \`AppData\`

Windows hides \`AppData\` by default, and File Explorer refuses to show folder sizes — which makes digging through thousands of tiny cache folders slow and error-prone.

Before deleting a single file:
1. Open **[ScanMyDisk](/windows)** and scan your \`C:\` drive (or point it directly at \`C:\\Users\\<YourName>\\AppData\`).
2. Switch to the **Treemap** or **Sunburst** view to instantly see which 3 or 4 folders inside \`AppData\\Local\` are eating 90% of your space.
3. Instead of deleting files permanently with \`Shift + Delete\`, add safe folders to **ScanMyDisk’s Cleanup Queue**. Everything in the queue is staged for review and routed straight to the **Windows Recycle Bin**, giving you a full safety net if any app needs a file restored.

*(Prefer to open it manually first? Press \`Win + R\`, type \`%LocalAppData%\`, and press **Enter**.)*

---

## Quick-Reference Safety Chart: \`AppData\\Local\` & \`LocalLow\`

| Folder Path | Typical Size | Safe to Delete? | How to Delete Safely |
| :--- | :--- | :--- | :--- |
| \`AppData\\Local\\Temp\` (\`%TEMP%\`) | 1 GB – 25+ GB | **Yes** | Select contents in **ScanMyDisk** → Cleanup Queue → Recycle Bin (skip in-use files) |
| \`AppData\\Local\\CrashDumps\` | 500 MB – 15+ GB | **Yes** | Delete all \`.dmp\` files via **ScanMyDisk** Cleanup Queue |
| \`AppData\\Local\\D3DSCache\` | 200 MB – 5 GB | **Yes** | Clear via Disk Cleanup or **ScanMyDisk** (rebuilds automatically) |
| \`AppData\\Local\\uv\` / \`pip\` / Dev Caches | 2 GB – 30+ GB | **Yes (caches only)** | Clear cache folders with **ScanMyDisk** or \`uv cache clean\` |
| \`AppData\\Local\\Packages\` | 2 GB – 40+ GB | **Caution (Never delete whole folder)** | Reset/uninstall Store apps or clean only \`TempState\`/\`LocalCache\` via **ScanMyDisk** |
| \`AppData\\Local\\Programs\` | 2 GB – 30+ GB | **No (Live Apps!)** | Use **ScanMyDisk’s App Uninstaller** so binaries + leftovers are removed cleanly |
| \`AppData\\Local\\Microsoft\\Edge\\User Data\\Default\` | 1 GB – 15 GB | **Cache only — NOT \`Default\`** | Delete only \`Cache\\Cache_Data\`, \`Code Cache\`, and \`GPUCache\` |
| \`AppData\\LocalLow\` | 500 MB – 20+ GB | **Selectively** | Safe for shader caches & temp logs; **never** wipe blindly (holds Unity game saves) |

---

## 1. \`AppData\\Local\\Temp\` (\`%TEMP%\`) — **100% Safe to Clean**

**What it is:** Temporary files dropped by Windows installers, browsers, Office, and extractors that forgot to clean up after themselves.

**How to delete safely:**
1. Close open browsers and installers.
2. In **[ScanMyDisk](/windows)**, expand \`C:\\Users\\<YourName>\\AppData\\Local\\Temp\` and sort by size to spot massive forgotten \`.tmp\` or extracted installer folders.
3. Add the contents inside \`Temp\` (keep the empty \`Temp\` folder itself) to the **Cleanup Queue** and execute. If Windows reports a file is currently in use, skip it — that just means a running app is actively using it.

---

## 2. \`AppData\\Local\\CrashDumps\` — **100% Safe to Delete**

**What it is:** Every time a game, browser, or heavy desktop app crashes, Windows writes a full memory snapshot (\`.dmp\` file) into \`AppData\\Local\\CrashDumps\`. A single crashing game or Electron app can easily dump **5–15 GB** of \`.dmp\` files here.

**How to delete safely:**
* Unless you are actively debugging a crash with a developer, every \`.dmp\` file inside \`CrashDumps\` is dead weight.
* Open \`AppData\\Local\\CrashDumps\` in **[ScanMyDisk](/windows)**, select all \`.dmp\` files, and send them through the **Cleanup Queue** to the Recycle Bin.

---

## 3. \`AppData\\Local\\D3DSCache\` — **Safe to Delete**

**What it is:** The **Direct3D Shader Cache**, where Windows and PC games store compiled GPU shaders so levels load faster. Over time — especially after GPU driver updates or uninstalling games — stale shaders pile up here.

**How to delete safely:**
* **Option A (Built-in):** Run **Disk Cleanup** on \`C:\` and check **DirectX Shader Cache**.
* **Option B (Visual cleanup):** Locate \`AppData\\Local\\D3DSCache\` inside **[ScanMyDisk](/windows)**, send its contents to the **Cleanup Queue**, and confirm. Games will simply recompile fresh shaders for the titles you still play on the next launch.

---

## 4. \`AppData\\Local\\Packages\` — **Caution (Do Not Delete the Whole Folder)**

**What it is:** Storage for **Microsoft Store (UWP/MSIX) apps** and built-in Windows 11 shell components — including **Windows Widgets (\`MicrosoftWindows.Client.WebExperience\`)**, Xbox, Photos, Windows Terminal, WhatsApp, and WSL distros.

**Why you must be careful:** Deleting \`AppData\\Local\\Packages\` directly will break your Start Menu widgets, Microsoft Store, and every installed Store app.

**How to clean \`Packages\` safely:**
1. Open \`AppData\\Local\\Packages\` in **[ScanMyDisk](/windows)** to see *which exact app* is taking up gigabytes (common culprits: WhatsApp Desktop media, Xbox/Minecraft, Clipchamp, or \`MicrosoftWindows.Client.WebExperience\` web caches).
2. **If you no longer use that app:** Uninstall it properly via **Settings → Apps → Installed apps** (or **ScanMyDisk’s App Uninstaller**).
3. **If you still use the app:** Expand that specific app's folder inside **ScanMyDisk** and clean **only** its \`TempState\`, \`AC\\INetCache\`, or \`LocalCache\` subfolders via the **Cleanup Queue** — never touch \`Settings\` or \`LocalState\` unless you want to wipe the app's local data.
4. **If \`MicrosoftWindows.Client.WebExperience\` is bloated:** Turn off unused Widgets in Taskbar settings, or run \`winget uninstall "Windows Web Experience Pack"\` only if you intentionally want to remove the Windows 11 Widgets board.

---

## 5. \`AppData\\Local\\Programs\` — **Do NOT Delete Manually (Actual Installed Software Lives Here)**

**What it is:** Many modern apps install per-user directly inside \`AppData\\Local\\Programs\` instead of \`C:\\Program Files\` so they don't need admin rights to auto-update. Common apps living here include:
* **Microsoft VS Code** (\`AppData\\Local\\Programs\\Microsoft VS Code\`)
* **Python** (\`AppData\\Local\\Programs\\Python\`)
* **Ollama** (\`AppData\\Local\\Programs\\Ollama\`)
* **Cursor, Discord, GitHub Desktop, and Electron apps**

**How to clean it safely:**
* **Never delete an active app folder manually** — that leaves broken Start Menu shortcuts, PATH entries, and registry keys behind.
* Instead, open **[ScanMyDisk’s built-in App Uninstaller](/windows)** to uninstall programs you no longer need. ScanMyDisk runs the proper uninstaller **and** scans for leftover folders in \`AppData\\Local\`, \`AppData\\Roaming\`, and \`ProgramData\` so orphaned gigabytes don't stay behind.
* If you already uninstalled an app (like an old VS Code or Ollama build) and an orphaned folder is still sitting inside \`AppData\\Local\\Programs\`, verify it's gone from Installed Apps, then stage the leftover folder in **ScanMyDisk’s Cleanup Queue** so it moves safely to the Recycle Bin first.

---

## 6. Browser Profiles (\`Edge\\User Data\\Default\`, Chrome, Brave, Opera) — **Clean Caches Only**

A common question we see is: *Can I delete \`C:\\Users\\<You>\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\`?*

**No — never delete the entire \`Default\` folder.** It stores your bookmarks, saved passwords, extensions, open tabs, and login cookies.

**What IS safe to delete inside \`Default\` (Edge, Chrome, Brave):**
* \`Cache\\Cache_Data\`
* \`Code Cache\`
* \`GPUCache\`
* \`Service Worker\\CacheStorage\`

**How to delete safely:**
1. Close the browser completely (check Task Manager so no background browser processes remain).
2. Either clear cached images/files inside the browser's **Privacy & Security** settings, or open the profile folder in **[ScanMyDisk](/windows)**, select *only* the cache subfolders listed above, and route them through the **Cleanup Queue** to the Recycle Bin.

---

## 7. Developer & AI Caches (\`uv\`, \`pip\`, \`npm\`, \`NuGet\`, \`Docker\`) — **Safe to Clear Caches**

If you code or run local AI tools on Windows, \`AppData\\Local\` can easily hit **50–100 GB** from package caches alone:
* **\`AppData\\Local\\uv\\cache\`** (Python \`uv\` package manager)
* **\`AppData\\Local\\pip\\Cache\`** (Python \`pip\`)
* **\`AppData\\Local\\npm-cache\`** / \`Yarn\` / \`pnpm\`
* **\`AppData\\Local\\Docker\\wsl\`** (\`docker_data.vhdx\` / \`ext4.vhdx\` virtual disks)

**How to delete safely:**
* **For \`uv\` and \`pip\`:** Run \`uv cache clean\` or \`pip cache purge\` in PowerShell — or inspect \`AppData\\Local\\uv\\cache\` directly inside **[ScanMyDisk](/windows)** and queue the cache folder to the Recycle Bin. Your installed Python environments remain intact.
* **For Docker / WSL2 \`.vhdx\` files:** **Never delete \`ext4.vhdx\` directly** (that deletes your Linux distro and containers). Instead, follow our step-by-step guide to [shrink Docker and WSL2 \`ext4.vhdx\` disks safely](/blog/shrink-docker-wsl2-ext4-vhdx-windows).
* **For Visual Studio, Gradle, and \`node_modules\`:** See our [Windows developer cache cleanup guide](/blog/clean-developer-caches-node-modules-gradle-visual-studio-windows).

---

## 8. Is \`AppData\\LocalLow\` Safe to Delete?

**Short answer: Never delete the entire \`LocalLow\` folder, because hundreds of PC games (especially Unity engine games) store your actual save files inside \`AppData\\LocalLow\\<Developer>\\<Game>\`.**

**What IS safe to delete inside \`AppData\\LocalLow\`:**
* **\`NVIDIA\\PerDriverVersion\\DXCache\`** and **\`AMD\\DxCache\`** / **\`Intel\\ShaderCache\`** (old shader caches — safe to clear; rebuild automatically)
* **\`Temp\`** subfolders inside \`LocalLow\`
* **Folders belonging to games or software you already uninstalled** (for example, old Unity crash logs or abandoned browser plugin folders)

**How to clean \`LocalLow\` safely:**
1. Scan \`C:\\Users\\<YourName>\\AppData\\LocalLow\` in **[ScanMyDisk](/windows)** to see which subfolders are actually large (most are only a few kilobytes — only bother with folders over 100 MB).
2. Double-click into any large game folder to confirm you are deleting \`Player.log\` or cache folders — **not** \`.sav\` or profile save folders.
3. Route verified caches and uninstalled leftovers through **ScanMyDisk’s Cleanup Queue → Recycle Bin**, launch your games once to be 100% sure everything loads cleanly, and only then empty the Recycle Bin.

---

## How to Safely Clear 50–100 GB of \`AppData\` Without Breaking Windows

If your \`AppData\` folder is close to 100 GB, don't run random "clear AppData" scripts from the internet — automated scripts can't tell the difference between a 20 GB cache and your local save files or VS Code installation.

Follow this 5-minute safe cleanup routine instead:

1. **Scan visually first:** Download and open **[ScanMyDisk](/windows)** (100% offline, zero telemetry) and scan \`C:\\Users\\<YourName>\\AppData\`.
2. **Use Snapshot Comparison (optional pro move):** Take a quick snapshot before cleaning so you can see exactly how many gigabytes you reclaimed afterward.
3. **Clear guaranteed-safe caches first:** Queue \`Local\\Temp\`, \`Local\\CrashDumps\`, \`Local\\D3DSCache\`, and \`Local\\uv\\cache\` / \`pip\\Cache\` into **ScanMyDisk’s Cleanup Queue**.
4. **Uninstall dead apps cleanly:** Use **ScanMyDisk’s App Uninstaller** to remove bloated apps in \`AppData\\Local\\Programs\` and sweep away their orphaned leftovers in \`AppData\\Roaming\` and \`C:\\ProgramData\`.
5. **Check for hidden duplicates:** Run **ScanMyDisk’s Content-Hash Duplicate Finder** on your User folder to catch duplicate installers, media backups, or archive files you didn't realize existed.
6. **Review & Recycle:** Confirm the **Cleanup Queue** so everything goes to the **Recycle Bin** first. Reboot, verify your apps open normally, and empty the Recycle Bin to lock in your free space.

*(Also have a massive \`C:\\ProgramData\` folder? Check our companion [C:\\ProgramData (%ProgramData%) Safe-to-Delete Reference Guide](/blog/what-is-programdata-windows-11-safe-to-delete) and our [AppData & ProgramData Uninstalled Leftovers Guide](/blog/clean-appdata-programdata-leftovers-windows).)*

---

## Frequently Asked Questions

### Why is my \`AppData\` folder 90 GB or 100 GB?
On Windows 11, an \`AppData\` folder over 50 GB is almost always caused by one of five things: a Docker/WSL2 \`ext4.vhdx\` virtual disk, massive \`AppData\\Local\\Temp\` or \`CrashDumps\` files, developer caches (\`uv\`, \`pip\`, \`npm\`, NuGet), Telegram/WhatsApp/Discord media caches, or uninstalled games/apps leaving orphaned data behind. Scanning \`AppData\` with **[ScanMyDisk](/windows)** pinpoints the exact culprit in seconds.

### Is it safe to delete \`AppData\\Local\\Temp\`?
Yes. Everything inside \`C:\\Users\\<You>\\AppData\\Local\\Temp\` is temporary data. Close your open apps, delete the contents (skipping any file Windows says is currently in use), and leave the empty \`Temp\` folder itself intact.

### Is \`AppData\\LocalLow\` safe to delete?
No — don't delete the entire folder. Many Unity and indie PC games save your game progress inside \`AppData\\LocalLow\`. Only delete GPU shader caches, temp logs, or folders belonging to games you have permanently uninstalled.

### How do I remove every folder in \`AppData\` that doesn't have an installed program?
Avoid blind auto-cleaner scripts, because some folders use the publisher's company name rather than the app's name. Instead, inspect the largest folders in **[ScanMyDisk](/windows)**, cross-check against **Installed apps**, and route suspected orphaned folders through ScanMyDisk’s **Cleanup Queue** into the Recycle Bin so you can restore any folder with one click if needed.
`;
