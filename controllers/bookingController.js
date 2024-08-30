const stripe = require('stripe');


const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) get the currently booked Tour

    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}`,
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
                            `https://www.yourdomain.com/img/tours/${tour.imageCover}`, // Replace with your image URL path
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
