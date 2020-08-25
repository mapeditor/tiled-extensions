/*
 * tile-rectangle.js
 *
 * Example tool that draws a custom tile rectangle using the current brush.
 *
 * Rather than simply repeating the brush, the corners are not repeated and the
 * sides are repeated only in one direction. The remaining center part of the
 * brush is repeated in all directions.
 */

/* global tiled, TileLayer, TileMap */

tiled.registerTool("PaintTileRectangle", {
	name: "Paint Tile Rectangle",
	icon: "tile-rectangle.svg",

	activated() {
		this.edit = null;
	},
	tilePositionChanged(curX, curY) {
		if (!tiled.mapEditor.currentBrush) {
			return;
		}

		const brush = tiled.mapEditor.currentBrush.layerAt(0);
		if (!brush || brush.width < 1 || brush.height < 1) {
			return;
		}

		// Don't stretch when the brush is too small, unless it's small in both
		// directions
		const stretchX = (brush.width > 1 || brush.height == 1);
		const stretchY = (brush.height > 1 || brush.width == 1);

		const preview = new TileMap();

		const tileLayer = new TileLayer();
		preview.addLayer(tileLayer);

		const edit = tileLayer.edit();

		let startX = curX;
		let startY = curY;
		let endX = curX;
		let endY = curY;

		if (this.startX) {
			if (!stretchX) {
				curX = this.startX;
			}
			if (!stretchY) {
				curY = this.startY;
			}

			startX = Math.min(this.startX, curX);
			startY = Math.min(this.startY, curY);
			endX = Math.max(this.startX, curX);
			endY = Math.max(this.startY, curY);
		} else {
			if (stretchX) {
				startX = curX - 1;
				endX = curX + 1;
			}
			if (stretchY) {
				startY = curY - 1;
				endY = curY + 1;
			}
		}

		for (let y = startY; y <= endY; ++y) {
			for (let x = startX; x <= endX; ++x) {
				let brushX;
				let brushY;

				if (y == startY) {
					brushY = 0;
				} else if (y == endY) {
					brushY = brush.height - 1;
				} else {
					brushY = Math.min((y - startY - 1) % (brush.height - 2) + 1, brush.height - 1);
				}

				if (x == startX) {
					brushX = 0;
				} else if (x == endX) {
					brushX = brush.width - 1;
				} else {
					brushX = Math.min((x - startX - 1) % (brush.width - 2) + 1, brush.width - 1);
				}

				const tile = brush.tileAt(brushX, brushY);
				edit.setTile(x, y, tile);
			}
		}

		edit.apply();

		this.preview = preview;
	},
	updateStatusInfo() {},
	mousePressed(/* button, x, y, modifiers */) {
		const tileLayer = this.map.currentLayer;
		if (!tileLayer.isTileLayer) {
			return;
		}

		this.startX = this.tilePosition.x;
		this.startY = this.tilePosition.y;
	},
	mouseReleased(/* button, x, y, modifiers */) {
		this.startX = undefined;
		this.startY = undefined;
		this.map.merge(this.preview, false);
		this.preview = new TileMap();
	},
});
