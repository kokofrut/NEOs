import axios, { AxiosInstance } from "axios";

const $api: AxiosInstance = axios.create({
    baseURL: 'https://ssd-api.jpl.nasa.gov/cad.api',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default $api;