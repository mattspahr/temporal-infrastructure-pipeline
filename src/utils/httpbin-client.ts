import axios from 'axios';

const HTTPBIN_BASE_URL = 'http://httpbin.org/';

export async function get(path: string) {
    const METHOD = 'get';
    const res = await axios.get(HTTPBIN_BASE_URL + METHOD + '?' + path);

    return res.data.args;
}

export async function post(path: string, data: any) {
    const METHOD = 'post';
    const res = await axios.post(HTTPBIN_BASE_URL + METHOD + '?' + path, data);

    return JSON.parse(res.data.data);
}