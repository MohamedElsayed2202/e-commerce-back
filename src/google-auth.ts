import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const passportConfig  = (passport: any) => {
    passport.use(new GoogleStrategy({
        callbackURL: "http://localhost:8080/google",
        clientID: "873805703904-45cvgcovt42mkggp56l63gkjhfnb2d11.apps.googleusercontent.com",
        clientSecret: "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"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(33333);
            
            const email = profile.emails && profile.emails[0].value;
            console.log(email);
            
            return done(null, profile);
        } catch (err: any) {
            done(err);
        }
    }))
}