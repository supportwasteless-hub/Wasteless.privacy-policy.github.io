# WasteLess Privacy Policy Site

Static multilingual legal pages for GitHub Pages.

## Structure

- `index.html`: privacy language redirect (`/fr/` or `/en/`)
- `terms/index.html`: terms language redirect (`/fr/terms/` or `/en/terms/`)
- `fr/index.html`: generated French privacy policy
- `en/index.html`: generated English privacy policy
- `fr/terms/index.html`: generated French terms of use
- `en/terms/index.html`: generated English terms of use
- `i18n/privacy.fr.json`: French source content
- `i18n/privacy.en.json`: English source content
- `i18n/terms.fr.json`: French terms source content
- `i18n/terms.en.json`: English terms source content
- `templates/policy.template.html`: shared HTML template
- `scripts/build.js`: static page generator

## Build

From `privacy-policy-site/`:

```bash
node scripts/build.js
```

Then publish the `privacy-policy-site/` contents at the root of `wasteless.privacy-policy.github.io`.
