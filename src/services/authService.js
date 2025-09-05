import axios from 'axios';


// Function to create an instance of axios with a specified base URL and LoaderContext
const createAxiosInstance = (baseURL, loaderContext) => {
    const api = axios.create({
        baseURL: baseURL,
    });
    // debugger;
    // Apply the headers using an interceptor
    api.interceptors.response.use(
        (response) => {
            if (loaderContext?.setLoading) {
                loaderContext.setLoading(false);
            }
            return response;
        },
        (error) => {
            if (loaderContext?.setLoading) {
                loaderContext.setLoading(false);
            }
            // debugger;
            if (error.response.data.code) {
                // return toast.error(error.response.data.errors);
            }
            else {
                // return toast.error(error.message);
            }
        }
    );

    return api;
};

const api = createAxiosInstance('http://localhost:6010');

export {api};