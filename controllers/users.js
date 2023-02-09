// bcrypt is use to hashed password
// this is a safe way to store the users
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userData from '../models/userData.js';


export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await userData.findOne({ email });
        console.log("existing user", existingUser)
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid password' });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        // test is secrect string that only developer knows. normally it should be in seperate file like .env
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong in the server.' })
    }
}
export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {

        const existingUser = await userData.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await userData.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong in the server.' })
    }
}
