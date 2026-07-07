import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/category.route";
import { gearItemRoutes } from "./modules/gearItem/gearItem.route";
import { profileRoutes } from "./modules/profile/profile.route";
import { rentalRoutes } from "./modules/rental/rental.route";
const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;
console.log(endpointSecret);
app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear",gearItemRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/rentals",rentalRoutes)

app.use(notFound);

app.use(globalErrorHandler);

export default app;
