/*
 * videogame-format.js
 *
 * This extension adds the 'videogame map format' type to the Export As menu,
 * which can be used to generate matrix maps as used by the Scene.build()
 * method from the videogame library (https://github.com/diogoeichert/videogame)
 */

/* global tiled, FileInfo, TextFile */

tiled.registerMapFormat("videogame", {
	name: "videogame map format",
	extension: "json",

	write: (map, fileName) => {
		for (let i = 0; i < map.layerCount; ++i) {
			const layer = map.layerAt(i);

			if (!layer.isTileLayer) {
				continue;
			}

			var file = new TextFile(fileName, TextFile.WriteOnly);
			file.writeLine("[");
	
			for (let y = 0; y < layer.height; ++y) {
				const row = [];

				for (let x = 0; x < layer.width; ++x) {
					const tile = layer.tileAt(x, y);
					let id = "  ";

					if (tile) {
						id = FileInfo.baseName(tile.imageFileName);
					}

					row.push(`"${id}"`);
				}

				file.writeLine("\t[" + row.join(", ") + "],");
			}

			file.writeLine("]");
			file.commit();
		}
	},
});
