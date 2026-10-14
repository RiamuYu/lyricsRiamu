# Customization guide

**Lyric Plus Translate · Standalone 1.10.0**

[English overview](README.md) · [Tổng quan tiếng Việt](README_VI.md)

## Fullscreen

Press F12 by default; the shortcut can be changed in Settings. With lyrics, album art and Spotify controls sit beside the lyrics. Without lyrics, or when you hide them, the cover is centered.

Move over the cover to reveal playback/settings controls. Move near the top/bottom screen edge for Spotify bars or near the lower-right corner for lyric tools. Exiting fullscreen restores the standard interface. Keyboard focus keeps cover controls visible.

The progress and volume controls operate Spotify, not the YouTube background. Background video remains muted.

## Appearance and presets

Settings → Appearance provides main font/weight, translation and phonetic fonts/sizes, translation weight, spacing, width, inactive opacity, motion duration, active-line zoom, shadows, reduced motion and timed-word highlighting. Existing synced-lyrics options determine surrounding lines and blur.

Translation/phonetic fonts must be installed on your computer. The main font retains the existing dynamic font-loading behavior. A blank secondary font inherits the main font.

Start with Calm, Cinema or Karaoke, or save a named personal preset. Presets contain appearance fields only; applying/resetting them does not change AI credentials or prompts. The live sample is a typography/background preview, not an exact simulation of every lyric source.

Word highlighting uses existing karaoke data with real word timings. Timing is not invented for line-only lyrics.

## Album and video backgrounds

Settings → Background controls album-art blur, brightness, zoom and transition duration, alongside video blur, brightness, scale and fullscreen coverage.

Automatic video selection prioritizes song/artist matches, handles common featured-artist metadata and applies a duration check to less certain title matches. Manual video choices remain available. This does not establish that an upload is an official MV.

When a shorter video finishes, album art is the default fallback. Enable video looping to keep it running until the song ends. Seeking back into the video's timeline can restore it.

## Advertisements

Album art during detected ads is enabled by default. It stays for the whole ad, even after the notice disappears. Disable the option to show the muted ad instead.

Notification choices are off, 5, 7 or 10 seconds. The default stalled-ad threshold is 45 seconds without progress; repeated backward clock jumps can also trigger recovery. The threshold is adjustable between 30 and 180 seconds. Recovery attempts at most two reloads per ad session before a failure notice.

Ad detection and clock interpretation depend on available player data and validated YouTube iframe messages. Signals may be missing or incomplete; real playback must confirm the behavior. The reload threshold is not a guaranteed detector of a stuck advertisement.

## Installation and credentials

The application loads runtime files directly from manifest.json. FullscreenNowPlaying.js is registered before it is used; copy the full source tree and use the manual loading commands in the README. No build or bundler is involved.

Gemini/AI keys are supplied by the user and stored locally in Spicetify.LocalStorage/localStorage, which is not encrypted. Requests send credentials to the selected API endpoint. Do not commit personal settings, storage exports or tokens.

The embedded InnerTube key is a client credential for the existing YouTube search protocol. The bundled Musixmatch user token was removed; the existing token refresh flow runs when a token is missing. Refresh success logs no longer expose the token. Network-dependent token refresh still requires live verification.

Install/uninstall scripts and upstream updates are intentionally disabled. Manual update checks explain this in the UI; silent checks perform no requests.

## Validation and limits

- Source JavaScript/CJS syntax, manifest/version JSON and the presence of manifest subfiles are checked for this release preparation.
- tests/video-background.test.cjs is an offline mock test for matching, caches, stale requests, album fallback and loop/seek behavior. It does not cover every new setting, real ads, real endpoints or the complete Spotify UI.
- Live Spotify layout, playback, full-window controls, ads, fonts and token refresh have not been verified by this release-preparation pass.
- Actual API model availability and provider behavior depend on the configured services.

Keep the original [LGPL-2.1 license](LICENSE) and inherited attribution when redistributing. Spotify controls use the [Spicetify Player API](https://spicetify.app/docs/development/api-wrapper/methods/player).
