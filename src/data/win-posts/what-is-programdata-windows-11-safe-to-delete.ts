export const programDataGuideBody = `![What Is C:\\ProgramData in Windows 11 and What Is Safe to Delete](/blog/programdata-windows-11.webp)

If you just ran a disk scan on a cramped Windows 10 or Windows 11 PC and noticed **\`C:\\ProgramData\`** taking up 15 GB, 30 GB, or even 50+ GB of your C: drive, your first instinct is probably to ask: *Can I delete this folder?*

**The short answer: No — never delete \`C:\\ProgramData\` itself.** Deleting it (or blindly wiping subfolders inside it) will break installed programs, Windows Update, Microsoft Store apps, and system services.

**The good news:** You *can* safely shrink \`C:\\ProgramData\` — often by gigabytes — once you know which subfolders are disposable caches, which ones require a proper cleanup command, and which ones you should never touch.

This guide breaks down what \`%ProgramData%\` actually is, how it differs from \`AppData\` and \`Program Files\`, and gives you a **subfolder-by-subfolder safety reference** for the biggest space hogs hiding inside it.

---

## What Is \`C:\\ProgramData\` (\`%ProgramData%\`)?

\`C:\\ProgramData\` is a hidden system folder where Windows and third-party applications store **shared, machine-wide application data** that applies to every user account on your PC.

Think of it as the shared backroom for your installed software:
* Windows Update metadata and error reports
* Antivirus definitions and scan logs
* Shared installer caches (Visual Studio, .NET, Microsoft 365, Adobe)
* GPU driver download caches (NVIDIA, AMD, Intel)
* Game launcher data and shared license files
* Windows Search index databases and Windows Container layers

Because Windows hides \`C:\\ProgramData\` by default, most users don't even know it exists until their C: drive runs out of space.

> **Why do you sometimes see \`C:\\Users\\All Users\`?**  
> \`C:\\Users\\All Users\` is a legacy Windows symlink (junction point) that points directly to \`C:\\ProgramData\`. They are the **exact same folder** — it is not taking up double space on your drive.

---

## \`Program Files\` vs. \`ProgramData\` vs. \`AppData\`: What’s the Difference?

Windows splits application files across three separate folders for permissions and multi-user isolation. Knowing which is which prevents accidental breakage:

| Folder | Path / Shortcut | Scope | What Lives Here | Safe to Clean? |
| :--- | :--- | :--- | :--- | :--- |
| **Program Files** | \`C:\\Program Files\` & \`C:\\Program Files (x86)\` | All users (read-only for standard users) | Core program executables (\`.exe\`, \`.dll\`) and static assets | **No.** Always use Windows Settings / Uninstall instead. |
| **ProgramData** | \`C:\\ProgramData\` (\`%ProgramData%\`) | All users (shared machine data) | Shared caches, installer packages, antivirus data, system databases | **Selectively.** Only specific caches and orphaned folders. |
| **AppData** | \`C:\\Users\\<You>\\AppData\` (\`%AppData%\`, \`%LocalAppData%\`) | Single user account | User preferences, browser caches, Discord/Slack caches, crash dumps, per-user apps | **Selectively.** Caches and uninstalled leftovers are usually safe. |

*(Looking to clean user-level caches and uninstalled app folders too? See our dedicated guide on [cleaning AppData and ProgramData leftovers safely](/blog/clean-appdata-programdata-leftovers-windows).)*

---

## How to Open \`%ProgramData%\` in Windows 10 & 11

Since \`C:\\ProgramData\` is hidden by default, you can jump straight to it in seconds using any of these methods:

* **Run Dialog (Fastest):** Press \`Win + R\`, type \`%ProgramData%\`, and press **Enter**.
* **File Explorer Address Bar:** Click the address bar, type \`%ProgramData%\`, and press **Enter**.
* **PowerShell:** Run \`explorer $env:ProgramData\` (or \`cd $env:ProgramData\`).
* **Show Hidden Items Permanently:** In Windows 11 File Explorer, click **View → Show → Hidden items** and navigate to \`C:\\\`.

### Finding What’s Actually Using Space Inside \`C:\\ProgramData\`

File Explorer won't show folder sizes, which makes hunting down a 20 GB bloat folder inside \`C:\\ProgramData\` slow and frustrating.

Before deleting anything, run a quick visual scan of \`C:\\ProgramData\` with a disk space analyzer. If you use **[ScanMyDisk](/windows)**, it reads hidden system directories locally (100% offline, no cloud uploads) and maps \`C:\\ProgramData\` across interactive views like Treemap and Sunburst so the exact multi-gigabyte subfolder stands out immediately. Even better, anything you decide to clean goes through the **Cleanup Queue into the Recycle Bin** first, so you can restore files if an app complains.

---

## \`C:\\ProgramData\` Subfolder Safety Reference (What You Can & Cannot Delete)

Below are the most common large folders inside \`C:\\ProgramData\`, ranked by whether they are safe to delete manually, require a built-in cleanup tool, or must be left alone.

### Quick-Reference Cheat Sheet

| Subfolder Inside \`C:\\ProgramData\` | Can You Delete It Manually? | Recommended Action |
| :--- | :--- | :--- |
| \`Package Cache\` | **No** (risky) | Uninstall old SDKs/Visual Studio workloads or disable cache via VS Installer |
| \`Microsoft\\Windows\\USOPrivate\` | **No** | Use Windows Disk Cleanup (*Windows Update Cleanup*) |
| \`Microsoft\\Windows\\Containers\` | **No** | Run \`docker system prune\` or disable Windows Containers/Sandbox |
| \`Microsoft\\Search\\Data\\Applications\\Windows\` | **Not directly** | Rebuild the Search Index via *Indexing Options* |
| \`Microsoft\\ClickToRun\` | **No** (if Office is installed) | Leave alone unless Microsoft Office is fully uninstalled |
| \`Microsoft\\Windows\\AppRepository\\StateRepository\` | **Never** | Do not touch — breaks Start Menu, Settings, and Microsoft Store |
| \`Microsoft\\Windows\\WER\` | **Yes** | Safe to delete contents or clear via Disk Cleanup |
| \`NVIDIA Corporation\\Downloader\` / OEM Driver Caches | **Yes (installers only)** | Safe to delete old downloaded driver packages |
| \`Adobe\\ARM\` | **Yes (old updates only)** | Safe to delete cached \`.msi\`/\`.msp\` update installers |
| \`TemporaryInstaller\` & Uninstalled Vendor Folders | **Yes (verify first)** | Safe if the parent program is no longer installed |

---

### 1. \`C:\\ProgramData\\Package Cache\` — **Caution (Do Not Blindly Delete)**

**Typical size:** 2 GB – 25+ GB  
**What it is:** A cache of \`.msi\`, \`.msp\`, and \`.exe\` installer payloads created by **Visual Studio**, **.NET SDKs**, **Windows SDKs**, and apps built with the WiX Burn installer framework.

**Why you shouldn't just hit Delete:**  
Windows Installer relies on \`Package Cache\` to **repair, update, and uninstall** those programs. If you manually delete \`C:\\ProgramData\\Package Cache\`, you may hit "missing source" errors the next time you try to update or uninstall Visual Studio or a .NET runtime.

**The safe ways to shrink it:**
1. **Uninstall unused workloads & old SDKs** via **Visual Studio Installer** and **Settings → Apps → Installed apps**.
2. **Disable caching in Visual Studio Installer** (reduces future growth and trims cached packages):
   Open an elevated Command Prompt and run:
   \`\`\`cmd
   "%ProgramFiles(x86)%\\Microsoft Visual Studio\\Installer\\setup.exe" modify --nocache --installPath "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community"
   \`\`\`
   *(Adjust the edition/year path to match your Visual Studio installation.)*
3. **Move the cache to a secondary drive** only if you are comfortable creating an NTFS directory junction (\`mklink /J\`) while no installers are running.

*(If Visual Studio, Gradle, or \`node_modules\` are eating your drive, check out our full [Windows developer cache cleanup guide](/blog/clean-developer-caches-node-modules-gradle-visual-studio-windows).)*

---

### 2. \`C:\\ProgramData\\Microsoft\\Windows\\USOPrivate\` — **Do Not Manually Delete**

**Typical size:** 500 MB – 10+ GB  
**What it is:** **Update Session Orchestrator (USO)** private storage. Windows 10 and Windows 11 use this folder to stage, track, and verify Windows Update downloads.

**The safe way to clean it:**
1. Press \`Win + S\`, search for **Disk Cleanup**, and click **Run as administrator**.
2. Select your \`C:\` drive and click **Clean up system files** (if prompted).
3. Check **Windows Update Cleanup** and **Delivery Optimization Files**, then click **OK**.

If \`USOPrivate\` is still bloated because of a stuck update, stop the update services before clearing Windows Update temp files (\`SoftwareDistribution\\Download\`), then restart them:
\`\`\`powershell
net stop wuauserv
net stop usosvc
net stop bits
\`\`\`
Restart your PC afterward so Windows recreates clean update metadata automatically.

---

### 3. \`C:\\ProgramData\\Microsoft\\Windows\\Containers\` (and \`Layers\`) — **Do Not Manually Delete**

**Typical size:** 5 GB – 60+ GB  
**What it is:** Image layers and virtual container storage used by **Windows Containers**, **Docker Desktop (Windows container mode)**, and **Windows Sandbox**.

**Why manual deletion fails:**  
Folders inside \`Containers\\Layers\` use special NTFS reparse points and strict \`SYSTEM\` permissions. Manually deleting them often fails with "Access Denied" errors or leaves behind corrupted container states.

**The safe way to clean it:**
* If you use Docker in Windows container mode, run:
  \`\`\`powershell
  docker system prune -a --volumes
  \`\`\`
* If you no longer use Windows Containers or Windows Sandbox, open **Turn Windows features on or off** (\`optionalfeatures.exe\`), uncheck **Containers** and **Windows Sandbox**, and reboot. Windows will safely dismantle the container storage.

*(Using Docker with WSL2 instead? Most of your bloat is likely inside \`ext4.vhdx\` or \`docker_data.vhdx\` rather than \`ProgramData\` — here’s [how to safely shrink Docker and WSL2 virtual disks on Windows](/blog/shrink-docker-wsl2-ext4-vhdx-windows).)*

---

### 4. \`C:\\ProgramData\\Microsoft\\Search\\Data\\Applications\\Windows\` — **Rebuild, Don't Raw-Delete**

**Typical size:** 1 GB – 30+ GB  
**What it is:** The Windows Search Index database (\`Windows.edb\` on Windows 10 / \`Windows.db\` on Windows 11). Over months or years, this database can grow massively and fail to shrink even after you delete indexed files.

**The safe way to shrink it:**
1. Press \`Win + S\` and open **Indexing Options**.
2. Click **Advanced** (requires admin privileges).
3. Under Troubleshooting, click **Rebuild**.
4. *(Optional)* Click **Modify** to exclude huge folders you don't need indexed (like build directories, Steam libraries, or backup folders).

Rebuilding wipes the bloated index cleanly and creates a compact fresh database in the background.

---

### 5. \`C:\\ProgramData\\Microsoft\\ClickToRun\` — **Keep If Microsoft Office Is Installed**

**Typical size:** 500 MB – 4 GB  
**What it is:** The streaming and update engine cache for **Microsoft 365** and modern standalone Office versions.

* **If Office / Microsoft 365 is installed:** Leave it alone. Deleting it can break Office repairs and automatic updates.
* **If you uninstalled Office completely:** Leftover files inside \`ClickToRun\` are safe to remove (or run Microsoft's official Office uninstall troubleshooter to clean them cleanly).

---

### 6. \`C:\\ProgramData\\Microsoft\\Windows\\AppRepository\\StateRepository\` — **Never Delete**

**Typical size:** 100 MB – 1 GB  
**What it is:** Core SQLite system databases tracking every provisioned and installed Microsoft Store (UWP/MSIX) app, including system components like the Start Menu, Settings, and Shell Experience.

Even if you deprovisioned built-in Microsoft Store apps, **do not delete or manually edit \`StateRepository\` files.** Windows maintains and compacts these databases automatically; deleting them can leave your user profile unable to open the Start Menu or Settings.

---

### 7. \`C:\\ProgramData\\Microsoft\\Windows\\WER\` — **Safe to Clean**

**Typical size:** 50 MB – 5+ GB  
**What it is:** **Windows Error Reporting** crash logs and diagnostic dumps (\`ReportArchive\` and \`ReportQueue\`).

**Safe to clean:** Delete the contents of \`ReportArchive\` and \`ReportQueue\`, or clear them automatically via **Settings → System → Storage → Temporary files → Windows error reports**.

---

### 8. GPU & Hardware Driver Caches (\`NVIDIA Corporation\\Downloader\`, \`AMD\`, \`Dell\`, \`Lenovo\`) — **Safe to Clean Old Installers**

**Typical size:** 1 GB – 10+ GB  
**What it is:** Driver update utilities (NVIDIA App / GeForce Experience, Dell SupportAssist, Lenovo Vantage) download full installer packages into \`C:\\ProgramData\` and frequently forget to clean up older versions.

* **Safe to delete:** Old downloaded installer packages inside folders like \`C:\\ProgramData\\NVIDIA Corporation\\Downloader\` (hex-named subfolders containing old \`.exe\` installers).
* **Do not delete:** Active configuration folders or driver store files (\`C:\\Windows\\System32\\DriverStore\`).

*(Note: Seeing a \`ProgramData\` folder suddenly appear on a brand-new secondary SSD? Tools like Lenovo Vantage, Steam, or Windows System Volume Information sometimes create empty or small config directories on newly formatted drives. Check if it's empty before deleting.)*

---

### 9. \`C:\\ProgramData\\Adobe\\ARM\` — **Safe to Clean Cached Updates**

**Typical size:** 500 MB – 4 GB  
**What it is:** **Adobe Reader and Acrobat Manager (ARM)** stores downloaded \`.msi\` and \`.msp\` update installers here so Acrobat/Reader can patch itself.

**Can you clean it without uninstalling Adobe?**  
**Yes.** Deleting the cached installer subfolders inside \`C:\\ProgramData\\Adobe\\ARM\` will **not** uninstall Adobe Acrobat or Reader. Your app will continue working normally, and if it ever needs an update later, it will simply download the latest patch.

---

### 10. \`C:\\ProgramData\\TemporaryInstaller\` & Leftover App Folders — **Safe If the App Is Uninstalled**

Over time, \`C:\\ProgramData\` collects abandoned folders from software you uninstalled months or years ago — old antivirus scanners (like leftover McAfee \`ScannerData\` folders), uninstalled game launchers, iTunes \`iPhone Temporary Files\`, old \`.NET\` agents, or interrupted \`TemporaryInstaller\` directories.

**How to verify before deleting a third-party folder:**
1. Check **Settings → Apps → Installed apps** to confirm the software is truly gone.
2. Press \`Win + R\`, run \`services.msc\`, and confirm no active Windows Service references that vendor or folder.
3. **Never Shift+Delete first.** Send the folder to the **Recycle Bin** (or rename it temporarily by adding \`_old\` to the folder name), reboot, and use your PC normally for a few days. If nothing breaks, empty the Recycle Bin.

---

## Step-by-Step: The Safest Way to Reduce \`C:\\ProgramData\` Size

If you want maximum space back with zero risk of breaking Windows, follow this exact order:

1. **Run Disk Cleanup as Administrator** → Check *Windows Update Cleanup*, *Windows Error Reporting*, and *Delivery Optimization Files*.
2. **Run a visual scan of \`C:\\ProgramData\`** → Open [ScanMyDisk](/windows) and scan your \`C:\` drive so you can see the exact top 5 largest subfolders inside \`C:\\ProgramData\` in seconds instead of clicking through hundreds of hidden folders.
3. **Clean the safe caches first** → \`WER\`, old \`NVIDIA Corporation\\Downloader\` installers, \`Adobe\\ARM\` update caches, and confirmed uninstalled-app leftovers.
4. **Use built-in tools for system databases** → Rebuild the Windows Search Index via *Indexing Options*, prune Containers via Docker, and trim \`Package Cache\` through Visual Studio Installer.
5. **Use a Reversible Safety Net** → Move manual deletions to the Recycle Bin first (ScanMyDisk's **Cleanup Queue** enforces this automatically) and wait 48–72 hours before permanently emptying it.

*(Still low on disk space even after trimming \`ProgramData\`? Follow our full [Windows 11 C: Drive Full Cleanup Guide](/blog/c-drive-full-windows-11-cleanup-guide) to track down hibernation files, shadow copies, and massive user caches.)*

---

## Frequently Asked Questions

### Can I delete the entire \`C:\\ProgramData\` folder?
No. Deleting \`C:\\ProgramData\` will break Windows Update, Microsoft Store apps, antivirus software, licenses, and dozens of installed desktop applications. Only clean specific verified cache folders or confirmed leftovers from uninstalled programs.

### Why is \`C:\\ProgramData\` hidden in Windows 11?
Microsoft hides \`C:\\ProgramData\` by default so users don't accidentally delete shared application databases or system files required by Windows services. You can access it anytime by pressing \`Win + R\` and typing \`%ProgramData%\`.

### Is \`C:\\ProgramData\\Package Cache\` safe to delete?
Not manually. Deleting \`Package Cache\` directly can prevent Visual Studio, .NET SDKs, and MSI-based programs from updating, repairing, or uninstalling cleanly. Instead, uninstall unused workloads/SDKs through Visual Studio Installer or run Visual Studio Installer with the \`--nocache\` flag.

### How do I clean \`C:\\ProgramData\` safely without breaking apps?
Start with built-in tools (Disk Cleanup as Administrator and Indexing Options Rebuild), then inspect the largest remaining folders with a disk space analyzer like [ScanMyDisk](/windows). Delete only verified caches (\`WER\`, old driver/Adobe installers) or folders belonging to uninstalled software — and always route deletions through the Recycle Bin first rather than permanently deleting them.

---
`;
