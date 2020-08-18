/*
 * follow-warp.js
 *
 * This extension adds a 'Follow Selected Warp' (Ctrl+F) action to the Map
 * menu, which can be used to jump to the destination of a selected warp object
 * (as used on maps made for Source of Tales - http://sourceoftales.org/).
 *
 * Warps are common in games and there are of course many ways to implement
 * them, so this script is unlikely to work in your particular project. But
 * with some adjustments it probably could!
 */

/* global tiled */

function findObjectByName(thing, name) {
	for (let i = thing.layerCount - 1; i >= 0; i--) {
		const layer = thing.layerAt(i);

		if (layer.isGroupLayer) {
			const obj = findObjectByName(layer, name);
			if (obj) {
				return obj;
			}
		} else if (layer.isObjectLayer) {
			for (const obj of layer.objects) {
				if (obj.name == name) {
					return obj;
				}
			}
		}
	}

	return null;
}

let followWarp = tiled.registerAction("FollowWarp", function(/* action */) {
	const map = tiled.activeAsset;
	if (!map.isTileMap) {
		tiled.alert("Not a tile map!");
		return;
	}

	const selectedObject = map.selectedObjects[0];
	if (!selectedObject) {
		tiled.alert("No object selected!");
		return;
	}

	const destMapProperty = selectedObject.property("DEST_MAP");
	if (!destMapProperty) {
		tiled.alert("No DEST_MAP property!");
		return;
	}

	const mapsPath = map.fileName.substr(0, map.fileName.indexOf("maps/") + 5);
	const destinationMapFile = mapsPath + destMapProperty + ".tmx";
	const destinationName = selectedObject.property("DEST_NAME");

	const destinationMap = tiled.open(destinationMapFile);
	if (!destinationMap) {
		return;
	}

	if (destinationName) {
		const object = findObjectByName(destinationMap, destinationName);
		if (!object) {
			tiled.alert("Failed to find object named '" + destinationName + "'");
			return;
		}

		tiled.mapEditor.currentMapView.centerOn(object.x, object.y);
		destinationMap.selectedObjects = [object];
	}
});
followWarp.text = "Follow Selected Warp";
followWarp.shortcut = "Ctrl+F";

tiled.extendMenu("Map", [
	{ separator: true },
	{ action: "FollowWarp" },
]);
