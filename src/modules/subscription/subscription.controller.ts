import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";

const createCheckoutSession=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const userId=req.user?.id;
        const result=await subscriptionServices.createCheckoutSession(userId as string);

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Checkout completed successfully",
            data:result
        })
    }
);

const handleWebhook=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const event=req.body as Buffer;
  const signature=req.headers['stripe-signature']!;

  await subscriptionServices.handleWebhook(event,signature as string);
  
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Webhook triggered successfully",
    data:null
  })
})

const getSubscriptionStatus=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
         const userId=req.user?.id;

         const result=await subscriptionServices.getSubscriptionStatus(userId as string);

         sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Subscription status retrived successfully",
            data:result
         })
    }
)


const cancelSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionServices.cancelSubscription(
    req.user!.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription cancelled successfully",
    data: result,
  });
});


const cancelSubscriptionPeriodEnd = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.cancelSubscriptionPeriodEnd(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Subscription will be cancelled at the end of the current billing period.",
      data: result,
    });
  }
);



export const subscriptionController={
    createCheckoutSession,
    handleWebhook,
    getSubscriptionStatus,
    cancelSubscription,
    cancelSubscriptionPeriodEnd
    
}

