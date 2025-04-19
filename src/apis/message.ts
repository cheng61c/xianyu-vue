import request from "@/utils/request.ts";

export const getMessageList = () => {
    return request.get('/notification/unread')
}