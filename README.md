> [!WARNING]
> **Customized standalone version.** Do not run upstream update/install commands: they can overwrite custom code and AI configuration. Automatic installation, removal and updates are disabled.

![Lyric Plus Translate — Standalone 1.10.0](assets/readme-banner.svg)

<p align="center"><a href="README_VI.md">Tiếng Việt</a> · <a href="CUSTOMIZATION.md">Customization</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">License</a></p>

A standalone customization of Spicetify's **lyrics-plus**, maintained by **Hoàng Đức Mạnh**. Read lyrics, translate through your chosen AI endpoint and shape the listening view around your music.

## The listening experience

| Feature | What you can do |
| :-- | :-- |
| **Fullscreen · F12** | Album art and Spotify controls beside lyrics; a centered cover when lyrics are missing or hidden. Spotify bars reveal near the screen edges; lyric tools reveal near the lower-right corner. |
| **Translation** | Choose endpoint, available model, language, translation style and Vietnamese pronouns. Show originals, translations and supported phonetics. |
| **Appearance** | Main/translation/phonetic fonts, sizes, weights, spacing, blur and motion. Live sample, Calm/Cinema/Karaoke presets and personal presets. |
| **Backgrounds** | Muted YouTube video or blurred album art. Select video manually; choose album fallback or looping when a shorter video ends. |
| **Advertisements** | Optionally cover detected ads with album art until they finish. Notice duration is separate; stalled ads have at most two reload attempts. |
| **Word timing** | Highlight words when the lyrics provider supplies word timing; otherwise synchronize by line. |

