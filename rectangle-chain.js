/*
 * rectangle-chain.js
 *
 * Example tool that places rectangle objects when the mouse is dragged over
 * the map.
 */

/* global tiled, MapObject */

tiled.registerTool("RectangleChain", {
	name: "Draw Rectangle Chain",
	icon: "rectangle-chain.svg",

	mouseMoved(x, y, /* modifiers */) {
		if (!this.pressed) {
			return;
		}

		var dx = Math.abs(this.x - x);
		var dy = Math.abs(this.y - y);

		this.distance += Math.sqrt(dx*dx + dy*dy);
		this.x = x;
		this.y = y;

		if (this.distance > 32) {
			var objectLayer = this.map.currentLayer;

			if (objectLayer && objectLayer.isObjectLayer) {
				var object = new MapObject(MapObject.Rectangle, ++this.counter);
				object.x = Math.min(this.lastX, x);
				object.y = Math.min(this.lastY, y);
				object.width = Math.abs(this.lastX - x);
				object.height = Math.abs(this.lastY - y);
				objectLayer.addObject(object);
				object.selected = true;
			}

			this.distance = 0;
			this.lastX = x;
			this.lastY = y;
		}
	},

	mousePressed(button, x, y, /* modifiers */) {
		this.pressed = true;
		this.x = x;
		this.y = y;
		this.distance = 0;
		this.counter = 0;
		this.lastX = x;
		this.lastY = y;
	},

	mouseReleased(/* button, x, y, modifiers */) {
		this.pressed = false;
	},
});
