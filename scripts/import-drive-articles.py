#!/usr/bin/env python3
"""Convert the Scan My Disk Drive articles into blog post modules."""
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
OUT = Path("/workspace/src/data/win-posts")

POSTS = [
    {
        "n": 1,
        "slug": "clean-appdata-programdata-leftovers-windows",
        "title": "How to Safely Clean AppData and ProgramData Leftovers on Windows 10 & 11",
        "seoTitle": "How to Safely Clean AppData & ProgramData Leftovers on Windows 10/11 (2026)",
        "description": "Running out of C: drive space? Learn which folders inside AppData and ProgramData are safe to delete on Windows 10 & 11, and how Scan My Disk removes leftover app junk for $5.",
        "tags": ["Windows", "AppData", "Cleanup"],
        "export": "appDataBody",
        "images": {
            "How to Clean AppData": [
                ("Scan My Disk Applications tab, with an installed app selected and an Uninstall button", "/blog/review/applications.jpg"),
                ("Treemap view showing which Windows folders use the most space", "/blog/review/treemap.jpg"),
            ],
            "Step-by-Step Manual": [
                ("Folders view of a Windows scan, listing the largest directories", "/blog/review/folders.jpg"),
            ],
        },
    },
    {
        "n": 2,
        "slug": "shrink-docker-wsl2-ext4-vhdx-windows",
        "title": "Why Docker Desktop and WSL2 Eat 100GB+ on Windows (And How to Shrink ext4.vhdx Safely)",
        "seoTitle": "Why Docker Desktop & WSL2 Eat 100GB+ on Windows (How to Shrink ext4.vhdx)",
        "description": "Deleted Docker images on Windows 10/11 but didn't get your C: drive space back? Learn how to locate and compact bloated WSL2 ext4.vhdx virtual disks safely.",
        "tags": ["Windows", "Docker", "WSL"],
        "export": "dockerVhdxBody",
        "images": {
            "Where Windows": [
                ("Top Sizes view listing the largest files on a Windows drive", "/blog/review/top-sizes.jpg"),
                ("Treemap view of a Windows system folder scan", "/blog/review/treemap.jpg"),
            ],
            "Track & Clean VHDX": [
                ("Snapshots comparison showing which folder grew between two scans", "/blog/review/snapshots.jpg"),
            ],
        },
    },
    {
        "n": 3,
        "slug": "clean-developer-caches-node-modules-gradle-visual-studio-windows",
        "title": "The Developer's Windows Disk Cleanup Guide: Reclaim 50GB+ from node_modules, Gradle & Visual Studio Caches",
        "seoTitle": "Windows Developer Disk Cleanup: Reclaim 50GB+ from node_modules, Gradle & VS",
        "description": "Out of SSD space on your Windows dev machine? Learn how to find and purge dormant node_modules folders, Android Gradle caches, and Visual Studio build artifacts safely.",
        "tags": ["Windows", "Developer", "Cleanup"],
        "export": "devCachesBody",
        "images": {
            "5 Biggest Developer": [
                ("Folders view showing the largest directories in a Windows scan", "/blog/review/folders.jpg"),
                ("Top Sizes view of the largest files, with Stage buttons", "/blog/review/top-sizes.jpg"),
            ],
            "Why Developers Use Scan My Disk": [
                ("Age Map grouping files by when they were last modified", "/blog/review/age-map.jpg"),
            ],
        },
    },
    {
        "n": 4,
        "slug": "find-delete-duplicate-files-windows-content-hashing",
        "title": "How to Find and Delete Duplicate Files on Windows 10 & 11 Using 3-Pass Content Hashing",
        "seoTitle": "How to Find & Delete Duplicate Files on Windows 10/11 (3-Pass Content Hashing)",
        "description": "Don't trust filename-only duplicate cleaners. Learn how 3-pass content hashing finds true byte-for-byte duplicate files on Windows 10 & 11 and how Scan My Disk removes them safely.",
        "tags": ["Windows", "Duplicates", "Cleanup"],
        "export": "duplicatesBody",
        "images": {
            "Why Filename Matching": [
                ("Duplicates tab showing identical files and the space they would free", "/blog/review/duplicates.jpg"),
            ],
        },
    },
    {
        "n": 5,
        "slug": "best-windows-disk-space-analyzers-windirstat-wiztree-treesize",
        "title": "Best Windows Disk Space Analyzers in 2026: Scan My Disk vs. WinDirStat, WizTree & TreeSize",
        "seoTitle": "Best Windows Disk Space Analyzers (2026): Scan My Disk vs WinDirStat, WizTree & TreeSize",
        "description": "Comparing the best Windows 10 & 11 disk space analyzers in 2026. See how Scan My Disk's 8 visual maps, 3-pass duplicate finder, and $5 lifetime license stack up against WinDirStat, WizTree, and TreeSize.",
        "tags": ["Windows", "Comparison", "Disk Analyzer"],
        "export": "analyzersBody",
        "images": {
            "1. Scan My Disk": [
                ("Treemap view of a Windows scan in Scan My Disk", "/blog/review/treemap.jpg"),
                ("Sunburst view of the same Windows scan", "/blog/review/sunburst.jpg"),
                ("Flame view of the same Windows scan", "/blog/review/flame.jpg"),
                ("Bubbles view of the same Windows scan", "/blog/review/bubbles.jpg"),
                ("Mind Map view of the same Windows scan", "/blog/review/mind-map.jpg"),
                ("Folders view of the same Windows scan", "/blog/review/folders.jpg"),
                ("Top Sizes view of the largest files", "/blog/review/top-sizes.jpg"),
                ("Age Map grouping files by last modified date", "/blog/review/age-map.jpg"),
            ],
        },
    },
]


