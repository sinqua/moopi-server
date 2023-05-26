import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createPresignedUrlWithClient = async (region: any, bucket: any, key: any) => {
    const client = new S3Client({ 
        region 
    });

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    return getSignedUrl(client, command, { expiresIn: 3600 });
}