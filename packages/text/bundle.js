(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["DocereText"] = factory(require("React"));
	else
		root["DocereText"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_react__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _use_get_component_tree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-get-component-tree */ \"./src/use-get-component-tree.ts\");\n/* harmony import */ var _use_highlight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-highlight */ \"./src/use-highlight.ts\");\n/* harmony import */ var _use_component_did_mount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-component-did-mount */ \"./src/use-component-did-mount.ts\");\n\n\n\n\nfunction renderComponentTree(tree, props) {\n    if (tree == null || typeof tree === 'string')\n        return tree;\n    return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](tree.componentClass, Object.assign(Object.assign({}, props.customProps), tree.props), tree.children.map(child => renderComponentTree(child, props)));\n}\nfunction DocereTextView(props) {\n    const wrapperRef = react__WEBPACK_IMPORTED_MODULE_0__[\"useRef\"]();\n    const componentTree = Object(_use_get_component_tree__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(props);\n    Object(_use_highlight__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(wrapperRef, componentTree, props.highlight, props.setHighlightAreas);\n    const tree = renderComponentTree(componentTree, props);\n    Object(_use_component_did_mount__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(props, tree);\n    return (react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\", { ref: wrapperRef }, tree));\n}\nDocereTextView.defaultProps = {\n    customProps: {},\n    components: {},\n    ignore: [],\n    highlight: [],\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (react__WEBPACK_IMPORTED_MODULE_0__[\"memo\"](DocereTextView, function areEqual(prevProps, nextProps) {\n    const equalProps = Object.keys(prevProps).every(k => {\n        if (k === 'customProps')\n            return true;\n        return prevProps[k] === nextProps[k];\n    });\n    const equalCustomProps = Object.keys(prevProps.customProps).every(k => {\n        return prevProps.customProps[k] === nextProps.customProps[k];\n    });\n    return equalProps && equalCustomProps;\n}));\n\n\n//# sourceURL=webpack://DocereText/./src/index.tsx?");

/***/ }),

/***/ "./src/use-component-did-mount.ts":
/*!****************************************!*\
  !*** ./src/use-component-did-mount.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return useComponentDidMount; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction useComponentDidMount(props, tree) {\n    const [isReady, setIsReady] = react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"](false);\n    react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"](() => {\n        if (!isReady && tree != null) {\n            if (props.onLoad != null)\n                props.onLoad(true);\n            setIsReady(true);\n        }\n    }, [tree]);\n    react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"](() => {\n        if (props.onLoad != null)\n            props.onLoad(false);\n        setIsReady(false);\n    }, [props.xml, props.node, props.url, props.html]);\n}\n\n\n//# sourceURL=webpack://DocereText/./src/use-component-did-mount.ts?");

/***/ }),

/***/ "./src/use-get-component-tree.ts":
/*!***************************************!*\
  !*** ./src/use-get-component-tree.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return useGetComponentTree; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\n\nfunction NoopComp(props) { return props.children; }\nfunction getComponentClass(el, props) {\n    const foundIgnore = props.ignore.some(selector => el.matches(selector));\n    if (foundIgnore)\n        return null;\n    const selector = Object.keys(props.components).find(selector => el.matches(selector));\n    if (selector == null)\n        return NoopComp;\n    return props.components[selector];\n}\nfunction nodeToComponentTree(root, props, rootIndex) {\n    if (root == null)\n        return null;\n    if (root.nodeType === 3)\n        return root.textContent;\n    if (root.nodeType !== 1)\n        return null;\n    const element = root;\n    const componentClass = getComponentClass(element, props);\n    if (componentClass == null)\n        return null;\n    return {\n        componentClass,\n        props: {\n            attributes: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"attrsToObject\"])(element.attributes),\n            key: rootIndex,\n        },\n        children: Array.from(element.childNodes).map((childNode, index) => nodeToComponentTree(childNode, props, `${rootIndex}-${index}`))\n    };\n}\nfunction prepareNode(node, props) {\n    if (node instanceof XMLDocument || node instanceof HTMLDocument)\n        node = node.documentElement;\n    if (props.rootSelector != null)\n        node = node.querySelector(props.rootSelector);\n    return nodeToComponentTree(node, props);\n}\nfunction useGetComponentTree(props) {\n    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"](null);\n    react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"](() => {\n        if (props.components == null)\n            return;\n        if (props.url != null) {\n            Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"fetchXml\"])(props.url).then(node => setNode(prepareNode(node, props)));\n        }\n        else {\n            let tmpNode;\n            if (props.node != null) {\n                tmpNode = props.node;\n            }\n            else if (props.xml != null) {\n                const parser = new DOMParser();\n                tmpNode = parser.parseFromString(props.xml, 'application/xml');\n            }\n            else if (props.html != null) {\n                const parser = new DOMParser();\n                tmpNode = parser.parseFromString(props.html, 'text/html');\n            }\n            setNode(prepareNode(tmpNode, props));\n        }\n    }, [props.html, props.node, props.url, props.xml, props.components]);\n    return node;\n}\n\n\n//# sourceURL=webpack://DocereText/./src/use-get-component-tree.ts?");

/***/ }),

