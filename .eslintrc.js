module.exports = {
	"env": {
		"commonjs": true,
		"es2017": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 7
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"semi": [
			"error",
			"always"
		]
	},
	"globals": {
		"File": "readonly",
		"FileInfo": "readonly",
		"MapObject": "readonly",
		"TextFile": "readonly",
		"TileLayer": "readonly",
		"TileMap": "readonly",
		"tiled": "readonly"
	}
};
