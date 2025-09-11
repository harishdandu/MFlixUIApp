
import {api} from '../services/authService';

export async function getAllCustomersAPI(pageNo, pageSize, searchText) {


    try {
        console.log('Login request data:');
        const response = await api.get('/dashboard/getAllCustomers?pageNo='+pageNo+'&pageSize='+pageSize+'&searchText='+searchText);
        const getAllCustomersData = response.data;
        
        if (!response.statusText === "OK") {
            throw new Error('getAllCustomersData request failed');
        }

        return getAllCustomersData;

    } catch (error) {
        throw error;
    }
}


export async function transactionsByAccountNoAPI(accountNo) {


    try {
        console.log('Login request data:');
        const response = await api.get('/dashboard/getTransactionsByAccountNo?accountNo='+accountNo);
        const transactionsByAccountNoData = response.data;
        
        if (!response.statusText === "OK") {
            throw new Error('transactionsByAccountNoData request failed');
        }

        return transactionsByAccountNoData;

    } catch (error) {
        throw error;
    }
}

export async function getProductDetailsAPI(searchText) {
try {
        console.log('Login request data:');
        const response = await api.get('/dashboard/getProductDetails?searchText='+searchText);
        const productDetailsRes = response.data;
        
        if (!response.statusText === "OK") {
            throw new Error('productDetailsRes request failed');
        }

        return productDetailsRes;

    } catch (error) {
        throw error;
    }
}