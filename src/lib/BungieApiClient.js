import axios from "axios";

const BASE_URL = 'https://www.bungie.net'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'X-API-Key': process.env.REACT_APP_API_KEY
    }
})

const _get = (url, config = {}) => {
    return apiClient.get(url, config)
}

const _post = (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config)
}

export {_get, _post}