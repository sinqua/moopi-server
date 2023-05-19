import { Request, Response } from "express";
import axios from "axios";

export async function DiscordLogin(req: Request) {
    let result;

    const data = {
        client_id: process.env.DISCORD_CLIENT_ID,
        scope: "email",
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }

    await axios.post('https://discord.com/api/oauth2/token', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            // console.log("token authorization success", response.data);
            result = response.data;
        })
        .catch((error) => {
            console.log("token authorization fail");
            result = error.data;
        });

    return result;
}

export async function GetDiscordUserInfo(access_token: string) {
    let result;

    await axios.get('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
        .then((response) => {
            // console.log("get information success", response.data);
            result = response.data;
        })
        .catch((error) => {
            console.log("get information fail", error.data);
            result = error;
        });

    return result;
}