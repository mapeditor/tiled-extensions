/*
 * find-layer-by-id.qml
 *
 * This extension adds a 'Select Layer by ID' (Ctrl+Alt+L) action to the
 * Layer menu, which can be used to quickly jump to and select a layer when
 * you know its ID.
 */

import Tiled

Extension {
    function findLayerById(thing, id) {
        for (let i = thing.layerCount - 1; i >= 0; i--) {
            const layer = thing.layerAt(i);
            if (layer.id == id) {
                return layer;
            }

            if (layer.isGroupLayer) {
                const l = findLayerById(layer, id);
                if (l) {
                    return l;
                }
            }
        }

        return null;
    }

    Action {
        id: selectLayerById
        name: "SelectLayerById"
        text: "Select Layer by ID"
        shortcut: "Ctrl+Alt+L"

        onTriggered: {
            const map = tiled.activeAsset;
            if (!map.isTileMap) {
                tiled.alert("Not a tile map!");
                return;
            }

            let id = tiled.prompt("Please enter a layer ID:");
            if (id == "") {
                return;
            }

            id = Number(id);

            const layer = findLayerById(map, id);
            if (!layer) {
                tiled.alert("Failed to find a layer with ID " + id);
                return;
            }

            map.currentLayer = layer;
        }
    }

    MenuExtension {
        menu: "Layer"
        items: [
            { action: selectLayerById, before: "SelectPreviousLayer" },
        ]
    }
}
