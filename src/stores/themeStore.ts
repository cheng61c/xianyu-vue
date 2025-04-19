import { defineStore } from 'pinia';
import {Theme} from "@/types/Theme";

export const useThemeStore = defineStore('theme', {
    state: () => ({
        themeList : [] as Theme[]
    }),
    persist: true
});
