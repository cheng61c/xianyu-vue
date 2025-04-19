interface SelectType {
    label: string;
    value: string;
}
export const locales : SelectType[] = [
    {label : '中文', value : 'zh-CN'},
    {label : 'english', value : 'en-US'},
]
export const useLocale = (value: string): string => {
    const locale = locales.find((item : SelectType) => item.value === value);
    if (!locale) {
        return '未知语言';
    }
    return locale.label;
};
