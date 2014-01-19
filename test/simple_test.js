var assert = require('chai').assert,
    expect = require('chai').expect,
    webdriverjs = require('webdriverjs');
var env = GLOBAL.env = {};
var client = {};

console.log('TRAVIS: %s', process.env.TRAVIS || 'no');
console.log('TEST_RUN_LOCAL: %s', process.env.TEST_RUN_LOCAL || '-');

process.on('uncaughtException', function(e) {
    console.log(require('util').inspect(e, {showHidden:true}));
});


console.log('process.env.TRAVIS: %s', process.env.TRAVIS);
console.log('(process.env.TRAVIS === \'true\'): %s', (process.env.TRAVIS === 'true'));

console.log('(process.env.TEST_RUN_LOCAL === false): %s', (process.env.TEST_RUN_LOCAL === 'false'));
console.log('(process.env.TEST_RUN_LOCAL || false): %s', (process.env.TEST_RUN_LOCAL || false));
console.log('((process.env.TEST_RUN_LOCAL || false) === false): %s', ((process.env.TEST_RUN_LOCAL || false) !== 'true'));
console.log('process.env.TRAVIS && !(process.env.TEST_RUN_LOCAL || false): %s', ((process.env.TRAVIS === 'true') && !(process.env.TEST_RUN_LOCAL || false)));
console.log('process.env.TRAVIS === true && !(process.env.TEST_RUN_LOCAL || false): %s', ((process.env.TRAVIS === 'true') && (process.env.TEST_RUN_LOCAL === 'false')));

//if (process.env.TRAVIS && !(process.env.TEST_RUN_LOCAL || false)) {
if ((process.env.TRAVIS === 'true')) {
    console.log('running tests on SauceLabs using sauce connect...');
    console.log('TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')');

    var BROWSERNAME = process.env._BROWSER || process.env.BROWSER || 'chrome';
    var BROWSERVERSION = process.env._VERSION || process.env.VERSION || '*';
    var BROWSERPLATFORM = process.env._PLATFORM || process.env.PLATFORM || 'Linux';
    console.log('BROWSERNAME: ' + BROWSERNAME);
    console.log('BROWSERVERSION: ' + BROWSERVERSION);
    console.log('BROWSERPLATFORM: ' + BROWSERPLATFORM);

    var options = { desiredCapabilities: {
            browserName: BROWSERNAME,
            version: BROWSERVERSION,
            platform: BROWSERPLATFORM,
            tags: ['examples'],
            name: 'Run a \'simple test\' using webdriverjs/Selenium.',
        },
        // for w/o sauce connect
        //      host: 'ondemand.saucelabs.com',
        //      port: 80,
        // use with sauce connect:
        host: 'localhost',
        port: 4445,
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        logLevel: 'verbose'
    };
}
else
{
    console.log('running tests locally...');
    options = {
        desiredCapabilities: {
            browserName: 'chrome'
        },
        host: 'localhost',
        port: 4444
    };
}

describe('Run a \'simple test\' using webdriverjs/Selenium.', function() {

    var client = {};

    before(function(done) {
        this.timeout(10000);
        client = webdriverjs.remote(options);

        // Add a helper command
        client.addCommand('hasText', function(selector, text, callback) {
            this.getText(selector, function(err, result) {
                assert.strictEqual(err, null);
                assert.strictEqual(result, text); // TDD
                expect(result).to.have.string(text); // BDD
            })
            .call(callback);
        });

        client.init()
        .call(done);
    });

    beforeEach(function(done) {
        this.timeout(10000); // some time is needed for the browser start up, on my system 3000 should work, too.
        // Navigate to the URL for each test
        //client.url('http://localhost:3000')
        client.url('http://localhost')
        .call(done);
    });

    it('should be able to view the home page', function(done) {
        client.hasText('#title', 'Library')
        .call(done);
    });

    after(function(done) {
        client.end().call(done);
    });

});
