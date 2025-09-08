
import {api} from '../services/authService';

export async function registrationAPI(reqobj) {


    try {
        console.log('registration request data:', reqobj);
        const response = await api.post('/user/registration', reqobj);
        const registrationData = response;
        
        if (!response.statusText === "OK") {
            throw new Error('registrationData request failed');
        }


        return registrationData;

    } catch (error) {
        throw error;
    }
}