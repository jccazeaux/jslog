/*!
 * jslog - 0.1.0 https://github.com/jccazeaux/jslog
 *  Copyright (c) 2015 Jean-Christophe Cazeaux.
 *  Licensed under the MIT license.
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JSLog"] = factory();
	else
		root["JSLog"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * Log levels as integer to help tests
	 */
	var levels = {
		OFF: -1,
		'DEBUG': 0,
		'INFO': 1,
		'WARN': 2,
		'ERROR': 3,
		'FATAL': 4
	};
	/**
	 * Configuration of categories
	 */
	var categoriesConfig = {};

	/**
	 * Configuration object that contains all configuration functions
	 */
	var jslogConfig = {
		/**
	  * Start a new config catetgory
	  */
		category: function (category) {
			categoriesConfig[category] = categoriesConfig[category] || {
				appenders: [],
				level: levels.OFF,
				pattern: '%s',
				additivity: true
			};
			return {
				/**
	    * Adds an appender with its layout
	    */
				appender: function (appender, layout) {
					categoriesConfig[category].appenders.push({ appender: appender, layout: layout });
					return this;
				},
				/**
	    * Configures level for this category
	    */
				level: function (level) {
					categoriesConfig[category].level = levels[level];
					return this;
				},
				/**
	    * Configures additivity for this category
	    */
				additivity: function (additivity) {
					categoriesConfig[category].additivity = additivity;
					return this;
				}
			};
		}
	};

	/**
	 * Main JSLog object API
	 */
	var jslog = {
		/**
	  * Configuration object
	  */
		config: jslogConfig,
		/**
	  * Gets a new logger on category
	  */
		getLogger: function (category) {
			return new JsLogger(category);
		}
	};

	/**
	 * Logger object
	 */
	function JsLogger(category) {
		var that = this;
		var categories = findActiveCategories(category);

		['debug', 'info', 'warn', 'error'].forEach(function (level) {
			that[level] = function (trace) {
				var currentCategory;
				var currentAppender;
				for (var i = 0; i < categories.length; i++) {
					currentCategory = categories[i];
					if (currentCategory.level !== levels.OFF && currentCategory.level <= levels[level.toUpperCase()]) {
						for (var j = 0; j < currentCategory.appenders.length; j++) {
							currentAppender = currentCategory.appenders[j];
							currentAppender.appender({
								level: level,
								trace: trace
							});
						}
					}
				}
			};
		});
	}

	function findActiveCategories(category) {
		var res = [];
		// First search if category exists
		if (categoriesConfig[category]) {
			res.push(categoriesConfig[category]);
		}
		// Then search with all dots
		var lastDotIndex = category.indexOf(".");
		var currentCategory;
		while (lastDotIndex != -1) {
			currentCategory = category.substring(0, category.lastIndexOf("."));
			if (categoriesConfig[currentCategory]) {
				res.push(categoriesConfig[currentCategory]);
				// If additivity is false, break here
				if (categoriesConfig[currentCategory].additivity === false) {
					break;
				}
			}
			lastDotIndex = currentCategory.indexOf(".");
		}
		return res;
	}

	module.exports = jslog;

/***/ }
/******/ ])
});
;