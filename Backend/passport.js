import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
    new GoogleStrategy(
        {
            clientID: "443758568479-p54v7afhsgbf0oegtsn707bd1072v4n0.apps.googleusercontent.com",
            clientSecret: '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',
            callbackURL: "/auth/google/callback",
            scope: ["profile","email"],
        },
        function(accessToken,refreshToken,profile,callback){
            callback(null,profile);
        }
    )
);

passport.serializeUser((user,done) => {
    done(null,user);
});

passport.deserializeUser((user,done) => {
    done(null,user);
});