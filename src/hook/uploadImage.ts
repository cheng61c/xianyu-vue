import {upload} from "@/apis/common.ts";
import request from "@/utils/request.ts";
export const useUploadImage = ({callback}: { callback: (fileName : string) => void }) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e : Event) => {
        const file = (e.target as HTMLInputElement).files?.[0] || {} as File;
        const res = await upload(file)
        const fileName = request.defaults.baseURL + '/upload/preview/' + res.data.filename
        callback(fileName)
    }
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}
