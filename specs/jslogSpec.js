describe("Traces", function() {
	beforeEach(function() {
	});


	it("Sends a debug trace", function() {
		var defaultAppender = sinon.spy();

		JSLog.config.category("org.test")
		.appender(defaultAppender)
		.level('DEBUG');

		var Logger = JSLog.getLogger("org.test");
		Logger.debug("foo");
		Should(defaultAppender.calledWith({level:"debug", trace:"foo"})).be.true();

	});

	it("Doesn't send debug trace on info appender", function() {
		var defaultAppender = sinon.spy();

		JSLog.config.category("org.test")
		.appender(defaultAppender)
		.level('INFO');
		
		var Logger = JSLog.getLogger("org.test");
		Logger.debug("foo");
		Should(defaultAppender.calledWith({level:"debug", trace:"foo"})).be.false();

	});
});