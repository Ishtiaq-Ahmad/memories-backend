import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
    try {
        console.log('backend', req.headers.authorization);

        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;
        // const googleAuthKey = process.env.GOOGLE_AUTH_KEY;
        // console.log('googleAuthKey', googleAuthKey)
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData?.id;
        } else {
            // console.log('called here', token)
            decodedData = jwt.verify(token, 'test');
            // sub is simply a google name for a specific id that differentiate every single user
            // console.log('decode', decodedData)
            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.error(error);
    }
}

export default auth;