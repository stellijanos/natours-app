const stripe = require('stripe');

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) get the currently booked Tour

    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe(
        process.env.STRIPE_SECRET_KEY,
    ).checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,

        succeess_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`, // Replace with your image URL path
                        ],
                    },
                    unit_amount: tour.price * 100, // Convert the price to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    });

    // 3) crate session as response
    res.status(200).json({
        status: 'success',
        session,
    });
});

const createBookingCheckout = async (session) => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe(process.env.STRIPE_SECRET_KEY).webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
        createBookingCheckout(event.data.object);
    res.status(200).json({
        received: true,
    });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
