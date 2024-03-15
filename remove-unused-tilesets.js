/// <reference types="@mapeditor/tiled-api" />

/*
 * remove-unused-tilesets.js
 *
 * Example action that removes all unused tilesets.
 *
 * Uncomment the connection to assetAboutToBeSaved to remove unused tilesets
 * automatically on save.
 */

/**
 * @param {TileMap} map
 */
function removeUnusedTilesets(map) {
	const usedTilesets = map.usedTilesets();
	const unusedTilesets = map.tilesets.filter(tileset => !usedTilesets.includes(tileset));

	if (unusedTilesets.length > 0) {
		tiled.log(`Removing ${unusedTilesets.length} unused tilesets...`);
		map.macro("Remove Unused Tilesets", function () {
			for (const t of unusedTilesets)
				map.removeTileset(t);
		});
	}
}

const removeUnusedTilesetsAction = tiled.registerAction("RemoveUnusedTilesets", () => {
	const map = tiled.activeAsset;
	if (!map.isTileMap) {
		tiled.error("Not a tile map!");
		return;
	}

	removeUnusedTilesets(map);
});
removeUnusedTilesetsAction.text = "Remove Unused Tilesets";

tiled.extendMenu("Map", [
	{ action: "RemoveUnusedTilesets" },
]);

// tiled.assetAboutToBeSaved.connect(asset => {
// 	if (asset.isTileMap) {
// 		removeUnusedTilesets(asset);
// 	}
// });
