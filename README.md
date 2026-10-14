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

First install Spotify and configure [Spicetify](https://spicetify.app/docs/getting-started/). No build step, npm install or bundler is needed.

1. Download and extract this standalone source. **Back up existing customized files before replacement.**
2. Copy the complete folder named **lyrics-plus** into CustomApps, preserving all subfolders and the manifest.

   | System | Common CustomApps directory |
   | :-- | :-- |
   | Windows | `%LocalAppData%\spicetify\CustomApps` |
   | macOS / Linux | `~/.config/spicetify/CustomApps` |

   Use your configured Spicetify directory for a nonstandard setup.

3. Register and load the app:

   ```powershell
   spicetify config custom_apps lyrics-plus
   spicetify apply
   ```

4. Open Spotify and select Lyrics Plus. Open **Lyrics Plus config** from the profile menu or fullscreen settings button.

**Updating:** back up customized source, review newer standalone files and replace manually. Neither bundled script downloads updates or deletes files.

**Removing:** back up source, then unregister and apply manually:

```powershell
spicetify config custom_apps lyrics-plus-
spicetify apply
```

Delete only this app's folder if desired. Removing source does not automatically erase locally stored keys, settings or caches; review those separately in Spotify/Spicetify.

## Make it yours

- **Translation / Conversions:** provide keys and a compatible endpoint; choose a model actually available through it. Configure original/translated/phonetic display, placement, style and pronouns. Preset model names do not guarantee availability.
- **Appearance:** customize typography and motion, inspect the sample and save presets. Appearance reset does not reset AI keys or prompts.
- **Background:** adjust blur, brightness and zoom; select looping, ad cover, notification duration and stalled-ad threshold.

[Explore the customization guide →](CUSTOMIZATION.md)

## Credentials and privacy

**Gemini/AI keys are empty by default.** Enter them in Settings. They are stored on-device in Spicetify.LocalStorage/localStorage and sent to the selected API endpoint for requests. The repository does not receive your settings. Local storage is **not encrypted**: never publish browser-storage exports, personal keys or tokens.

YouTube InnerTube search retains an embedded protocol client key; client-side source cannot conceal it. The bundled Musixmatch user token was removed: enter a token or use the existing refresh flow. Refresh-success logs do not print its value. Review endpoints and proxies before sharing credentials with a service.

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
