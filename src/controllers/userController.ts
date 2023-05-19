
import { Request, Response } from "express";
import { connectDB } from "../db/connect";
import { RowDataPacket } from "mysql2";

import { GetDiscordUserInfo, DiscordLogin } from "../apis/discord"
import { GetTwitterUserInfo, TwitterLogin } from "../apis/twitter"
import { GetKakaoUserInfo, KakaoLogin } from "../apis/kakao"


export async function IsUserRegistered(req: Request, res: Response) {
    const platform = req.body.platform;

    if (platform === "kakao") {
        KakaoLogin(req).then((result: any) => {
            CheckUserToken("kakao", result).then((exist : boolean) => {
                if(exist) {
                    GetKakaoUserInfo(result.access_token).then((platformUserInfo: any) => {
                        CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                
                            return res.status(200).send({ "userId": userResult.user_id });
                        });
                    });
                }
                else {
                    InsertToken(platform, result).then((tokenId: any) => {
                        GetKakaoUserInfo(result.access_token).then((platformUserInfo: any) => {
                            CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                                if (!userResult) {
                                    SignUpUser(tokenId, platform, platformUserInfo.id).then((newUserId: any) => {
                                        return res.status(200).send({ "userId": newUserId });
                                    });
                                }
                                else {
                                    UpdateTokenId(userResult.user_id, tokenId).then(() => {
                                        return res.status(200).send({ "userId": userResult.user_id });
                                    });
                                }
                            });
                        });
                    });
                }
            })
        });
    }
    else if (platform === "twitter") {
        TwitterLogin(req).then((result: any) => {
            CheckUserToken("twitter", result).then((exist : boolean) => {
                if(exist) {
                    GetTwitterUserInfo(result.access_token).then((platformUserInfo: any) => {
                        CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                
                            return res.status(200).send({ "userId": userResult.user_id });
                        });
                    });
                }
                else {
                    InsertToken(platform, result).then((tokenId: any) => {
                        GetTwitterUserInfo(result.access_token).then((platformUserInfo: any) => {
                            CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                                if (!userResult) {
                                    SignUpUser(tokenId, platform, platformUserInfo.id).then((newUserId: any) => {
                                        return res.status(200).send({ "userId": newUserId });
                                    });
                                }
                                else {
                                    UpdateTokenId(userResult.user_id, tokenId).then(() => {
                                        return res.status(200).send({ "userId": userResult.user_id });
                                    });
                                }
                            });
                        });
                    });
                }
            })
        });
    }
    else if (platform === "discord") {
        DiscordLogin(req).then((result: any) => {
            CheckUserToken("discord", result).then((exist : boolean) => {
                if(exist) {
                    GetDiscordUserInfo(result.access_token).then((platformUserInfo: any) => {
                        CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                
                            return res.status(200).send({ "userId": userResult.user_id });
                        });
                    });
                }
                else {
                    InsertToken(platform, result).then((tokenId: any) => {
                        GetDiscordUserInfo(result.access_token).then((platformUserInfo: any) => {
                            CheckRegisteredUser(platform, platformUserInfo).then((userResult: any) => {
                                if (!userResult) {
                                    SignUpUser(tokenId, platform, platformUserInfo.id).then((newUserId: any) => {
                                        return res.status(200).send({ "userId": newUserId });
                                    });
                                }
                                else {
                                    UpdateTokenId(userResult.user_id, tokenId).then(() => {
                                        return res.status(200).send({ "userId": userResult.user_id });
                                    });
                                }
                            });
                        });
                    });
                }
            })
        });
    }
}

export async function CheckUserToken(platform: string, token_data: any) {
    const DB = await connectDB.getConnection();

    let query = `SELECT * FROM token WHERE platform = "${platform}" AND refresh_token = "${token_data.refresh_token}"`;

    let [rows] = await DB.query(query);
    let result = rows as RowDataPacket[];

    DB.release();

    return result.length > 0 ? true : false;
}

