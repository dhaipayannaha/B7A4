M23-p2
*  where: {
                AND: [
                    {
                        title: "My first update Completed from 5000"
                    },
                    {
                        tags: {
                            has: "typescript",
                        }
                    }
                ]
            },  from getAllPost in post.services.ts
* actually it hapends how filterings works

M23-p3
* or search system post.service.ts

M23-P4
* pagination and sortig system from post.services.ts
 //  this is pagination  
            // take: 1,
            // skip: 3,

// sorting
orderBy: {
            //     createdAt: "desc",
            //     title: "asc",
            //     content: "desc"
            // },

M24-p5
* install npm i -g @stripe/cli
* stripe login (after that stripe gives a login link copy that and past in browser and login and get a code from gmail) then stripe gives you a link that install in terminal

M24-P6
* app.post("/api/subscription/wenhook", express.raw({ type: 'application/json' }), (req: Request, res: Response) => { })

* "stripe:webhook": "stripe listen --forward-to localhost:5000/api/subscription/webhook",  set under test  in package.json

* npm run stripe:webhook   it run in terminal and they gives you webhok signin decret  like(whsec_d35945294a57817f247ebb078a81f21d8bb2d1c35ef5179998f7bab1321705a2),  it is not change able all time gives me same hook

* STRIPE_WEBHOOK_SECRET = whsec_d35945294a57817f247ebb078a81f21d8bb2d1c35ef5179998f7bab1321705a2            set in .env file

* stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,   set in  in config file


* in app.ts <!--  app.post("/api/subscription/webhook", express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
    let event = request.body;
    console.log(event, "stripe request body");
    console.log(request.headers, "stripe request headers");
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature']!;
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.status(400).json({
                message: err.message
            });
        }
    }

    console.log(event, "event after try block")
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}) -->



M25-P1
*  app.post("/api/subscription/webhook") remove from app.ts
*  app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))
* router.post("/webhook", subscriptionController.handleWebhook); in subscription.route.ts
* using this route setup cintroler and service


M25-P2
*  case 'checkout.session.completed':
            // console.log(event.data.object);
            await handleCheckoutCompleted(event.data.object)
            break;
* then step by step process

M25-P3
* handleChangeSubscription(event.data.object)  fror update and cancle in subscription service.ts
* then create subscription.utilits.ts and move (getPeriodEnd, handleCheckoutCompleted, handleChangeSubscription)

M25-P4
* router.get("/status", auth(Role.USER, Role.ADMIN, Role.AUTHOR), subscriptionController.getSubscriptionStatus);

* app.use("/api/premium", premiumRoutes);
* then create post on postman (premium post is true) 