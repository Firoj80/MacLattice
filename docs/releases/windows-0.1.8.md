# Scan My Disk for Windows 0.1.8

- New Inspector guidance explains deletion risk, potential impact and recommended action. Unknown/personal folders are not labelled junk; protected locations cannot be staged.
- Ranked cleanup suggestions identify old Temp files, recognized browser caches and rebuildable project files using path/project evidence. Estimates are reviewed scanned bytes, not guaranteed freed space. Nested candidates are not counted twice.
- Automatic cleanup supports daily/weekly schedules, 7/14/30-day age rules, previews and local history. Browser caches are optional; recent, locked, linked and changed files are skipped.
- Background cleanup is separately opt-in and requires a preview before enabling. It runs as the signed-in Windows user, checks at 09:00/after sign-in, waits for idle/AC power and never wakes the PC. App and worker cannot clean simultaneously.
- Optional completion notifications, fail-closed pause/disable behavior, and scheduled-task removal on uninstall.
- Files go to Windows Recycle Bin with no permanent-delete fallback. Actual disk space is freed when the bin is emptied.

Scheduling is OFF by default. Licenses and saved scans are retained. Historical
scans must be refreshed before manual cleanup. Duplicate savings require the
existing content-verification workflow. Image optimization is not in this release.