export async function InsertToken(platform: string, token_data: any) {
    const DB = await connectDB.getConnection();

    console.log("token data", token_data)

    let query = `INSERT INTO token (platform, access_token, expires_in, refresh_token)
                    VALUES ("${platform}", "${token_data.access_token}", ${token_data.expires_in}, "${token_data.refresh_token}")`;

    let row = await DB.query(query);
    let result = row[0] as RowDataPacket;

    DB.release();

    return result.insertId;
}


export async function CheckRegisteredUser(platform: string, platformUserInfo: any) {
    const DB = await connectDB.getConnection();

    let query = `SELECT * FROM user WHERE platform = "${platform}" AND id = "${platformUserInfo.id}"`;

    let [rows] = await DB.query(query);
    let result = rows as RowDataPacket[];

    DB.release();

    if(result.length > 0) { // 가입된 유저
        console.log("가입된 유저입니다.");

        if(platform === "discord") {
            InsertDiscordUserInfo(result[0].user_id, platformUserInfo);
        }
        else if(platform === "twitter") {
            InsertTwitterUserInfo(result[0].user_id, platformUserInfo);
        }
        else if(platform === "kakao") {
            InsertKakaoUserInfo(result[0].user_id, platformUserInfo);
        }

        return result[0];
    }
    else { // 가입되지 않은 유저
        console.log("계정이 없습니다.");

        return false;
    }
}


export async function UpdateTokenId(userId: number, tokenId: number) {
    const DB = await connectDB.getConnection();

    let query = `UPDATE user SET token_id = ${tokenId} where user_id = ${userId}`;
    await DB.query(query);

    DB.release();
}

export async function SignUpUser(tokenId: number, platform: string, id: string) {
    const DB = await connectDB.getConnection();

    let query = `INSERT INTO user (token_id, platform, id, nickname)
                    VALUES (${tokenId}, "${platform}", "${id}", "${"S2XYoon"}")`;

    let row = await DB.query(query);
    let result = row[0] as RowDataPacket;

    DB.release();

    return result.insertId;
}


// 디스코드 유저 데이터 저장
export async function InsertDiscordUserInfo(userId: number, discordUserInfo: any) {
    const DB = await connectDB.getConnection();

    console.log(discordUserInfo);

    let query = `INSERT INTO user_discord (user_id, id, username, global_name, avatar, discriminator, public_flags, flags,
                    banner, banner_color, accent_color, locale, mfa_enabled, premium_type, avatar_decoration, email, verified)
                    VALUES (${userId}, '${discordUserInfo.id}', '${discordUserInfo.username}', '${discordUserInfo.global_name}',
                    '${discordUserInfo.avatar}', '${discordUserInfo.discriminator}', ${discordUserInfo.public_flags}, ${discordUserInfo.flags},
                    '${discordUserInfo.banner}', ${discordUserInfo.banner_color}, ${discordUserInfo.accent_color},
                    "${discordUserInfo.locale}", '${discordUserInfo.mfa_enabled}', ${discordUserInfo.premium_type},
                    '${discordUserInfo.avatar_decoration}', '${discordUserInfo.email}', '${discordUserInfo.verified}');`;

    await DB.query(query);
}

export async function InsertTwitterUserInfo(userId: number, twitterUserInfo: any) {
    const DB = await connectDB.getConnection();

    console.log(twitterUserInfo);

    let query = `INSERT INTO user_twitter (user_id, id, name, username) VALUES (${userId}, '${twitterUserInfo.id}', '${twitterUserInfo.name}', '${twitterUserInfo.username}');`;

    await DB.query(query);
}

export async function InsertKakaoUserInfo(userId: number, kakaoUserInfo: any) {
    const DB = await connectDB.getConnection();

    console.log(kakaoUserInfo);

    let query = `INSERT INTO user_kakao (user_id, id, name, email, age_range, birthyear, birthday, gender) VALUES (${userId}, '${kakaoUserInfo.id}', '${kakaoUserInfo.properties.nickname}', '${kakaoUserInfo.kakao_account.email}', '${kakaoUserInfo.kakao_account.age_range}', '${kakaoUserInfo.kakao_account.birthyear}', '${kakaoUserInfo.kakao_account.birthday}', '${kakaoUserInfo.kakao_account.gender}');`;

    await DB.query(query);
}