def qn(tag):
    return f"{W}{tag}"


def text_of(node):
    return "".join(t.text or "" for t in node.iter(qn("t")))


def list_formats(z):
    root = ET.fromstring(z.read("word/numbering.xml"))
    abstract = {}
    for an in root.findall(qn("abstractNum")):
        aid = an.get(qn("abstractNumId"))
        fmt = {}
        for lvl in an.findall(qn("lvl")):
            ilvl = lvl.get(qn("ilvl"))
            numFmt = lvl.find(qn("numFmt"))
            fmt[ilvl] = numFmt.get(qn("val")) if numFmt is not None else "bullet"
        abstract[aid] = fmt
    out = {}
    for num in root.findall(qn("num")):
        nid = num.get(qn("numId"))
        abs_el = num.find(qn("abstractNumId"))
        if abs_el is None:
            continue
        out[nid] = abstract.get(abs_el.get(qn("val")), {})
    return out


def rels(z):
    root = ET.fromstring(z.read("word/_rels/document.xml.rels"))
    return {rel.get("Id"): rel.get("Target") for rel in root}


def is_on(el):
    if el is None:
        return False
    val = el.get(qn("val"))
    return val not in ("0", "false")


def run_text(r):
    parts = []
    for child in r:
        name = child.tag.split("}")[-1]
        if name == "t":
            parts.append(child.text or "")
        elif name == "tab":
            parts.append(" ")
        elif name == "br":
            parts.append("\n")
    text = "".join(parts)
    if not text:
        return "", False, False
    rpr = r.find(qn("rPr"))
    mono = False
    bold = False
    if rpr is not None:
        fonts = rpr.find(qn("rFonts"))
        if fonts is not None and "Mono" in (fonts.get(qn("ascii")) or ""):
            mono = True
        bold = is_on(rpr.find(qn("b")))
    return text, mono, bold


def inline_from(node, links):
    chunks = []
    mono_chars = 0
    total = 0
    for child in node:
        name = child.tag.split("}")[-1]
        if name == "hyperlink":
            rid = child.get(f"{R}id")
            href = links.get(rid, "")
            label = text_of(child).replace("[", "(").replace("]", ")")
            if href and label:
                chunks.append((label, False, False, href))
                total += len(label)
        elif name == "r":
            text, mono, bold = run_text(child)
            if text:
                chunks.append((text, mono, bold, None))
                total += len(text)
                if mono:
                    mono_chars += len(text)
    return chunks, mono_chars, total


def label_escape(text):
    return text.replace("[", "(").replace("]", ")")


