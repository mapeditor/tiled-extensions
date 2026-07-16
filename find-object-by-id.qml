/*
 * find-object-by-id.qml
 *
 * This extension adds a 'Find Object by ID' (Ctrl+Shift+F) action to the Map
 * menu, which can be used to quickly jump to and select an object when you
 * know its ID.
 */

// qmllint disable unqualified

import Tiled

Extension {
    function findObjectById(thing, id) {
        for (let i = thing.layerCount - 1; i >= 0; i--) {
            const layer = thing.layerAt(i);

            if (layer.isGroupLayer) {
                const obj = findObjectById(layer, id);
                if (obj) {
                    return obj;
                }
            } else if (layer.isObjectLayer) {
                for (const obj of layer.objects) {
                    if (obj.id == id) {
                        return obj;
                    }
                }
            }
        }

        return null;
    }

    Action {
        id: jumpToObject
        name: "JumpToObject"
        text: "Find Object by ID"
        shortcut: "Ctrl+Shift+F"

        onTriggered: {
            const map = tiled.activeAsset;
            if (!map.isTileMap) {
                tiled.alert("Not a tile map!");
                return;
            }

            let id = tiled.prompt("Please enter an object ID:");
            if (id == "") {
                return;
            }

            id = Number(id);

            const object = findObjectById(map, id);
            if (!object) {
                tiled.alert("Failed to find object with ID " + id);
                return;
            }

            const pos = map.pixelToScreen ? map.pixelToScreen(object.pos) : object.pos;
            tiled.mapEditor.currentMapView.centerOn(pos.x, pos.y);

            map.selectedObjects = [object];
        }
    }

    MenuExtension {
        menu: "Map"
        items: [
            { separator: true },
            { action: jumpToObject },
        ]
    }
}
