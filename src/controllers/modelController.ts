import { Request, Response } from 'express';

import { createPresignedUrlWithClient } from '../apis/aws';

export async function ReturnPresignedUrl (req: Request, res: Response) {
    const bucket = req.body.bucket;
    const key = req.body.key;

    const clientUrl = await createPresignedUrlWithClient('ap-northeast-2', bucket, key);

    res.send(clientUrl);

}