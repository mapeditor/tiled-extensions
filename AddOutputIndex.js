/* 	Add Output Index script by eishiya, last updated 15 Mar 2024

	Requires Tiled 1.10.2+

	As of Tiled 1.10.3, output layers without an index always get output.
	Before, such layers would simply count as another index to choose at random.
	This causes a potential change in behaviour for older Automapping rules.
	
	This script adds an action to the Map menu that updates old rules
	to work the same as they did before.
	For any rules map it finds that has output layers with named indices,
	any output layers *without* named indices get a named index.
	
	This script will attempt to fix commented-out layer names too,
	as long as they're otherwise valid, e.g.
	"//output_Blah" will get fixed, "//TODO: output_Blah" will not.
	
	The replacement index will be "0". If such an index already exists
	in the map, it will be "00", and so on.
		
	Any maps that are modified by the script will be left open and not saved.
	This makes it easier for you to verify the changes. You can Save All if you
	don't want to check and save each one manually.

	If you have a Project loaded, the project's directories will be scanned.
	Otherwise, you'll be prompted to select a directory to scan.
	
	If you have many maps, this script can take a while to run!
	
	You should only need to run this script once per pre-1.10.3 Project.
	You can uninstall it when you're done, or comment out the last 3 lines so
	it doesn't clutter your Map menu, in which case you can still run the script
	via Search Actions.
*/

let addOutputIndex = tiled.registerAction("AddOutputIndex", function(action) {	
	function fixIndex(map) {
		let newIndexCharacter = "0";
		let newIndex = newIndexCharacter;
		
		let layersToRename = [];
		let hasNamedIndices = false;
		function checkLayer(layer) {
			if(!layer) return;
			if(layer.isGroupLayer || layer.isTileMap) {
				//process over its child layers recursively:
				for(let gi = 0; gi < layer.layerCount; ++gi) {
					checkLayer(layer.layerAt(gi));
				}
			} else { //regular layer that may be an output layer
				let layerName = layer.name;
				//to fix commented-out layers, strip the comment bit:
				layerName.replace(/^(\/\/|#)\s*/, '');
				if(layerName.indexOf("output_") == 0) //output with unnamed index
					layersToRename.push(layer);
				else {
					//the name has output but not output_, it must have a named output index
					if(layerName.indexOf("output") == 0)
						hasNamedIndices = true;
					//If our new index would conflict with an existing index, change it:
					while(layerName.indexOf("output"+newIndex+"_") == 0)
						newIndex += newIndexCharacter;
				}
			}
		}
		checkLayer(map);
		
		if(hasNamedIndices && layersToRename.length > 0) {
			map.macro("Add Output Index", function() {
				for(layer of layersToRename)
					layer.name = layer.name.replace("output_", "output"+newIndex+"_");
				tiled.log("Renamed "+layersToRename.length+" layer(s) in "+map.fileName);
			});
			
			return layersToRename.length;
		}
		return 0;
	}
	
	let maps = [];
	
	//Helper function that returns a TileMap if it's already open
	function getOpenMap(file) {
		for(asset of tiled.openAssets) {
			if(asset.fileName == file && asset.isTileMap)
				return asset;
		}
		return null;
	}
	
	//Recursively add all the maps in a folder to maps
	let checkedFolders = {};
	function collectMaps(folder) {
		let canonicalPath = FileInfo.canonicalPath(folder);
		if(checkedFolders[canonicalPath]) return;
		
		checkedFolders[canonicalPath] = true;
		//First, get all the files in this folder
		let files = File.directoryEntries(folder, File.Files | File.Readable | File.NoDotAndDotDot);
		for(file of files) {
			let path = folder+"/"+file;
			let format = tiled.mapFormatForFile(path);
			if(format) {
				let map = getOpenMap(path);
				if(map)
					maps.push(map);
				else
					maps.push(path);
			} //else there's no map format that can read this file, it's not a Tiled map, skip it.
		}
		//Then, look at any subfolders:
		files = File.directoryEntries(folder, File.Dirs | File.Readable | File.NoDotAndDotDot);
		for(file of files) {
			collectMaps(folder+"/"+file);
		}
	}
	
	let folders;
	if(tiled.project && tiled.projectFilePath.length > 0)
		folders = tiled.project.folders;
	else
		folders = [tiled.promptDirectory(null, "Select a directory to scan")];
	
	for(folder of folders)
		collectMaps(folder);
	
	let previousAsset = tiled.activeAsset;
	let totalLayersChanged = 0;
	
	for(map of maps) {
		if(map.isTileMap) {
			totalLayersChanged += fixIndex(map);
		} else { //a path
			map = tiled.open(map);
			let layersChanged = fixIndex(map);
			totalLayersChanged += layersChanged;
			if(layersChanged == 0) //leave modified maps open for inspection
				tiled.close(map);
		}
	}
	
	if(totalLayersChanged == 0)
		tiled.log("No maps were found to need output index modification. No changes made.");
	if(previousAsset)
		tiled.activeAsset = previousAsset;
});
addOutputIndex.text = "Add Output Indices";

//Add this action to the Map menu:
tiled.extendMenu("Map", [
	{ action: "AddOutputIndex", before: "AutoMapWhileDrawing" }
]);
