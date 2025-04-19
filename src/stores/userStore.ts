import { defineStore } from 'pinia';
import { User } from "@/types/User";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: {} as User,
        account: '',
        password: '',
        role: false
    }),
    persist: true
});
