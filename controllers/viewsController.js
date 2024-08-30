const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverView = catchAsync(async (req, res, next) => {
    // 1) get tour data from collection
    const tours = await Tour.find();

    // 2) build template

    // 3) reder that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    // 2) buld template
    // console.log();

    // 3) render template using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: `Log into your account`,
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: `My account`,
    });
};

exports.getMyTours = catchAsync(async (req, res) => {
    // 1) find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // // 2) find tours with the returned IDs
    const tourIds = bookings.map((el) => el.tour.id);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200).render('account', {
        title: `My account`,
        user: updatedUser,
    });
});