> [!NOTE]
> Matching uses metadata, not visual verification of official MVs. YouTube may omit ad signals. Live Spotify behavior needs confirmation; see [validation and limits](CUSTOMIZATION.md#validation-and-limits).

## Install manually

The complete walkthrough below targets **Windows**. If Spotify and Spicetify already work, skip to **Step 3**. Node.js, npm and a build step are not required to use the app.

### Step 1 — Download and initialize Spotify

1. Visit [Spotify for Windows](https://www.spotify.com/download/windows/) and choose **Download directly from Spotify** for the desktop installer.
2. Run the installer. This app needs desktop Spotify; it does not run in the web player or mobile app.
3. Open Spotify, sign in and leave it running for **at least 60 seconds** to create the necessary files.
4. Close Spotify before applying Spicetify changes.

If the Microsoft Store edition causes a missing-prefs error, switch to the website edition as described in the [official FAQ](https://spicetify.app/docs/faq#cannot-find-pref_file). Do not delete Spotify data just to experiment with a fix.

### Step 2 — Install Spicetify CLI

Open PowerShell or Windows Terminal normally from Start. Choose **one** installation method.

**Option A — Windows Package Manager:**

```powershell
winget install Spicetify.Spicetify
```

**Option B — Official CLI script**, if winget is unavailable:

```powershell
iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex
```

This installs **Spicetify CLI**, not the original lyrics-plus app. Review scripts before running them. Marketplace is optional for this standalone app; you may answer **N** if offered installation.

Close and reopen PowerShell to refresh PATH, then verify installation:

```powershell
spicetify --version
```

For the first setup on an unmodified Spotify installation, create the backup and apply Spicetify:

```powershell
spicetify backup apply
```

Resolve errors before continuing. Installation commands are based on the [official Spicetify guide](https://spicetify.app/docs/getting-started).

### Step 3 — Download the standalone source

1. On the **lyricsRiamu** repository, choose **Code → Download ZIP**. Downloading the main branch produces an archive named `lyricsRiamu-main.zip`, which extracts to **lyricsRiamu-main**. This document does not assume a published repository URL.
2. Open **lyricsRiamu-main** and locate `index.js` and `manifest.json`. You can keep this downloaded/repository folder name; the installation folder in CustomApps must be named **lyrics-plus** for the current app configuration.
3. Keep all runtime folders: `components`, `utils`, `services`, `providers`, `parsers`, `i18n`, `assets`, and the CSS files. Copying only `index.js` is insufficient.
4. Back up existing customized source separately. Do not replace it with the stock/upstream app.

### Step 4 — Copy into CustomApps and load

Find Spicetify's user-data directory:

```powershell
spicetify path userdata
```

Inside the printed directory, open/create **CustomApps/lyrics-plus**. Copy **all contents of lyricsRiamu-main** into that folder, including its subfolders. Alternatively, copy the entire **lyricsRiamu-main** folder into CustomApps and rename that copy to **lyrics-plus**. Windows setups may use `%AppData%\spicetify\CustomApps`; bundled apps can also exist under `%LocalAppData%\spicetify\CustomApps`. These are different locations.

```text
CustomApps/
└── lyrics-plus/
    ├── index.js
    ├── manifest.json
    ├── style.css
    ├── variables.css
    ├── components/
    ├── utils/
    ├── services/
    └── ... remaining folders and files
```

Correct: `CustomApps/lyrics-plus/manifest.json`. Incorrect: `CustomApps/lyrics-plus/lyricsRiamu-main/manifest.json` or `CustomApps/lyrics-plus/lyrics-plus/manifest.json`.

Register the app and load its files:

```powershell
spicetify config custom_apps lyrics-plus
spicetify apply
```

Check which app folder is actually selected:

```powershell
spicetify path -a lyrics-plus
```

If it points elsewhere, check duplicate folders before replacing files. Registration appends the app to the existing list; other apps need not be removed. See [Custom Apps documentation](https://spicetify.app/docs/customization/custom-apps).

Reopen Spotify and select Lyrics Plus in its navigation. The installation folder must remain **lyrics-plus**, even though the display name is Lyric Plus Translate.

<details>
<summary>macOS / Linux</summary>

Download Spotify from its [official website](https://www.spotify.com/download/) and follow Spicetify's [platform-specific setup](https://spicetify.app/docs/getting-started). Linux setup depends on Spotify's package and permissions; do not reuse Windows PowerShell commands.

Once the CLI works, inspect `spicetify path userdata`, copy into `CustomApps/lyrics-plus`, and use the same registration/apply commands above. The common location is `~/.config/spicetify/CustomApps`. Sign in and leave Spotify running for at least 60 seconds before first setup.

</details>

**Updating:** back up customized source, review newer standalone files and replace manually. Neither bundled script downloads updates or deletes files.

**Removing:** back up source, then unregister and apply manually:

```powershell
spicetify config custom_apps lyrics-plus-
spicetify apply
```

Delete only this app's folder if desired. Removing source does not automatically erase locally stored keys, settings or caches; review those separately in Spotify/Spicetify.

## Make it yours

### Step 5 — Open settings and select lyric sources

Open your profile menu → **Lyrics Plus config**, or press F12 and move over the cover to reveal settings. Choose the interface language in **General** and lyric sources in **Providers**. Original lyrics do not require an AI key; missing lyrics produce the centered fullscreen cover.

For Musixmatch, use **Refresh Token** or supply your own token when required. Do not share tokens in screenshots or issues.

### Step 6 — Configure AI translation

1. For Gemini, sign in to [Google AI Studio](https://aistudio.google.com/api-keys) and create/select a project and API key using [Google's instructions](https://ai.google.dev/gemini-api/docs/api-key). Other services require their own keys.
2. Open **Translation**:

   | Setting | How to choose |
   | :-- | :-- |
   | API Endpoint | The compatible endpoint supplied by your provider. The app includes a default Gemini endpoint. |
   | Model Name | A model available to your account; preset names are not an availability guarantee. |
   | API Keys | Add your key in Settings. Multiple keys are optional; do not edit source or create an `.env` file. |
   | Response Format | Start with the default; try Prompt if the provider does not support JSON Schema. |
   | Reasoning Effort | Use a level supported by the provider/model. Not every model exposes reasoning. |
   | Pre-translation | Optional advance translation of the next track; this can make additional requests. |

3. Open **Conversions** from the lyric tools: select target language, the appropriate AI display mode and placement. Use **Below original** to keep the original above the translation. Style/pronouns are configured here too.
4. Play a track with lyrics and wait for the request. AI keys do not grant Spotify Premium; quotas and charges depend on the provider.

### Step 7 — Customize appearance and background

In **Appearance**, choose fonts, sizes, spacing or presets; inspect the sample and save personal presets. Translation/phonetic fonts must be installed locally.

In **Background**, enable album art or video. Video is always muted and defaults to album fallback at its end; enable **Loop video when it ends** to repeat. Ad cover lasts until the detected ad finishes; 5/7/10 seconds only controls the notice. Use the lyric tools' video settings for a manual selection if automatic search chooses poorly.

Press **F12** to enter/exit fullscreen. Move near the top/bottom edges or lower-right corner to reveal tools.

Appearance reset only affects appearance fields, not AI keys or prompts.

[Explore the customization guide →](CUSTOMIZATION.md)

## Credentials and privacy

**Gemini/AI keys are empty by default.** Enter them in Settings. They are stored on-device in Spicetify.LocalStorage/localStorage and sent to the selected API endpoint for requests. The repository does not receive your settings. Local storage is **not encrypted**: never publish browser-storage exports, personal keys or tokens.

YouTube InnerTube search retains an embedded protocol client key; client-side source cannot conceal it. The bundled Musixmatch user token was removed: enter a token or use the existing refresh flow. Refresh-success logs do not print its value. Review endpoints and proxies before sharing credentials with a service.

## Troubleshooting

| Symptom | Check first |
| :-- | :-- |
| spicetify command not found | Reopen the terminal after installation; check CLI/PATH using official documentation. |
| Missing prefs / Spotify not found | Did you sign in and wait 60 seconds? Check desktop installation and the [FAQ](https://spicetify.app/docs/faq#cannot-find-pref_file). |
| App missing or old interface remains | Inspect `spicetify path -a lyrics-plus`; check nesting, manifest and whether you applied/reopened Spotify. |
| No lyrics | Try another track/provider. Not every track has lyric data. |
| AI error 401/403 | Check key, project access and endpoint. Do not post full keys. |
| AI error 404/model not found | Select a model actually available from the provider. |
| AI error 429 | Wait for quota recovery, review limits and reduce pre-translation if needed. |
| Video fails or is missing | Use album art/manual selection; inspect network/proxy settings. |
| Mod disappears after Spotify updates | Back up custom source and follow [Spicetify recovery guidance](https://spicetify.app/docs/getting-started#updating). CLI upgrades are separate from standalone app updates. |

## Development and validation

Runtime JavaScript/CSS loads directly in manifest order. Keep **assets/libs**, runtime files and documents together; no package manager is required.

```powershell
node tests/video-background.test.cjs
```

This offline mock test covers video selection, caches, stale requests, album fallback and loop/seek behavior. Syntax and JSON checks do not prove live Spotify compatibility or reliable ad detection.

## Credits and license

This customization builds on existing work; it does not claim authorship of the entire original codebase.

- **Spicetify team:** original [lyrics-plus](https://github.com/spicetify/cli/tree/main/CustomApps/lyrics-plus) and runtime.
- **Tuna285:** earlier translation/video customization this edition derives from. Upstream installation/update links are intentionally omitted.
- **Bundled language tools:** Kuroshiro and its Kuromoji analyzer, Aromanize, OpenCC and pinyin-pro. Their original notices/licenses remain applicable.

Distributed under [GNU LGPL-2.1](LICENSE). Preserve existing attribution and license notices when redistributing.
