import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/category.route";
import { gearItemRoutes } from "./modules/gearItem/gearItem.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";
import { PaymentRoutes } from "./modules/payment/payment.route";
import { adminRoutes } from "./modules/admin/admin.route";
const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;
console.log(endpointSecret);
app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

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
app.use("/api/user",userRoutes);
app.use("/api/rentals",rentalRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/payments",PaymentRoutes);
app.use("/api/admin",adminRoutes)

app.use(notFound);

app.use(globalErrorHandler);

export default app;
