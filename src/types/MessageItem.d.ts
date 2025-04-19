export declare interface MessageItem {
    send: {
        headImg: string
        nickname: string
    }
    content: string
    updatedAt: Date | string
    post: {
        title: string
    }
    type: number
}