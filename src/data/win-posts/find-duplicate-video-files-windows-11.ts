export const duplicateVideosBody = `If you edit videos, download 4K/1080p footage, save screen recordings, or maintain an archive of video clips on Windows 10 or Windows 11, you already know the problem: **video files eat more SSD space than anything else.**

A single 10-minute 4K clip in ProRes or MP4 can easily chew through 5 GB to 30 GB. When you copy raw footage between folders, create test renders, export intermediate versions, or organize B-roll libraries, duplicate video files pile up fast. Before long, 100 GB+ of expensive NVMe storage is trapped in byte-identical duplicates with different filenames scattered across your drive.

This guide explains how to find and delete duplicate video files safely on Windows 10 & 11 without relying on risky filename-only cleaners.

---

## Why Filename-Based Duplicate Finders Fail on Videos

Most generic "duplicate file cleaners" look at two things:
1. File name (e.g. \`video.mp4\` vs \`video (1).mp4\`)
2. File size in bytes

This approach causes two major problems for video creators:

- **False Negatives:** You exported the exact same edit twice under names like \`Final_Cut_v1.mp4\` and \`Project_Client_Approved.mp4\`. Their filenames are completely different, so a basic tool ignores them.
- **False Positives & Disaster:** Two entirely different recordings might happen to have identical or default camera filenames (like \`MOV_0001.mp4\` from two different SD card dumps). Deleting one because the filename matched can destroy irrecoverable raw footage.

To safely delete duplicate video files, you need **content-based hashing**.

---

## How 3-Pass Content Hashing Works (and Why It's Fast on Large Video Files)

Hashing a 20 GB video file with SHA-256 can take 15–30 seconds if done naively from start to finish. When you have hundreds of video files, scanning them sequentially would take hours.

ScanMyDisk uses a high-performance **3-Pass verification pipeline** designed to eliminate non-duplicates instantly without reading entire files:

\`\`\`mermaid
flowchart TD
    A["All Files on Drive / Selected Folder"] --> B["Pass 1: File Size Filter"]
    B -->|"Different Size"| C["Discard Immediately (Zero Read)"]
    B -->|"Identical Exact Size"| D["Pass 2: CRC32 Quick Check (First 64 KB Header)"]
    D -->|"Different Header"| E["Discard (Fast Rejection)"]
    D -->|"Matching Header"| F["Pass 3: Full Cryptographic Hash (MD5 + SHA-256)"]
    F -->|"Identical Full Hash"| G["Confirmed Byte-for-Byte Duplicate Group"]
\`\`\`

1. **Pass 1 — Exact Byte Size Filter:** If File A is 4,294,967,296 bytes and File B is 4,294,967,290 bytes, they cannot be duplicates. No disk read is performed. 99% of files are eliminated here.
2. **Pass 2 — Header CRC32 Check:** For files with identical exact sizes, ScanMyDisk reads only the first 64 KB (where the video container metadata like MP4/MOV headers live). If headers differ, the file is rejected immediately without reading the rest of the gigabytes.
3. **Pass 3 — Full Cryptographic Hash:** Only candidates that survive Passes 1 and 2 are hashed fully using MD5 and SHA-256. If both full hashes match, the files are mathematically guaranteed to be byte-for-byte identical clones.

---

## How to Find and Remove Duplicate Videos with Scan My Disk

![Scan My Disk Duplicate File Review](/windows-features/duplicates.webp)

1. **Launch [Scan My Disk](/)** on your Windows 10 or Windows 11 machine.
2. **Select your video storage location** — either your entire \`D:\` or \`E:\` drive, or a specific folder like \`Videos\`, \`Footage\`, or \`Premiere Projects\`.
3. **Switch to the Duplicate Groups View:** ScanMyDisk groups confirmed duplicate videos together, showing the total reclaimable gigabytes at the top.
4. **Sort by Size:** Instantly surface the largest duplicate groups (e.g. duplicate 15 GB \`.mov\` or \`.mkv\` files).
5. **Review Before You Delete:** ScanMyDisk highlights the original file path and lets you preview file details, creation timestamps, and paths.
6. **Send to Cleanup Queue:** Staged files are moved safely to the native **Windows Recycle Bin**. Nothing is permanently destroyed behind your back.

[**Get Scan My Disk for Windows ($5 Lifetime) →**](/buy)

---

## Supported Video File Formats

ScanMyDisk's content hashing works at the filesystem block level regardless of container or codec:

- **Common Formats:** MP4, MOV, MKV, AVI, WMV, WEBM, M4V, FLV
- **Pro & Raw Codecs:** ProRes, DNxHD, Blackmagic RAW (\`.braw\`), RED RAW (\`.r3d\`), MXF, HEVC / H.265, AV1
- **Screen Recordings:** OBS studio \`.mkv\`/\`.mp4\` outputs, GeForce Experience highlights, Loom downloads

---

## 4 Pro Tips for Video Creators Managing Windows SSD Storage

### 1. Separate Proxies from Raw Camera Footage
If you generate editing proxies in Premiere Pro or DaVinci Resolve, keep them in a dedicated \`_proxies\` folder. Proxies can be regenerated anytime, but storing duplicates of proxies across multiple scratch disks wastes hundreds of gigabytes.

### 2. Check Adobe Media Encoder & DaVinci Auto-Exports
Editing software often exports draft revisions to the project root and then duplicates them to client delivery folders. Reviewing these quarterly with ScanMyDisk often recovers 50–100 GB in single sessions.

### 3. Clear Video Editing Scratch and Render Caches
In addition to duplicate files, your NLE (Non-Linear Editor) silently accumulates tens of gigabytes in cache folders:
- **Premiere Pro:** \`%AppData%\\Adobe\\Common\\Media Cache Files\`
- **DaVinci Resolve:** \`CacheClip\` and \`.gallery\` folders inside your project library disk
- **After Effects:** Disk cache allocated in Preferences → Media & Disk Cache

### 4. Always Verify in the Windows Recycle Bin
Never use tools that use \`Shift + Delete\` (permanent bypass) by default on media assets. ScanMyDisk always routes deleted duplicates to the native Windows Recycle Bin, giving you an undo safety net if you ever change your mind.

---

## Frequently Asked Questions

### Does deleting duplicate videos affect the original file?
No. In each duplicate group, ScanMyDisk retains one primary original file and only flags the redundant copies for removal. You have granular control over which specific paths to delete.

### Can ScanMyDisk find videos with different resolutions or bitrates?
No. ScanMyDisk uses byte-for-byte content hashing to find **true identical duplicates** (files with the exact same binary data). It does not perform perceptual video analysis (which compares visual similarity of different re-encoded videos). This ensures 100% precision with zero accidental deletions of compressed web versions vs high-res masters.

### Is ScanMyDisk a subscription?
No. ScanMyDisk is a **one-time $5 lifetime license** valid on Windows 10 & 11 with a 15-day refund guarantee.
`;
