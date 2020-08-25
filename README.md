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

* When using a version older than Tiled 1.3.3, restart Tiled.

  (This was necessary because Tiled only watched existing scripts for
  changes. No restarts are necessary when making changes to existing script
  files, since it will trigger an automatic reloading of the scripts.)

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

### JavaScript

* [MikeMnD/tiled-to-godot-export](https://github.com/MikeMnD/tiled-to-godot-export)
* [ilius33/TiledToAngbandExport](https://github.com/ilius33/TiledToAngbandExport)
* [sergkr/tiled-bulk-animations](https://github.com/sergkr/tiled-bulk-animations)

### Python

Tiled can also be [extended using Python](https://doc.mapeditor.org/en/stable/manual/python/). While this is limited to adding custom map formats, does not currently work on macOS or the snap releases and requires a specific Python version to be installed on the system, it still may be a valid option especially while some features are still lacking for JavaScript extensions. Here's a list of noteworthy Python extensions:

* [samhocevar/tiled-pico8](https://github.com/samhocevar/tiled-pico8) (see [bjorn/tiled#2781](https://github.com/bjorn/tiled/issues/2781))
