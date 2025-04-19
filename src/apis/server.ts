import request from "@/utils/request.ts";
import {type ServerPost} from "@/types/ServerPost";
export const getServerList = () => {
    return request.get('/server-post')
}
export const createServer = (data: ServerPost) => {
    return request.post(`/server-post`, data)
}
export const updateServer = (data: ServerPost) => {
    return request.put(`/server-post`, data)
}
export const deleteServer = (data: number) => {
    return request.delete(`/server-post/${data}`)
}
export const getServer = (data : number) => {
    return request.get(`/server-post/${data}`)
}
