import axios, { AxiosInstance } from "axios";

const $api: AxiosInstance = axios.create({
    baseURL: 'https://api.nasa.gov/neo/rest/v1/',
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
});

export default $api;