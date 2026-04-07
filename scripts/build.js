const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT, "templates", "policy.template.html");
const OUT_DIR = ROOT;
const BASE_URL =
  "https://supportwasteless-hub.github.io/Wasteless.privacy-policy.github.io";

const DOCS = [
  {
    key: "privacy",
    inputPrefix: "privacy",
    routeByLang: {
      fr: "/fr/",
      en: "/en/"
    },
    defaultRoute: "/"
  },
  {
    key: "terms",
    inputPrefix: "terms",
    routeByLang: {
      fr: "/fr/terms/",
      en: "/en/terms/"
    },
    defaultRoute: "/terms/"
  },
  {
    key: "delete-account",
    inputPrefix: "delete-account",
    routeByLang: {
      fr: "/fr/delete-account/",
      en: "/en/delete-account/"
    },
    defaultRoute: "/delete-account/"
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTocItems(sections) {
  return sections
    .map((s) => `<li><a href="#${escapeHtml(s.id)}">${escapeHtml(s.title)}</a></li>`)
    .join("\n          ");
}

function renderSections(sections) {
  return sections
    .map((section) => {
      const paragraphs = (section.paragraphs || [])
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("\n");
      const bullets = (section.bullets || []).length
        ? `<ul>\n${section.bullets
            .map((item) => `  <li>${escapeHtml(item)}</li>`)
            .join("\n")}\n</ul>`
        : "";

      return `<section id="${escapeHtml(section.id)}">\n<h3>${escapeHtml(section.title)}</h3>\n${paragraphs}\n${bullets}\n</section>`;
    })
    .join("\n\n");
}

function replaceTokens(template, tokens) {
  let out = template;
  for (const [key, value] of Object.entries(tokens)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function buildLangDoc(lang, doc) {
  const jsonPath = path.join(ROOT, "i18n", `${doc.inputPrefix}.${lang}.json`);
  const raw = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);

  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const frRoute = doc.routeByLang.fr;
  const enRoute = doc.routeByLang.en;
  const canonicalUrl = `${BASE_URL}${doc.routeByLang[lang]}`;
  const tokens = {
    LANG: data.lang,
    TITLE: escapeHtml(data.title),
    DESCRIPTION: escapeHtml(data.description),
    INTRO: escapeHtml(data.intro),
    LABEL_LAST_UPDATED: escapeHtml(data.labelLastUpdated),
    LABEL_EFFECTIVE_DATE: escapeHtml(data.labelEffectiveDate),
    LAST_UPDATED: escapeHtml(data.lastUpdated),
    EFFECTIVE_DATE: escapeHtml(data.effectiveDate),
    TOC_TITLE: escapeHtml(data.tocTitle),
    TOC_ITEMS: renderTocItems(data.sections),
    SECTIONS_HTML: renderSections(data.sections),
    FOOTNOTE: escapeHtml(data.footnote),
    CANONICAL_URL: canonicalUrl,
    ALT_FR_URL: `${BASE_URL}${frRoute}`,
    ALT_EN_URL: `${BASE_URL}${enRoute}`,
    DEFAULT_URL: `${BASE_URL}${doc.defaultRoute}`,
    FR_CURRENT_ATTR: lang === "fr" ? 'aria-current="true"' : "",
    EN_CURRENT_ATTR: lang === "en" ? 'aria-current="true"' : ""
  };

  const html = replaceTokens(template, tokens);
  const outRoute = doc.routeByLang[lang];
  const outDir = outRoute.replace(/^\//, "").replace(/\/$/, "");
  const dir = path.join(OUT_DIR, outDir);
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log(`Built ${outDir}/index.html`);
}

function main() {
  for (const doc of DOCS) {
    buildLangDoc("fr", doc);
    buildLangDoc("en", doc);
  }
}

main();
