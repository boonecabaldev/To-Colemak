# To-Colemak Chrome Extension

A Chrome extension that helps you convert your keyboard input from QWERTY or Dvorak layouts to Colemak, with visual feedback and easy toggling.

## Features

- **Convert from QWERTY or Dvorak:** Choose your source layout in the popup.
- **Enable/Disable Key Conversion:** Toggle the conversion on or off from the popup or with `Ctrl+L`.
- **Visual Feedback:** Highlights active input fields and displays an overlay when toggling.
- **Remembers Settings:** Your layout and toggle state persist across sessions.

## Usage

1. **Install the extension** in Chrome (load unpacked from this folder).
2. Click the extension icon to open the popup.
3. Select your source layout (QWERTY or Dvorak).
4. Check "Enable Key Conversion" to activate.
5. Type in any input or textarea—your keys will be mapped to Colemak.
6. Use `Ctrl+L` to quickly toggle the conversion on or off.

## Development

- **Popup UI:** `popup.html`, `popup.js`
- **Content Script:** `content.js`
- **Key Mappings:** Defined in `content.js`
- **Settings Storage:** Uses `chrome.storage.sync`

## Keyboard Mappings

- QWERTY → Colemak
- Dvorak → Colemak

See `content.js` for the full mapping tables.

## Permissions

- `activeTab`
- `storage`

**Made for keyboard enthusiasts and Colemak learners!**