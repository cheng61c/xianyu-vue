import { defineStore } from 'pinia';

export const useFooterStore = defineStore('footer', {
    state: () => ({
        index : 1,
        plate : 0,
        menu : 1
    }),
    persist: true
});
