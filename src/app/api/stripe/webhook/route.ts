import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {

        // Handle Listing Payment
        if (session.metadata?.type === "LISTING_FEE") {
            const listingId = session.metadata.listingId;
            if (listingId) {
                await prisma.listing.update({
                    where: { id: listingId },
                    data: {
                        status: "PUBLISHED",
                        paidAt: new Date()
                    }
                });
            }
            return new NextResponse(null, { status: 200 });
        }

        // Handle Tenant Subscription
        const subscriptionId = session.subscription as string;
        if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            if (!session?.metadata?.userId) {
                return new NextResponse("User id is required", { status: 400 });
            }

            await prisma.user.update({
                where: {
                    id: session.metadata.userId,
                },
                data: {
                    stripeCustomerId: subscription.customer as string,
                    subscriptionStatus: "ACTIVE",
                },
            });
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        // Handle recurring payments if needed
        // const subscription = await stripe.subscriptions.retrieve(
        //   session.subscription as string
        // );
        // Update active status just in case
    }

    if (event.type === "customer.subscription.deleted") {
        // Mark as inactive if user cancels
        const subscription = event.data.object as Stripe.Subscription;
        // Find user by customer ID ? We don't have it directly mapped easily without metadata in sub object
        // Ideally metadata flows down, but for MVP we assume creation works.
        const user = await prisma.user.findFirst({
            where: { stripeCustomerId: subscription.customer as string }
        });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: "INACTIVE" }
            });
        }
    }


    return new NextResponse(null, { status: 200 });
}
