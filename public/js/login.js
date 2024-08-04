/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: { email, password },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
};
// export const login = async (email, password) => {
//     try {
//         const res = await fetch('http://127.0.0.1:8000/api/v1/users/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         if (!res.ok) {
//             const error = await res.json();
//             alert(error.message);
//             return;
//         }

//         const data = await res.json();
//         if (data.status === 'success') {
//             alert('Logged in successfully!');
//             window.setTimeout(() => {
//                 location.assign('/');
//             }, 1500);
//         }
//     } catch (err) {
//         alert('An error occured. Please try again later!');
//     }
// };
