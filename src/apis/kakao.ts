import { Request } from "express";
import axios from "axios";

export async function KakaoLogin(req: Request) {
    let result;
    const KAKAO_CODE = req.body.code;
    const data = `grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${KAKAO_CODE}`;

    await axios.post('https://kauth.kakao.com/oauth/token', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            console.log("token authorization success", );
            result = response.data;

        })
        .catch((error) => {
            console.log("token authorization fail", );
            result = error.data;
        });

    return result;
}


export async function GetKakaoUserInfo(access_token: string) {
    let result;

    await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
        .then((response) => {
            console.log("get information success", );
            result = response.data
        })
        .catch((error) => {
            console.log("get information fail", );
            result = error.data;
        });

    return result;
}

