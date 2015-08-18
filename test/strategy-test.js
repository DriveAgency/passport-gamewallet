var vows = require('vows');
var assert = require('assert');
var util = require('util');
var GameWalletStrategy = require('passport-gamewallet/strategy');


vows.describe('GameWalletStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new GameWalletStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named gamewallet': function (strategy) {
      assert.equal(strategy.name, 'gamewallet');
    }
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new GameWalletStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        var body = '{ \
            "status": "SUCCESS", \
            "identity": { \
                "status": "ACTIVE", \
                "fullName": "Jared Hanson", \
                "userId": "123456789", \
                "firstName": "Jared", \
                "lastName": "Hanson", \
                "emails": ["jaredhanson@example.com"] \
            } \
        }';
        
        callback(null, body, undefined);
      };
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'gamewallet');
        assert.equal(profile.id, '123456789');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
        assert.lengthOf(profile.emails, 1);
        assert.equal(profile.emails[0].value, 'jaredhanson@example.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      }
    }
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new GameWalletStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      };
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      }
    }
  }
  
}).export(module);
