var vows = require('vows');
var assert = require('assert');
var util = require('util');
var gamewallet = require('passport-gamewallet');


vows.describe('passport-gamewallet').addBatch({
  
  'module': {
    'should report a version': function () {
      assert.isString(gamewallet.version);
    }
  }
  
}).export(module);
