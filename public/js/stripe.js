/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
    'pk_test_51Ps5RHP9ZXctMcboT8727EkPUMZcaBmYpgLjFHOuh0yFi9aAs9Kh5jB1ByerN8a5M4n2i8ReknXPONx4uAzdeObH00Vh4GgUcH',
);

export const bookTour = async (tourId) => {
    try {
        // 1) get checkout session from API

        const session = await axios(
            `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
        );
    
        // 2) create checkout form + charge credit card

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
