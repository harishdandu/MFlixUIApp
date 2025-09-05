
import {api} from '../services/authService';

export async function loginAPI(reqobj) {


    try {
        console.log('Login request data:', reqobj, api);
        const response = await api.get('/api/clinics');
        const loginResponseData = response.data;
        
        if (!response.statusText === "OK") {
            throw new Error('Login request failed');
        }


        // Handle the response data
        //console.log('Login successful service', loginResponseData);
        return loginResponseData;

    } catch (error) {
        //console.error('Login failed:', error);
        throw error;
    }
}