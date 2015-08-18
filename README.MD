# Passport-GameWallet

Based on [passport-paypal-oauth](http://github.com/jaredhanson/passport-paypal-oauth) by Jared Hanson


[Passport](http://passportjs.org/) strategy for authenticating with [GameWallet]
(https://www.gamewallet.co.uk/)
using the OAuth 2.0 API.

This module lets you authenticate using GameWallet in your Node.js applications.
By plugging into Passport, GameWallet authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-gamewallet

## Usage

#### Configure Strategy

The GameWallet authentication strategy authenticates users using a GameWallet
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a app ID, app secret, and callback URL.

    passport.use(new GameWalletStrategy({
        sandbox: true,
        clientID: GAMEWALLET_APP_ID,
        clientSecret: GAMEWALLET_APP_SECRET,
        callbackURL: 'http://localhost:3000/authcallback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ gameWalletId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'gamewallet'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/gamewallet',
      passport.authenticate('gamewallet'));

    app.get('/authcallback', 
      passport.authenticate('gamewallet', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](http://github.com/DriveAgency/passport-gamewallet/tree/master/examples/login).

Replace the GAMEWALLET_APP_ID and GAMEWALLET_APP_SECRET in app.js.

`npm install`

`npm start`

go to `http://localhost:3000`

## Tests

    $ npm install --dev
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
