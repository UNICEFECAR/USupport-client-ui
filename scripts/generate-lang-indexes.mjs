import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "..", "dist");
const localesDir = path.resolve(__dirname, "..", "src", "locales");

// Languages configured in website/src/i18n.js
const languages = ["hy", "en", "kk", "pl", "ro", "ru", "uk"];

async function main() {
  const indexPath = path.join(distDir, "index.html");
  let baseHtml;

  try {
    baseHtml = await readFile(indexPath, "utf8");
  } catch (err) {
    console.error(
      `Could not read ${indexPath}. Make sure you ran "vite build" first.`
    );
    process.exit(1);
  }

  for (const lang of languages) {
    const localePath = path.join(localesDir, `${lang}.json`);
    let description = "";
    let title = "";

    try {
      const localeRaw = await readFile(localePath, "utf8");
      const localeJson = JSON.parse(localeRaw);
      description = localeJson.meta?.description || "";
      title = localeJson.meta?.title || "";
    } catch (err) {
      console.warn(
        `Could not load meta from ${localePath}, skipping custom meta for ${lang}.`
      );
    }

    let html = baseHtml;

    // Replace <html lang="en"> with the correct language code for this copy
    html = html.replace('lang="en"', `lang="${lang}"`);

    // Replace the content of the existing meta description, if any
    if (description) {
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeHtml(description)}" />`
      );
    }

    // Replace the content of the existing title tag, if any
    if (title) {
      html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${escapeHtml(title)}</title>`
      );
    }

    const outDir = path.join(distDir, lang);
    await mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, "index.html");

    await writeFile(outPath, html, "utf8");
    // eslint-disable-next-line no-console
    console.log(`Generated ${path.relative(distDir, outPath)}`);
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
