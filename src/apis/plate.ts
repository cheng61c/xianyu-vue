import request from "@/utils/request.ts";
import {type PlateDto} from "@/types/PlateDto";
import {type PlateDisabledDto} from "@/types/PlateDisabled";
export const getPlateList = () => {
    return request.get('/plate/list');
}
export const createPlate = (dto: PlateDto) => {
    return request.post('/plate', dto);
}
export const updatePlate = (dto: PlateDto) => {
    return request.post('/plate', dto);
}
export const plateDisabled = (dto : PlateDisabledDto) => {
    return request.post('/admin/plate/disabled', dto);
}
export const plateDelete = (id: number) => {
    return request.delete(`/admin/plate/${id}`);
}
