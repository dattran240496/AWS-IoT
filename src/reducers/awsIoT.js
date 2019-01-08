import {
    CHANGE_ROOM_REQUEST,
    UPDATE_DEVICE_STATUS,
    UPDATE_AWS_STATUS,
    UPDATE_SWITCH_DEVICE_STATUS,
    UPDATE_DEVICE_MODE,
    UPDATE_SCRIPT
} from "../actions/type";
import {
    deviceElements,
    deviceStatusDefault,
    devicesMode,
    deviceTimer
} from "../constants/devices";

const initialState = {
    deviceStatus: deviceStatusDefault,
    devices: [],
    connected: false,
    switchStatus: false,
    devicesMode: devicesMode,
    deviceTimer: deviceTimer,
    scriptList: {}
}
export default (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_ROOM_REQUEST: {
            const roomDevice = deviceElements[action.params]
            return {
                ...state,
                devices: roomDevice
            }
        }
        case UPDATE_DEVICE_STATUS:
            return {
                ...state,
                deviceStatus: {
                    ...state.deviceStatus,
                    ...action.params
                }
            };
        case UPDATE_AWS_STATUS:
            return {
                ...state,
                connected: action.params
            };
        case UPDATE_SWITCH_DEVICE_STATUS:
            return {
                ...state,
                switchStatus: action.params
            }
        case UPDATE_DEVICE_MODE:
            return {
                ...state,
                devicesMode: {
                    ...state.devicesMode,
                    ...action.params
                }
            };
        case UPDATE_SCRIPT:
            return {
                ...state,
                scriptList: {
                    ...state.scriptList,
                    ...action.params
                }
            };
        default:
            return {
                ...state
            }
    }
}
