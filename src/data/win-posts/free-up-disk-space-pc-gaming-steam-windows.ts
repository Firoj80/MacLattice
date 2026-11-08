export const gameDiskCleanupBody = `Modern PC games are storage monsters. In 2026, titles like *Call of Duty: Warzone*, *Ark: Survival Ascended*, *Baldur's Gate 3*, and *Star Wars Jedi: Survivor* regularly demand between **100 GB and 250 GB each**. 

If you have a 1 TB or 2 TB NVMe SSD, 5 or 6 AAA games along with Windows itself will completely max out your drive. Even worse, uninstalling games through Steam, Epic Games Launcher, or Xbox Game Pass often leaves behind **tens of gigabytes of orphaned shader caches, downloaded patch archives, crash dumps, and uncompressed community mods**.

Here is how to safely reclaim 50–150 GB of gaming SSD storage on Windows 10 & 11 without losing your save games or reinstalling your library.

---

## Where Hidden Gaming Storage Bloat Hides on Windows

\`\`\`mermaid
flowchart LR
    A["Gaming SSD Bloat"] --> B["Steam Workshop Mods (~10–40 GB)"]
    A --> C["DirectX & GPU Shader Caches (~5–20 GB)"]
    A --> D["Uninstalled Game Leftovers in AppData (~10–30 GB)"]
    A --> E["Launcher Download Staging (~5–15 GB)"]
\`\`\`

When you click "Uninstall" in your game client, Windows does not clean up everything. The launcher typically only deletes the files registered in its manifest. Here is where the rest hides:

---

## 1. Steam Workshop Mods for Uninstalled Games (~10–40 GB)

When you unsubscribe from a mod or uninstall a mod-heavy game (such as *Cities: Skylines*, *Garry's Mod*, *Arma 3*, or *Civilization VI*), Steam frequently keeps downloaded workshop content inside:

\`\`\`text
C:\\Program Files (x86)\\Steam\\steamapps\\workshop\\content\\
\`\`\`

Inside that folder, each subfolder is named after the Steam **AppID** (e.g. \`255710\` for Cities: Skylines). If the game is already uninstalled, that folder is pure dead weight.

**How to find it:** Open [Scan My Disk](/), scan your Steam library drive, and switch to the **Sunburst** or **Folders** view. Navigate to \`steamapps\\workshop\\content\` to immediately see which games are hoarding 20+ GB in orphaned mods.

---

## 2. GPU Shader Pre-Caching & DirectX Shader Cache (~5–20 GB)

To prevent stuttering during gameplay, both Windows and your GPU driver compile shaders and store them on your C: drive:

- **DirectX Shader Cache:** Stored in \`%LocalAppData%\\D3DSCache\` and managed by Windows.
- **NVIDIA Shader Cache:** \`%LocalAppData%\\NVIDIA\\DXCache\` and \`%LocalAppData%\\NVIDIA\\GLCache\`
- **AMD Shader Cache:** \`%LocalAppData%\\AMD\\DxCache\`
- **Steam Shader Pre-Caching:** \`steamapps\\shadercache\\\`

Over time, shaders for games you haven't played in months or uninstalled entirely remain cached indefinitely.

**How to safely clean it:**
1. Open Windows Search → type **Disk Cleanup** → Run as Administrator.
2. Select your C: drive.
3. Check **DirectX Shader Cache** and click OK. Windows will flush outdated compiled shaders safely. (Active games will recompile fresh shaders as needed without stuttering).

---

## 3. Orphaned Game Saves & Logs in AppData & Documents (~10–30 GB)

Many Unreal Engine 4 and 5 titles write gigabytes of crash dumps, high-resolution telemetry, and intermediate logs to:

\`\`\`text
C:\\Users\\<Username>\\AppData\\Local\\<GameName>\\Saved\\Crashes\\
C:\\Users\\<Username>\\AppData\\Local\\<GameName>\\Saved\\Logs\\
\`\`\`

It is not uncommon to find 15 GB of uncompressed \`.dmp\` crash reports for games you beat a year ago.

**How to safely clean it:** ScanMyDisk's **App Uninstaller & Leftovers Cleaner** identifies orphaned folders in \`AppData\\Local\` and \`AppData\\Roaming\` that no longer correspond to active registered software. You can review the folder contents and stage them for the Windows Recycle Bin with one click.

---

## 4. Steam \`downloading\` and \`temp\` Staging Folders (~5–15 GB)

When a Steam update gets interrupted or fails to unpack properly, chunks of uncompressed data remain stuck in:

\`\`\`text
C:\\Program Files (x86)\\Steam\\steamapps\\downloading\\
C:\\Program Files (x86)\\Steam\\steamapps\\temp\\
\`\`\`

If no game is currently downloading or updating in your Steam client, these folders should be completely empty. If you see 10 GB inside \`downloading\`, it is stuck corrupted staging data.

---

## Side-by-Side Comparison: Reclaiming Game Storage Manually vs Scan My Disk

| Task | Manual Explorer Spelunking | With Scan My Disk ($5 Lifetime) |
|---|---|---|
| Spot 100 GB game installs | Click through each launcher library | **Treemap / Sunburst** instantly highlights massive folders |
| Find forgotten old games | Check Steam, Epic, Battle.net, GOG, Xbox app separately | **Age Map** highlights games untouched for > 6 months |
| Identify orphaned mod folders | Cross-reference numeric AppIDs on SteamDB | Visual folder sizes in \`steamapps\\workshop\` |
| Delete uninstalled AppData junk | Browse hidden \`%LocalAppData%\` manually | Built-in **AppData Leftovers Cleaner** |
| Check disk space before/after | Calculate manually in drive properties | **Scan Snapshots** diff view shows exact reclaimed GB |
| Safety | Easy to accidentally delete active saves | Staged in **Cleanup Queue** → native Windows Recycle Bin |

[**Get Scan My Disk for Windows →**](/buy)

---

## How to Move Games to a Secondary SSD Without Reinstalling

If your C: drive SSD is dangerously full but you don't want to delete your games, move them to a secondary \`D:\` or external NVMe drive:

- **Steam:** Settings → Storage → Select Drive → Check games → Click **Move**.
- **Epic Games:** Settings → Downloads → Move install folder, or initiate download on new drive and verify existing files.
- **Xbox App (PC Game Pass):** Right-click game → Manage → Files → Change Drive.

---

## Frequently Asked Questions

### Will cleaning shader caches make my games run slower?
When you first launch a game after clearing shader caches, it may take an extra 30–60 seconds on the loading screen while it recompiles current shaders. In-game FPS will not be reduced, and it prevents corrupt shader cache bugs.

### Can I delete the \`steamapps\\common\` folder?
**No.** \`steamapps\\common\` is where your actual installed Steam games live. Only delete individual game subfolders if you want to uninstall that specific game, or better yet, uninstall it through the Steam client interface.

### Is Scan My Disk compatible with Windows 11 and Windows 10?
Yes. Scan My Disk runs natively on 64-bit Windows 10 and Windows 11, operates 100% offline with zero telemetry, and costs a **one-time $5 lifetime payment**.
`;
