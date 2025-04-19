import { defineStore } from 'pinia';


export const useDeviceStore = defineStore('device', {
    state: () => ({
        device : 1
    }),
    persist: true
});
