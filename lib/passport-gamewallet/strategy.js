/**
 * Module dependencies.
 */
var util = require('util')
  , conf = require('./conf')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The GameWallet authentication strategy authenticates requests by delegating to
 * GameWallet using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your application's App ID
 *   - `clientSecret`  your application's App Secret
 *   - `callbackURL`   URL to which GameWallet will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new GameWalletStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/gamewallet/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  this.baseUrl = options.sandbox ? conf.sandboxBaseUrl : conf.apiBaseUrl;
  options.authorizationURL = options.authorizationURL || this.baseUrl + '/oAuth/Authorise';
  options.tokenURL = options.tokenURL || this.baseUrl + '/oAuth/Token';

  OAuth2Strategy.call(this, options, verify);

  this.name = 'gamewallet';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from GameWallet.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `gamewallet`
 *   - `id`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this.baseUrl + '/api/Me', accessToken, function (err, body) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'gamewallet' };
      profile.id = json.id;
      profile.displayName = json.first_name + " " + json.last_name;
      profile.name = { familyName: json.last_name,
                       givenName: json.first_name};
      profile.avatarUrl = json.avatar_icon;
      profile.balance = json.balance;
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
