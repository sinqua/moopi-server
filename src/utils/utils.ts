import { connection } from "../index";

export function SaveUserToken (platform: string, data : any) {
    connection.query("INSERT INTO user (platform, access_token) VALUES (?, ?)", [platform, data.access_token], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
    });
}

export function PublicToLocalhost(platform: string, req: any) {
    let ip = req.ip.replace("::ffff:", "");
    console.log(`Login Request from ${ip}`);

    let whitelist = [""];
    let redirect = process.env.REDIRECT_URI;
    if (whitelist.includes(ip)) {
        redirect = `http://localhost:5137/login/${platform}`;
    }
    return redirect;
}