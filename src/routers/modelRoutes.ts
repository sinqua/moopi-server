import { Router } from "express";
import { ReturnPresignedUrl } from "../controllers/modelController";

export default function modelRoutes (router: Router) {
    router.post('/api/model', ReturnPresignedUrl);
}
