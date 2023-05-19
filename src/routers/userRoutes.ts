import { IsUserRegistered } from "../controllers/userController";
import { Router } from "express";


export default function userRoutes (router: Router) {
    router.post('/api/oauth', IsUserRegistered);
}
