import {api} from '../services/authService';

export async function getAllAirbnbListingsAPI(pageNo, pageSize, searchText, priceRange, minimumRating) {


    try {
        console.log('Login request data:');
        const response = await api.get('/airbnb/getAllListings?pageNo='+pageNo+'&pageSize='+pageSize+'&searchText='+searchText+'&priceRange='+priceRange+'&minimumRating='+minimumRating);
        const getAllAirbnbListingsData = response.data;
        
        if (!response.statusText === "OK") {
            throw new Error('getAllAirbnbListingsData request failed');
        }

        return getAllAirbnbListingsData;

    } catch (error) {
        throw error;
    }
}