def render_chunks(chunks, escape_pipes=False):
    out = []
    for text, mono, bold, href in chunks:
        if escape_pipes:
            text = text.replace("|", "/")
        if href:
            href = href.replace("https://www.scanmydisk.com/license", "/buy")
            href = href.replace("https://www.scanmydisk.com", "")
            if not href:
                href = "/"
            piece = f"[{label_escape(text)}]({href})"
        else:
            piece = text
            if mono:
                piece = f"`{piece.replace('`', '')}`"
            elif bold:
                piece = f"**{piece}**"
        out.append(piece)
    return "".join(out).strip()


def norm_heading(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    return text.replace("`", "").lower()


def attach_images(plain, meta):
    found = []
    hay = norm_heading(plain)
    for key, images in meta["images"].items():
        if key.lower() in hay:
            found.extend(images)
    return found


def is_code_cont(block):
    if block.startswith(("#", "!", "- ", "| ")):
        return False
    s = block.strip()
    if s.startswith("While ") or (". " in s and "$" not in s and "|" not in s and "{" not in s and len(s) > 70):
        return False
    return any(tok in s for tok in ("$_", "$", "|", "{", "}", "SizeGB", "Folder =", "Get-", "ForEach", "Sort-", "Select-", "Format-", "Write-Host", "Measure-Object", "PSCustomObject", "Round("))


def fold_code(blocks):
    folded = []
    for block in blocks:
        if folded and folded[-1].startswith("```") and block.startswith("```"):
            inner = block.strip()[block.find("\n") + 1:].rsplit("```", 1)[0]
            folded[-1] = folded[-1][:-4].rstrip() + "\n" + inner.strip() + "\n```"
            continue
        if folded and folded[-1].startswith("```") and is_code_cont(block):
            folded[-1] = folded[-1][:-4].rstrip() + "\n" + block.strip() + "\n```"
        else:
            folded.append(block)
    return folded


def split_shell(plain):
    tokens = ("$env:", "Get-ChildItem", "ForEach-Object", "Write-Host", "docker system", "wsl --", "Optimize-VHD", "diskpart")
    if sum(token in plain for token in tokens) < 2 and "$paths" not in plain:
        return None
    indexes = [plain.find(token) for token in ("$paths", "$env:", "Get-ChildItem", "docker system", "wsl --", "# Remove")]
    indexes = [i for i in indexes if i >= 0]
    if not indexes:
        return "", plain
    idx = min(indexes)
    if idx > 25 and " " in plain[:idx]:
        return plain[:idx].rstrip(": "), plain[idx:]
    return "", plain
    tokens = ("$env:", "Get-ChildItem", "ForEach-Object", "Write-Host", "docker system", "wsl --", "Optimize-VHD", "diskpart")
    if sum(token in plain for token in tokens) < 2 and "$paths" not in plain:
        return None
    indexes = [plain.find(token) for token in ("$paths", "$env:", "Get-ChildItem", "docker system", "wsl --", "# Remove")]
    indexes = [i for i in indexes if i >= 0]
    if not indexes:
        return "", plain
    idx = min(indexes)
    if idx > 25 and " " in plain[:idx]:
        return plain[:idx].rstrip(": "), plain[idx:]
    return "", plain


def label_escape(text):
    return text.replace("[", "(").replace("]", ")")


def cell_text(tc, links):
    lines = []
    for p in tc.findall(qn("p")):
        chunks, _, _ = inline_from(p, links)
        line = render_chunks(chunks, escape_pipes=True)
        if line:
            lines.append(line)
    return " ".join(lines)


def table_md(tbl, links):
    rows = []
    for tr in tbl.findall(qn("tr")):
        cells = [cell_text(tc, links) for tc in tr.findall(qn("tc"))]
        if any(cells):
            rows.append(cells)
    if not rows:
        return ""
    width = max(len(r) for r in rows)
    rows = [r + [""] * (width - len(r)) for r in rows]
    head = "| " + " | ".join(rows[0]) + " |"
    sep = "| " + " | ".join("---" for _ in rows[0]) + " |"
    body = ["| " + " | ".join(r) + " |" for r in rows[1:]]
    return "\n".join([head, sep, *body])


def convert(meta):
    z = zipfile.ZipFile(f"/workspace/artifacts/blogs/article-{meta['n']}.md")
    root = ET.fromstring(z.read("word/document.xml"))
    links = rels(z)
    formats = list_formats(z)
    body = root.find(qn("body"))
    titles_seen = 0
    started = False
    counters = {}
    blocks = []
    code_buf = []

    def flush_code():
        nonlocal code_buf
        if not code_buf:
            return
        code = "\n".join(code_buf).strip("\n")
        blocks.append(f"```powershell\n{code}\n```")
        code_buf = []

    for child in list(body):
        name = child.tag.split("}")[-1]
        if name == "tbl":
            if not started:
                continue
            flush_code()
            md = table_md(child, links)
            if md:
                blocks.append(md)
            continue
        if name != "p":
            continue
        style_el = child.find(f"{qn('pPr')}/{qn('pStyle')}")
        style = style_el.get(qn("val")) if style_el is not None else ""
        if style == "Title" and text_of(child).startswith("JSON-LD"):
            flush_code()
            break
        if not started:
            if style == "Title":
                titles_seen += 1
                if titles_seen >= 2:
                    started = True
            continue
        if style == "Title" and text_of(child).startswith("JSON-LD"):
            flush_code()
            break

        chunks, mono_chars, total = inline_from(child, links)
        plain = render_chunks(chunks)
        if not plain:
            if code_buf:
                code_buf.append("")
            continue
        shell = split_shell(plain) if style not in ("Heading1", "Heading2", "Title") else None
        if shell:
            flush_code()
            prose, code = shell
            if prose:
                blocks.append(prose)
            blocks.append(f"```powershell\n{code.strip()}\n```")
            continue
        raw_mono = "".join(text for text, mono, _bold, href in chunks if mono and not href)
        if total and mono_chars / max(total, 1) > 0.6 and len(raw_mono.strip()) > 30:
            code_buf.append(raw_mono)
            continue
        flush_code()

        num = child.find(f"{qn('pPr')}/{qn('numPr')}")
        if num is not None:
            ilvl = num.find(qn("ilvl"))
            nid = num.find(qn("numId"))
            level = ilvl.get(qn("val")) if ilvl is not None else "0"
            num_id = nid.get(qn("val")) if nid is not None else "0"
            fmt = formats.get(num_id, {}).get(level, "bullet")
            indent = "  " * int(level)
            if fmt == "decimal":
                counters[num_id] = counters.get(num_id, 0) + 1
                blocks.append(f"{indent}- {counters[num_id]}. {plain}")
            else:
                blocks.append(f"{indent}- {plain}")
            continue
        if style == "Heading1" or style == "Title":
            blocks.append(f"## {plain}")
            for alt, src in attach_images(plain, meta):
                blocks.append(f"![{alt}]({src})")
            continue
        if style == "Heading2":
            blocks.append(f"### {plain}")
            for alt, src in attach_images(plain, meta):
                blocks.append(f"![{alt}]({src})")
            continue
        blocks.append(plain)
    flush_code()
    blocks = fold_code(blocks)
    merged = []
    for block in blocks:
        if merged and block.startswith("- ") and merged[-1].startswith("- "):
            merged[-1] = merged[-1] + "\n" + block
        else:
            merged.append(block)
    md = "\n\n".join(merged).strip() + "\n"
    md = md.replace("https://www.scanmydisk.com/license", "/buy")
    cut = md.find("JSON-LD Structured Data")
    if cut != -1:
        md = re.sub(r"\n#+\s*$", "", md[:cut]).rstrip() + "\n"
    return md


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    index = []
    for meta in POSTS:
        md = convert(meta)
        path = OUT / f"{meta['slug']}.ts"
        path.write_text(
            f"export const {meta['export']} = {json.dumps(md, ensure_ascii=False)};\n",
            encoding="utf-8",
        )
        index.append(meta | {"chars": len(md)})
        print(meta["n"], meta["slug"], len(md), "images", md.count("!["))
    Path("/tmp/win-posts.json").write_text(json.dumps(index, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
