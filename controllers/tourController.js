const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({});
        // newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            data: {
                message: 'Invalid data sent!',
            },
        });
    }
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours,
        // },
    });
};

exports.getTour = (req, res) => {
    console.log(req.params.id);
    const id = req.params.id * 1;
    // const tour = tours.find((tour) => tour.id === id);

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour,
    //     },
    // });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>',
        },
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