/***/ "./src/use-highlight.ts":
/*!******************************!*\
  !*** ./src/use-highlight.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return useHighlight; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction wrap(node, index, found) {\n    const textRange = document.createRange();\n    textRange.setStart(node, index);\n    textRange.setEnd(node, index + found.length);\n    const el = document.createElement('mark');\n    textRange.surroundContents(el);\n    return el;\n}\nfunction useHighlight(ref, componentTree, highlight, setHighlightAreas) {\n    react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"](() => {\n        if (ref.current == null || highlight == null || highlight.length === 0)\n            return;\n        const treeWalker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);\n        const map = new Map();\n        const re = new RegExp(highlight.join('|'), 'gui');\n        const toppers = [];\n        while (treeWalker.nextNode()) {\n            let result;\n            const indices = [];\n            while (result = re.exec(treeWalker.currentNode.textContent))\n                indices.push(result);\n            if (indices.length)\n                map.set(treeWalker.currentNode, indices);\n        }\n        for (const [node, indices] of map.entries()) {\n            let currentNode = node;\n            let prevIndex = 0;\n            let prevFoundLength = 0;\n            for (const result of indices) {\n                const mark = wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0]);\n                toppers.push(mark.getBoundingClientRect().top);\n                currentNode = currentNode.nextSibling.nextSibling;\n                prevIndex = result.index;\n                prevFoundLength = result[0].length;\n            }\n        }\n        setHighlightAreas(toppers.filter((v, i, a) => v > 0 && a.indexOf(v) === i));\n    }, [componentTree, highlight]);\n}\n\n\n//# sourceURL=webpack://DocereText/./src/use-highlight.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: attrsToObject, fetchXml */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"attrsToObject\", function() { return attrsToObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchXml\", function() { return fetchXml; });\nfunction fetchXml(url) {\n    return new Promise((resolve, reject) => {\n        var xhr = new XMLHttpRequest;\n        xhr.open('GET', url);\n        xhr.responseType = 'document';\n        xhr.overrideMimeType('text/xml');\n        xhr.onload = function () {\n            if (xhr.readyState === xhr.DONE && xhr.status === 200) {\n                if (xhr.responseXML == null) {\n                    reject(`Fetching XML of \"${url}\" failed`);\n                    return;\n                }\n                resolve(xhr.responseXML);\n            }\n        };\n        xhr.send();\n    });\n}\nfunction attrsToObject(attrs) {\n    const tmpAttrs = {};\n    for (const attr of attrs) {\n        tmpAttrs[attr.name] = attr.value;\n    }\n    return tmpAttrs;\n}\n\n\n\n//# sourceURL=webpack://DocereText/./src/utils.ts?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_react__;\n\n//# sourceURL=webpack://DocereText/external_%22React%22?");

/***/ })

/******/ });
});