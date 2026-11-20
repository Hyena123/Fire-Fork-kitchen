# Fire-Fork Kitchen 🔥

**A free, browser-based cooking dashboard that works in Chrome and can optionally read a private Google Docs/Sheets cookbook.**

**Live site:** https://hyena123.github.io/Fire-Fork-kitchen/  
**Privacy policy:** https://hyena123.github.io/Fire-Fork-kitchen/privacy.html  
**Website / account links:** [WEBSITE-LINKS.md](WEBSITE-LINKS.md)

## What it does

- **Cooking tabs:** Start separate cooking sessions and switch between active cooks.
- **Google cookbook:** Optionally read the existing *Master Recipe Index* (Google Sheets), then load the chosen recipe's Google Doc.
- **Recipe detail:** View ingredients, numbered instructions, status/version, and an expandable copy of the source recipe.
- **Progress tracking:** Check off steps while cooking.
- **Temperature logging:** Record timestamps, meat temperature, cooker temperature, and cooking stage; view a graph and history.
- **Notes:** Capture cook observations and results.
- **Ask ChatGPT:** Copy a cooking handoff and open ChatGPT; the user pastes and sends it.
- **PDF report:** Use the browser's **Print → Save as PDF** flow to save the cook report.
- **JSON backup:** Export the cooking dashboard's local data.

The dashboard is usable without Google sign-in through a small built-in starter catalog. The full private cookbook requires Google authorization and the appropriate file permissions.

## Using Fire-Fork Kitchen

