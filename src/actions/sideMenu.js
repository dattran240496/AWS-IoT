import {CHANGE_ROOM_REQUEST} from "./type";

export const changeRoomRequest = params => {
    return {
        type: CHANGE_ROOM_REQUEST,
        params
    }
}
