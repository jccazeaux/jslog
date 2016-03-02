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
}
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
	category: function(category) {
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
			appender: function(appender, layout) {
				categoriesConfig[category].appenders.push({appender: appender, layout: layout});
				return this;
			},
			/**
			 * Configures level for this category
			 */
			level: function(level) {
				categoriesConfig[category].level = levels[level];
				return this;
			},
			/**
			 * Configures additivity for this category
			 */
			additivity: function(additivity) {
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
	getLogger: function(category) {
		return new JsLogger(category);
	}
};

/**
 * Logger object
 */
function JsLogger(category) {
	var that = this;
	var categories = findActiveCategories(category);

	['debug', 'info', 'warn', 'error'].forEach(function(level) {
		that[level] = function(trace) {
			var currentCategory;
			var currentAppender;
			for (var i = 0 ; i < categories.length ; i++) {
				currentCategory = categories[i];
				if (currentCategory.level !== levels.OFF && currentCategory.level <= levels[level.toUpperCase()]) {
					for (var j = 0 ; j < currentCategory.appenders.length ; j++) {
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
	while(lastDotIndex != -1) {
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