[![GitHub Repo stars](https://img.shields.io/github/stars/DuckTapeKiller/etymology-multilingual?style=flat&logo=obsidian&color=%2316a085)](https://github.com/DuckTapeKiller/etymology-multilingual/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/DuckTapeKiller/etymology-multilingual?logo=obsidian&color=%2316a085)](https://github.com/DuckTapeKiller/etymology-multilingual/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/DuckTapeKiller/etymology-multilingual?logo=obsidian&color=%2316a085)](https://github.com/DuckTapeKiller/etymology-multilingual/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub manifest version](https://img.shields.io/github/manifest-json/v/DuckTapeKiller/etymology-multilingual?logo=obsidian&color=%2316a085)](https://github.com/DuckTapeKiller/etymology-multilingual/blob/main/manifest.json)
[![Downloads](https://img.shields.io/github/downloads/DuckTapeKiller/etymology-multilingual/total?logo=obsidian&color=%2316a085)](https://github.com/DuckTapeKiller/etymology-multilingual/releases)

![Etymology Multilingual Art](https://github.com/user-attachments/assets/008aaa68-7574-475d-bf45-67277a94d044)

<a href="https://community.obsidian.md/plugins/etymology-multilingual"><img alt="Get it on Obsidian" src="assets/get-it-on-obsidian.svg"></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ducktapekiller)

This plugin allows you to look up the etymology of words in English, Spanish, and French directly within your Obsidian notes.

It is a fork and extension of the [Etymology Lookup](https://github.com/clairefro/obsidian-plugin-etymology-lookup) plugin by **clairefro**, which originally supported only English. This version introduces multilingual support, dictionary integration, caching, and more.

## Features

- **Multilingual Support** — Look up word origins in English, Spanish, and French.
- **Contextual Search** — Highlight a word, right-click, or use the command palette to fetch its etymology.
- **Default Language** — Set a preferred language in settings to skip the language prompt entirely.
- **Dictionary Integration** — Save an etymology directly into a matching note's frontmatter property (e.g. `Etimología`) inside a configured folder.
- **Paste at Cursor** — Insert an etymology into your active note at the cursor position.
- **Copy to Clipboard** — Copy any etymology result with one click.
- **In-Memory Caching** — Repeated lookups for the same word are instant. Configurable TTL (default: 30 minutes).
- **Keyboard Shortcuts** — Press `1`, `2`, or `3` in the language prompt to select a language instantly.
- **Loading Indicator** — Animated spinner while results are being fetched.

## Data Sources

This plugin fetches data from the following online dictionaries (internet connection required):

### English

- [Online Etymology Dictionary](https://www.etymonline.com) (Douglas Harper).

### Spanish

- **DPD** — Diccionario Panhispánico de Dudas (RAE).
- **DLE** — Diccionario de la Lengua Española (RAE).
- **Diccionario Etimológico de Chile**.

### French

- [Wiktionnaire](https://fr.wiktionary.org) (French Wiktionary).
- [CNRTL](https://www.cnrtl.fr) — Centre National de Ressources Textuelles et Lexicales.

## How to Use

1. **Highlight** a word in your active note.
2. Do one of the following:
   - Open the Command Palette (`Ctrl/Cmd + P`) and run **"Etymology Multilingual: Search Etymology"**.
   - Right-click the selection and choose **"Get etymology of …"**.
   - Click the bird icon in the ribbon (left sidebar).
3. Select a language (or skip this step if you've set a default in settings).
4. Browse the results in the modal. Each result has three actions:
   - **Copy** — copies the etymology text to your clipboard.
   - **Paste at cursor** — inserts the text into your active note at the cursor.
   - **Save to dictionary** — writes the etymology into a matching note's frontmatter (requires configuration, see below).

## Settings

Open **Settings → Etymology Multilingual** to configure:

| Setting | Description |
|---------|-------------|
| **Default language** | Skip the language prompt and always search in this language. Set to "Always ask" to be prompted each time. |
| **Cache duration** | How long (in minutes) to keep results in memory. Set to `0` to disable caching. |
| **Clear cache** | Manually clear all cached results. |
| **Dictionary folder** | Path to the folder containing your dictionary notes (e.g. `Diccionario`). Leave empty to disable dictionary integration. |
| **Dictionary property** | The frontmatter property where etymology will be saved (e.g. `Etimología`). |

### Dictionary Integration

If you maintain a personal dictionary in Obsidian where each word is a separate note (e.g. `abarloar.md`, `abalorio.md`), you can save etymologies directly into those notes' frontmatter:

1. Set the **Dictionary folder** to the folder containing your word notes.
2. Set the **Dictionary property** to the frontmatter field name (e.g. `Etimología`).
3. When viewing etymology results, click **"Save to dictionary"** on the result you want to keep.
4. The plugin finds the note whose filename matches the searched word and updates the specified property.

## Installation

### Manual Installation

1. Download the latest release from the [GitHub Releases](https://github.com/DuckTapeKiller/etymology-multilingual/releases) page.
2. Extract `main.js`, `manifest.json`, and `styles.css`.
3. Place them in `.obsidian/plugins/etymology-multilingual/`.
4. Reload Obsidian and enable the plugin.

## Credits

- Original code and concept by [clairefro](https://github.com/clairefro).
- English data courtesy of [Etymonline](https://www.etymonline.com).
- Spanish data courtesy of [RAE](https://www.rae.es) and [Etimologías de Chile](https://etimologias.dechile.net).
- French data courtesy of [Wiktionnaire](https://fr.wiktionary.org) and [CNRTL](https://www.cnrtl.fr).
