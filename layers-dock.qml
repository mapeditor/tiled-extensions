/*
 * layers-dock.qml
 *
 * Example dock that shows an overview of the layers in the active map.
 * Clicking a layer makes it the current layer, and the checkbox in front
 * of each layer toggles its visibility. Layers in group layers are shown
 * indented.
 *
 * Since the scripting API does not provide fine-grained change
 * notifications, the list is only rebuilt when the active asset changes.
 * Use the Refresh button to pick up changes like added or renamed layers.
 *
 * Requires Tiled 1.13 or later.
 */

// qmllint disable unqualified

import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import Tiled

Dock {
    name: "layersOverview"
    title: "Layers Overview"
    area: Dock.RightDockArea

    ColumnLayout {
        id: content
        spacing: 0

        readonly property var map: tiled.activeAsset && tiled.activeAsset.isTileMap ? tiled.activeAsset
                                                                                    : null

        function collectLayers(mapOrGroupLayer, depth, rows) {
            for (let i = mapOrGroupLayer.layerCount - 1; i >= 0; i--) {
                const layer = mapOrGroupLayer.layerAt(i);
                rows.push({ layer: layer, depth: depth });
                if (layer.isGroupLayer) {
                    collectLayers(layer, depth + 1, rows);
                }
            }
        }

        function refresh() {
            const rows = [];
            if (map) {
                collectLayers(map, 0, rows);
            }
            layersView.model = rows;
        }

        onMapChanged: refresh()
        Component.onCompleted: refresh()

        RowLayout {
            Layout.fillWidth: true
            Layout.margins: 4

            Label {
                Layout.fillWidth: true
                elide: Text.ElideRight
                font.bold: true
                text: {
                    if (!content.map)
                        return "No map active";
                    if (content.map.fileName === "")
                        return "Untitled map";
                    return FileInfo.fileName(content.map.fileName);
                }
            }

            ToolButton {
                text: "Refresh"
                onClicked: content.refresh()
            }
        }

        ListView {
            id: layersView
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true

            delegate: ItemDelegate {
                id: layerRow

                required property var modelData

                width: ListView.view.width
                highlighted: content.map ? content.map.currentLayer === modelData.layer
                                         : false

                onClicked: {
                    if (content.map) {
                        content.map.currentLayer = modelData.layer;
                    }
                }

                contentItem: RowLayout {
                    CheckBox {
                        Layout.leftMargin: layerRow.modelData.depth * 16
                        checked: layerRow.modelData.layer.visible
                        onToggled: layerRow.modelData.layer.visible = checked
                    }

                    Label {
                        Layout.fillWidth: true
                        elide: Text.ElideRight
                        text: layerRow.modelData.layer.name
                    }
                }
            }
        }
    }
}
