export const cDriveFullBody = `Your C: drive is 95% full, Windows is showing warnings, and you have no idea where the space went. Sound familiar? This guide explains the most common hidden storage drains on Windows 10 and Windows 11—and how to get 20–80 GB back without buying a new drive or guessing.

## Why Your C: Drive Fills Up for "No Reason"

Windows doesn't do a great job of surfacing hidden storage consumers. The built-in **Settings → System → Storage** view breaks usage into broad categories like "Apps & features" and "Temporary files," but it misses entire classes of hidden bloat. Here are the top culprits:

---

## 1. Windows Update Delivery Cache (~5–20 GB)

Windows Update downloads updates to \`C:\\Windows\\SoftwareDistribution\\Download\` before installing them. After a successful update, these files should be cleaned automatically—but they often aren't, especially after failed or partial updates.

**How to check:** Open File Explorer and navigate to \`C:\\Windows\\SoftwareDistribution\\Download\`. Look at the folder size in the Properties dialog.

**How to fix:** Don't delete the folder manually. Instead, run **Disk Cleanup as Administrator** (search "Disk Cleanup" → right-click → Run as administrator → Clean up system files → check "Windows Update Cleanup"). This safely removes delivered update packages.

---

## 2. WinSxS Folder (~5–15 GB)

The \`C:\\Windows\\WinSxS\` folder stores multiple versions of Windows components to allow rollbacks and repairs. It can grow to 15+ GB on systems that have been updated through several major Windows versions.

**How to check:** Properties on \`C:\\Windows\\WinSxS\` will show an inflated size (it counts hard-linked files multiple times). The *actual* disk impact is usually 5–10 GB.

**How to fix:** Run \`DISM /Online /Cleanup-Image /StartComponentCleanup\` in an Administrator Command Prompt, then optionally add \`/ResetBase\` to remove older superseded components (this prevents rollback to previous versions).

---

## 3. Hibernate File (~6–32 GB)

If Hibernate is enabled, Windows keeps a file called \`hiberfil.sys\` in the root of C:. Its size is 40–75% of your installed RAM. On a 32 GB RAM machine, that's 13–24 GB reserved permanently.

**How to check:** Open File Explorer, enable "Show hidden items" and "Show protected operating system files" in View → Options. Look for \`hiberfil.sys\` at \`C:\\\`.

**How to fix (if you don't use Hibernate):** Run \`powercfg /hibernate off\` in an Administrator Command Prompt. The file is immediately deleted, and Fast Startup is disabled (most people don't notice a difference in boot time).

---

## 4. Page File / Virtual Memory (~2–32 GB)

The Windows page file (\`pagefile.sys\` at \`C:\\\`) is virtual memory. By default it's managed automatically and sized to 1–3× your physical RAM. On machines with 16–32 GB RAM, this can be 8–24 GB.

**How to check:** System Properties → Advanced → Performance Settings → Advanced → Virtual Memory.

**How to fix:** If you have 16+ GB RAM and do not run memory-intensive VMs, you can set a custom size (e.g. 2048 MB fixed) instead of system-managed. This frees significant space. Don't disable it entirely—some system processes require a page file to exist.

---

## 5. Developer Caches (~10–100+ GB)

If you're a developer, the single biggest hidden storage drain is almost certainly your build caches:

| Cache Location | Typical Size | What It Is |
|---|---|---|
| \`node_modules\` folders | 1–5 GB each | npm/yarn dependencies per project |
| \`~/.gradle/caches\` | 10–30 GB | Android/Java build artifacts |
| \`C:\\Users\\<you>\\.nuget\` | 5–20 GB | .NET NuGet package cache |
| Visual Studio: \`%LocalAppData%\\Microsoft\\VisualStudio\` | 5–20 GB | Build artifacts, component cache |
| Docker WSL2: \`ext4.vhdx\` | 20–100+ GB | Virtual disk that grows but doesn't shrink |

**How to find them fast:** [Scan My Disk](/) includes pre-configured developer cleanup presets. Run a scan, switch to the **Folders view**, and open the Developer Presets panel. It will surface every \`node_modules\` folder, Gradle cache, and WSL2 disk image across your whole drive. See our guide: [Developer Windows Disk Cleanup](/blog/clean-developer-caches-node-modules-gradle-visual-studio-windows).

---

## 6. Duplicate Files (~5–50 GB)

Duplicate files accumulate silently: photos copied into multiple albums, downloaded installers downloaded again, project folders duplicated as backups named \`project-v2\`, \`project-final\`, \`project-final-REAL\`.

**How to find them:** Scan My Disk's **3-Pass Content Hashing Duplicate Finder** compares actual file bytes (not just filenames). It first groups files by size, then by fast CRC32 hash, then confirms with a full MD5+SHA-256 pass. Only byte-identical files are flagged. See our guide: [Find and Delete Duplicate Files on Windows](/blog/find-delete-duplicate-files-windows-content-hashing).

---

## 7. AppData & ProgramData Leftovers (~2–20 GB)

Every time you uninstall an app, Windows removes the main program but leaves behind its settings, logs, and data in:

- \`C:\\Users\\<you>\\AppData\\Roaming\`
- \`C:\\Users\\<you>\\AppData\\Local\`
- \`C:\\ProgramData\`

After years of installing and uninstalling software, these can hold 10–20 GB of orphaned folders.

**How to find them:** Scan My Disk's **App Uninstaller & Leftover Cleaner** cross-references every folder in AppData and ProgramData against currently installed applications and flags folders belonging to apps that are no longer installed. See our guide: [Clean AppData and ProgramData Leftovers](/blog/clean-appdata-programdata-leftovers-windows).

---

## 8. Recycle Bin (Variable)

The Recycle Bin reserves up to 10% of a drive's capacity by default and doesn't empty itself. Right-click the Recycle Bin icon and choose "Empty Recycle Bin" to recover this space immediately.

---

## 9. Browser Cache (~1–10 GB)

Chrome, Edge, and Firefox each maintain a local disk cache:
- Chrome: \`C:\\Users\\<you>\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\`
- Edge: \`C:\\Users\\<you>\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache\`
- Firefox: \`C:\\Users\\<you>\\AppData\\Local\\Mozilla\\Firefox\\Profiles\\<profile>\\cache2\`

Clear via each browser's Settings → Privacy → Clear browsing data → Cached images and files.

---

## 10. WSL2 / Docker Disk Images (~20–100+ GB)

If you use Docker Desktop with WSL2 integration (or WSL2 directly), a file called \`ext4.vhdx\` grows every time you create containers or install packages inside WSL—but it never automatically shrinks when you delete things. This phantom storage loss is one of the most baffling C: drive drains for developers.

**How to fix:** See our detailed guide: [How to Shrink the WSL2 ext4.vhdx File](/blog/shrink-docker-wsl2-ext4-vhdx-windows).

---

## The Fastest Way to Find What's Eating Your C: Drive

Instead of checking each category manually, use a disk space analyzer to see your whole drive as a visual map in one pass:

![Treemap of a Windows drive in Scan My Disk](/blog/review/treemap.jpg)

[Scan My Disk](/) scans your C: drive in seconds and displays everything in 8 interactive views. The **Treemap** instantly shows the biggest folders as the biggest blocks. Click any block to drill down. The **Age Map** shows what hasn't been touched in years. The **Top Sizes** list ranks individual files by size.

Once you've identified the culprits, stage them in the **Cleanup Queue** for review. Everything goes to the Windows Recycle Bin first—nothing is permanently deleted without confirmation.

[**Scan Your C: Drive Now →**](/buy)

## C: Drive Full FAQs

### How do I free up space on my C: drive Windows 11?

1. Run Disk Cleanup as Administrator (removes Windows Update cache and system files)
2. Run \`DISM /Online /Cleanup-Image /StartComponentCleanup\` in Admin CMD (shrinks WinSxS)
3. Disable hibernate (\`powercfg /hibernate off\`) if you don't use it
4. Find and delete developer caches (\`node_modules\`, Gradle, WSL2)
5. Find and delete duplicate files
6. Clean AppData and ProgramData leftovers from uninstalled apps

### Why is my C: drive full when I have no files?

Hidden system files, developer caches, duplicate files, and Windows Update packages are the most common causes. Use a disk space analyzer like [Scan My Disk](/) to make them visible.

### Is it safe to delete files from AppData on Windows 11?

Deleting the wrong AppData folder can break applications. Scan My Disk cross-references AppData folders against installed apps and only surfaces folders from applications that are no longer installed, reducing the risk of breaking anything.

### How much space does WinSxS take up and can I delete it?

WinSxS typically takes 5–15 GB of *real* disk space (Explorer shows an inflated size due to hard links). Don't delete the folder manually—use \`DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase\` instead, which removes only the superseded components that Windows no longer needs for rollback.
`;
