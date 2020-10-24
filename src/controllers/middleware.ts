import axios from 'axios'
import { conf as config } from '../data/constants'

const base = `${config.baseURL}:${config.port}`

export const queryServerStatus = () => {
    return axios
            .get<{validApiKey: boolean, validDBCredentials: boolean, leadcount: number}>(`${base}/api/status`)
}

export const getActiveCategories = () => {
    return axios
        .get<{categories: string[]}>(`${base}/leads/categories`)
}

export const bufferLeads = (category: string, state: string, city: string, leads: string[]) => {
    return axios
            .post<{message: string, leadcount: number}>(`${base}/api/upload?category=${category}&state=${state}&city=${city}`, leads)
}