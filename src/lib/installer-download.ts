/** Start once per verified checkout, keeping the manual link available as a fallback. */
export function startInstallerDownload(orderId: string, licenseKey: string, installerUrl: string) {
  if (!orderId || !licenseKey || new URL(installerUrl).protocol !== "https:") return;
  const marker = `smd-installer-download:${orderId}`;
  try {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "started");
  } catch { return; }
  const link = document.createElement("a");
  link.href = installerUrl;
  link.download = "ScanMyDisk-Setup-x64.exe";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
