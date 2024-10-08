/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        const method = 'patch';
        const url = `/api/v1/users/${type === 'password' ? 'update-my-password' : 'update-me'}`;

        const res = await axios({ method, url, data });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
};
