import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "@/models/User";

dotenv.config();

const router: Router = Router();

router.get("/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Authorization code is missing" });
    }

    try {
        // exchange code for tokens
        const tokenResponse = await axios.post(`https://$process.env.AUTH0_DOMAIN}/oauth/token`, {
            grant_type: "authorization_code",
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: `http://localhost:${process.env.PORT}/callback`
        });

        const { access_token, id_token } = tokenResponse.data;

        // decode ID token to get user info
        const userInfoResponse = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        const { sub: auth0Id, email, name, picture } = userInfoResponse.data;

        // check if user exists
        let user = await User.findOne({ auth0Id: auth0Id });

        if (!user) {
            user = new User({ auth0Id, email, name, picture });
            await user.save();
        }

        res.json({ message: "User authenticated successfully", user });
    } catch (error) {
        console.error("Error during authentication", error);
        res.status(500).json({
            message: "Error handling callback",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

router.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const token = jwt.sign({ sub: username }, process.env.AUTH0_CLIENT_SECRET || "", {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        expiresIn: "1h",
    });

    res.json({ token });
});

router.get("/profile", (req, res) => {
    res.json({ message: "This is a protected profile route" });
});

export default router;