1. Open the [live website](https://hyena123.github.io/Fire-Fork-kitchen/) in Chrome.
2. Optionally click **Connect Google cookbook** and authorize access to Google Sheets and Docs.
3. Click **+ New cook** and choose a recipe.
4. Check off steps, add actual temperature readings, and write notes.
5. Use **Save to PDF & finish**, **Finish without PDF**, or **Export data backup**, as needed.

**Where does the PDF go?** Chrome opens a print dialog. Choose **Save as PDF** and the file is saved wherever you select on your computer or phone. It is **not** automatically uploaded to Google Drive.

## Storage, sharing, and privacy

| Item | Current behavior |
| --- | --- |
| Website code | Publicly hosted on GitHub Pages. Anyone can open the site and view the public source. |
| Private Google cookbook | Requires authorization and access to the underlying Google Sheets/Docs. Private recipes are not automatically public. |
| Google API permission | Read-only for Docs and Sheets; **the scopes cover all accessible Docs and Sheets**, not only the cookbook. The app currently requests only the configured index and a recipe chosen from it. |
| Google access token | Kept in browser memory; not intentionally saved to local storage or committed to GitHub. |
| Cooking steps, temperatures, notes | Stored in the current browser's `localStorage`; retained after refresh but **not synchronized** across browsers or devices. |
| Selected recipe | A local snapshot is saved with the cooking session. Started cooks may continue after Google access expires; changes to a source Doc do not automatically update that saved snapshot. |
| Different visitors | Separate browser storage. People sharing the same browser profile may see the same local sessions. |
| PDF / JSON backup | Downloaded or printed locally; not automatically saved to Drive. |

**Important:** The built-in starter catalog, including some recipe names, links, and sample cooking information, is embedded in the publicly readable `index.html`. Remove or generalize those entries before sharing if you consider any of them private.

**Google verification:** The OAuth consent application was published to Production, but Google **has not verified it**. The owner tested the Google connection successfully, but public users may see Google's unverified-app warning. Do not tell others to bypass security warnings; complete Google's verification requirements before promoting private cookbook access broadly.

## Technology

- A static site using **HTML, CSS, and JavaScript**; no build process or paid app server.
- Hosted on **GitHub Pages**.
- Google Identity Services OAuth 2.0 **token model** for optional authorization.
- Google Sheets API for the Master Recipe Index.
- Google Docs API for the selected recipe.
- Browser `localStorage` for cook state.
- Browser Canvas for the temperature graph and browser Print for PDF output.

## Site files

| File | Purpose |
| --- | --- |
| `index.html` | Main website, including the dashboard and Google read-only connection. |
| `privacy.html` | Public privacy policy. Keep it aligned with actual site behavior. |
| `README.md` | This documentation. |
| `WEBSITE-LINKS.md` | Quick reference for the project URLs and admin pages. |

## Deployment and updates

**Current GitHub Pages setup:** Repository `Hyena123/Fire-Fork-kitchen` → **Settings → Pages** → **Deploy from a branch** → branch `main` → folder `/(root)`.

To publish an update, commit a replacement **`index.html`** to the **root** of the `main` branch. Keep the file named exactly `index.html`, not `index(1).html`. GitHub Pages deploys the new version, and the website address remains unchanged. Update `privacy.html` when data handling changes.

If a change doesn't appear immediately, refresh Chrome using `Ctrl + Shift + R` (Windows) or clear the site's cache; GitHub Pages deployment may take a little time.

For a new GitHub Pages domain, update the OAuth **Authorized JavaScript origins** in Google Cloud and review the application homepage and authorized domains. Never add OAuth client secrets to the repository.

## Google cookbook connection

The site is configured to read the user's **Master Recipe Index**:

- [Master Recipe Index — All Recipes](https://docs.google.com/spreadsheets/d/1xwrIATTmDAowgIusM3t5TrQZFBoKDvk_XeHZBoQWOKs/edit)
- [Cookbook folder](https://drive.google.com/drive/folders/1dtLQpDu0fjNHmhkc_PC7qTwQdXH5_U5V)

The `All Recipes` tab includes the recipe's title, section, status, version, dietary notes, equipment, and Google Doc link. The website reads the index when connected and requests the full linked Google Doc when a recipe is selected.

**Google Cloud project:** `Fire-Fork-Kitchen`  
**Web OAuth client label:** `Fire-Fork Kitchen Website`  
**Authorized JavaScript origin:** `https://hyena123.github.io`  
**Enabled APIs:** Google Sheets API and Google Docs API  
**Requested permissions:**

```text
https://www.googleapis.com/auth/spreadsheets.readonly
https://www.googleapis.com/auth/documents.readonly
```

**Manage configuration:**

- [Google Cloud — OAuth clients](https://console.cloud.google.com/auth/clients)
- [Google Cloud — Data Access](https://console.cloud.google.com/auth/data-access)
- [Google Cloud — Branding](https://console.cloud.google.com/auth/branding)
- [Google Cloud — Audience](https://console.cloud.google.com/auth/audience)

> These are broad read scopes. Restrict which accounts authorize the app and keep the code focused on the intended files. Google sign-in is optional for users of the basic dashboard.

## Testing status — November 20, 2026

The owner confirmed the following in Chrome on the live site:

- Google authorization connected to the cookbook.
- A selected recipe displayed its ingredients, steps, and approval status.
- Checked recipe steps survived a page refresh.
- A logged temperature survived a page refresh and appeared in the graph.
- Saving to PDF worked and contained the expected report information.

These are **hands-on user confirmations**, not automated production monitoring or a full security audit. Further testing is needed for multiple recipe formats, different mobile browsers, errors, and wider use.

## Potential improvements

- Verify Google OAuth for wider use, or offer a separate public/sample recipe catalog without Google access.
- Support multiple meat probes as distinct series and add clearer graph labels.
- Add optional, permission-controlled shared cooking sessions (currently **not** enabled).
- Improve import and backups/restore across devices without exposing private recipes.
- Keep the privacy policy and family dietary warnings accurate as functionality evolves.

## Security and source-of-truth reminders

- **Do not commit** Google client secrets, access tokens, passwords, or private recipe exports to this public repository.
- Google Docs and the Master Recipe Index remain the **authoritative recipe records**. The website is read-only, and cooking notes/progress stay local.
- A cookbook recipe marked **Approved** is not changed automatically by experimentation in the dashboard.
- Food safety, allergens, and dietary restrictions still require checking each recipe and the actual ingredient labels.

---

**Documentation prepared:** November 20, 2026.
