/// <reference types="@mapeditor/tiled-api" />

/*
 * shortcuts.js
 *
 * Example script that enables associating shortcuts with tilesets and layers.
 *
 * To use this script, add a custom property named "shortcut" to a tileset or
 * layer, and set its value to the desired shortcut. For example, to assign F1
 * to a tileset, add a custom property named "shortcut" with the value "F1" to
 * the tileset. The property name is case-sensitive.
 *
 * Since the script is not aware of changes made to custom properties, a change
 * of shortcut requires a restart of Tiled or reopening the relevant assets.
 *
 * If a shortcut doesn't work, it's likely because it's already assigned to
 * another action. You can find the list of all actions and their shortcuts in
 * the Preferences dialog.
 */

/* global tiled */

/**
 * @param {Tileset} tileset
 */
function checkTilesetShortcut(tileset) {
    let shortcut = tileset.property("shortcut");
    if (typeof shortcut != "string") {
        return;
    }

    let actionId = "tileset_" + shortcut;

    tiled.log(`Registering ${shortcut} for selecting tileset "${tileset.name}"`);
    let action = tiled.registerAction(actionId, () => {
        if (tileset && tileset.name) {
            tiled.log(`Selecting tileset "${tileset.name}"`);
            tiled.mapEditor.tilesetsView.currentTileset = tileset;
        }
    });
    action.shortcut = shortcut;
    action.text = `Select ${tileset.name} tileset`;

    tiled.extendMenu("Map", [
        { action: actionId, before: "AddExternalTileset" }
    ]);
}

let registeredLayerShortcuts = [];

/**
 * @param {Layer} layer
 */
function checkLayerShortcut(layer) {
    let shortcut = layer.property("shortcut");
    if (typeof shortcut != "string") {
        return;
    }

    let actionId = "layer_" + shortcut;

    tiled.log(`Registering ${shortcut} for selecting layer "${layer.name}"`);
    let action = tiled.registerAction(actionId, () => {
        if (layer && layer.asset) {
            tiled.log(`Selecting layer "${layer.name}"`);
            layer.asset.currentLayer = layer;
        }
    });
    action.shortcut = shortcut;
    action.text = `Select ${layer.name} layer`;
    registeredLayerShortcuts.push(action);

    tiled.extendMenu("Layer", [
        { action: actionId, before: "SelectPreviousLayer" }
    ]);
}

/**
 * @param {TileMap | GroupLayer} mapOrGroupLayer
 */
function checkMapOrGroupLayer(mapOrGroupLayer) {
    mapOrGroupLayer.layers.forEach(layer => {
        checkLayerShortcut(layer);
        if (layer.isGroupLayer) {
            checkMapOrGroupLayer(layer);
        }
    });
}

function checkAsset(asset) {
    if (asset.isTileMap) {
        /** @type TileMap */
        let map = asset;
        map.tilesets.forEach(checkTilesetShortcut);
    } else if (asset.isTileset) {
        checkTilesetShortcut(asset);
    }
}

tiled.assetOpened.connect(checkAsset);
tiled.openAssets.forEach(checkAsset);
tiled.activeAssetChanged.connect(asset => {
    // Hide any already created actions
    registeredLayerShortcuts.forEach(action => {
        action.visible = false;
    });
    registeredLayerShortcuts = [];

    if (asset && asset.isTileMap) {
        checkMapOrGroupLayer(asset);
    }
});
