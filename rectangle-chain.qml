/*
 * rectangle-chain.qml
 *
 * Example tool that places rectangle objects when the mouse is dragged over
 * the map.
 */

// qmllint disable unqualified unresolved-type

import Tiled

Tool {
    shortName: "RectangleChain"
    name: "Draw Rectangle Chain"
    icon: "rectangle-chain.svg"

    property bool pressed: false
    property real x: 0
    property real y: 0
    property real distance: 0
    property int counter: 0
    property real lastX: 0
    property real lastY: 0

    function mouseMoved(x, y /*, modifiers */) {
        if (!pressed) {
            return;
        }

        var dx = Math.abs(this.x - x);
        var dy = Math.abs(this.y - y);

        distance += Math.sqrt(dx*dx + dy*dy);
        this.x = x;
        this.y = y;

        if (distance > 32) {
            var objectLayer = map.currentLayer;

            if (objectLayer && objectLayer.isObjectLayer) {
                var object = new MapObject(MapObject.Rectangle, ++counter);
                object.x = Math.min(lastX, x);
                object.y = Math.min(lastY, y);
                object.width = Math.abs(lastX - x);
                object.height = Math.abs(lastY - y);
                objectLayer.addObject(object);
                object.selected = true;
            }

            distance = 0;
            lastX = x;
            lastY = y;
        }
    }

    function mousePressed(button, x, y /*, modifiers */) {
        pressed = true;
        this.x = x;
        this.y = y;
        distance = 0;
        counter = 0;
        lastX = x;
        lastY = y;
    }

    function mouseReleased(/* button, x, y, modifiers */) {
        pressed = false;
    }
}
