import axios from 'axios'
import { conf as config } from '../data/constants'

const base = `${config.baseURL}:${config.port}`

export const queryServerStatus = () => {
    return axios
            .get<{ validApiKey: boolean, validDBCredentials: boolean}>(`${base}/api/status`)
}

export const bufferLeads = (category: string, state: string, city: string, leads: string[]) => {
    return axios
            .post<string>(`${base}/api/buffer?category=${category}&state=${state}&city=${city}`, leads)
}

export const getLeadsStats = () => {
    return axios
            .get<{ total: number, categories: string[]}>(`${base}/api/leads`)
}