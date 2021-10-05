# Tiled Extensions

[Tiled](https://www.mapeditor.org) can be [extended using
JavaScript](https://doc.mapeditor.org/en/stable/reference/scripting/). This
repository provides a number of example extensions that can either be useful
as-is or can provide a starting point when writing your own extensions.

## Installation

When you want to add these extensions to your Tiled installation:

* Open Tiled and go to _Edit > Preferences > Plugins_ and click the "Open"
  button to open the extensions directory.

* [Download](https://github.com/mapeditor/tiled-extensions/archive/master.zip)
  the files in this repository and extract them to that location. The scripts
  can be placed either directly in the extensions directory or in a
  subdirectory.

  (Alternatively, clone this git repository into the extensions directory)

Project-specific extensions can be placed in a directory in your project
instead, to make it easier to share them with teammates!

## Contributing

If you have written an extension that you think makes a great example or would
be generally useful for others, please don't hesitate to open a pull request to
have it added to this repository or to the list below!

Please run the linter to check for avoidable issues in the .js files:
```
npm install
npx eslint [your-extension.js]
```

## Awesome Tiled Extensions

Noteworthy extensions in other repositories:

* [djedditt/tiled-to-gba-export](https://github.com/djedditt/tiled-to-gba-export)<br>
  Export tilemaps to **GBA source files**
* [MikeMnD/tiled-to-godot-export](https://github.com/MikeMnD/tiled-to-godot-export)<br>
  Export tilemaps and tilesets to **Godot** format
* [samhocevar/tiled-pico8](https://github.com/samhocevar/tiled-pico8)<br>
  Import/export to **PICO-8**
* [ilius33/TiledToAngbandExport](https://github.com/ilius33/TiledToAngbandExport)<br>
  Export to **Angband.online**
* [sergkr/tiled-bulk-animations](https://github.com/sergkr/tiled-bulk-animations)<br>
  Efficiently setup **bulk animations**
* [eishiya/tiled-scripts](https://github.com/eishiya/tiled-scripts)<br>
  Assorted scripts
