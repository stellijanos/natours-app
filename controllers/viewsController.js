const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
    });
};
