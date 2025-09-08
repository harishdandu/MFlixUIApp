
import {api} from '../services/authService';

export async function loginAPI(reqobj) {


    try {
        console.log('Login request data:', reqobj, api);
        const response = await api.post('/user/login', reqobj);
        const loginResponseData = response;
        
        if (!response.statusText === "OK") {
            throw new Error('Login request failed');
        }

        return loginResponseData;

    } catch (error) {
        throw error;
    }
}