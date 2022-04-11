// This script binds layers and tilesets with the same name :
// On layer change, if the current layer is a tile layer, it selects the corresponding tileset (if it exists)
// On tileset change, it selects the corresponding layer (if it exists) on the active TileMap

// recursive function that parses TileMaps and GroupLayers to search for a layer named targetName
// code taken from user eishiya (https://github.com/eishiya) in this issue https://github.com/mapeditor/tiled/issues/3256
function findLayer(curLayer, targetName) {
	if(curLayer.isGroupLayer || curLayer.isTileMap) {
		let numLayers = curLayer.layerCount;
		for(let layerID = 0; layerID < numLayers; layerID++) {
			let found = findLayer(curLayer.layerAt(layerID), targetName);
			if(found)
				return found;
		}
	} else if(curLayer.name == targetName)
		return curLayer;
	
	return null;
}

// change active TileMap layer based on the current TileSet
function onTilesetChange() {
    let map = tiled.activeAsset;
    // only consier TileMap
    if (!map.isTileMap) {
        return;
    }

    // find layer corresponding to current Tileset
    let targetName = tiled.mapEditor.tilesetsView.currentTileset.name;
    let layer = findLayer(map, targetName);

    // apply
    if (layer) {
        map.currentLayer = layer;
    }
}

// change TileSet based on current layer
function onLayerChanged(asset) {
    let layer = asset.currentLayer;

    // only consider tile layers
    if (!layer.isTileLayer) {
        return;
    }

    // find correspongind Tileset
    let tileSet = undefined;
    for (ts of asset.tilesets) {
        if (ts.name == layer.name) {
            tileSet = ts;
            break;
        }
    }

    // apply
    if (tileSet) {
        tiled.mapEditor.tilesetsView.currentTileset = tileSet;
    }
}

// do the binding for a TileMap
function bindTileSetToLayer(asset) {
    // only work on TileMap
    if (!asset || !asset.isTileMap) {
        return;
    } 

    asset.currentLayerChanged.connect(() => {
        onLayerChanged(asset);
    });
}

// call layer update on each tile change
tiled.mapEditor.tilesetsView.stampCaptured.connect(onTilesetChange);

// call the binding for each opened asset
tiled.assetOpened.connect(bindTileSetToLayer);