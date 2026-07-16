/*
 * remove-unused-tilesets.qml
 *
 * Example action that removes all unused tilesets.
 *
 * Uncomment the Connections element to remove unused tilesets automatically
 * on save (also requires adding "import QtQml").
 */

import Tiled

Extension {
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

    Action {
        id: removeUnusedTilesetsAction
        name: "RemoveUnusedTilesets"
        text: "Remove Unused Tilesets"
        enabled: tiled.activeAsset && tiled.activeAsset.isTileMap

        onTriggered: removeUnusedTilesets(tiled.activeAsset)
    }

    MenuExtension {
        menu: "Map"
        items: [
            { action: removeUnusedTilesetsAction },
        ]
    }

    // Connections {
    //     target: tiled
    //     function onAssetAboutToBeSaved(asset) {
    //         if (asset.isTileMap)
    //             removeUnusedTilesets(asset);
    //     }
    // }
}
