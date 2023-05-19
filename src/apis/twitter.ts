import { Request } from "express";
import axios from "axios";

export async function TwitterLogin(req: Request) {
    let result;

    const data = {
        code: req.body.code,
        grant_type: "authorization_code",
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        code_verifier: "challenge"
    }

    await axios.post('https://api.twitter.com/2/oauth2/token', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${process.env.TWITTER_BASIC_TOKEN}`
        }
    })
        .then((response) => {
            console.log("token authorization success", response.data);
            result = response.data;
        })
        .catch((error) => {
            console.log("token authorization fail", );
            result = error.data;
        })

    return result;
}

export async function GetTwitterUserInfo(access_token: string) {
    let result;

    await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
        .then((response) => {
            console.log("get information success", response.data);
            result = response.data.data;
        })
        .catch((error) => {
            console.log("get information fail", error.data);
            result = error.data;
        });

    return result;
}