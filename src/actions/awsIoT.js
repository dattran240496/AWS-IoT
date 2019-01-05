import {UPDATE_DEVICE_STATUS, UPDATE_AWS_STATUS, UPDATE_SWITCH_DEVICE_STATUS, UPDATE_DEVICE_MODE} from "./type";

export const updateDeviceStatus = params => {
    return {
        type: UPDATE_DEVICE_STATUS,
        params
    }
}

export const updateAWSStatus = params => {
    return {
        type: UPDATE_AWS_STATUS,
        params
    }
}

export const updateSwitchDeviceStatus = params => {
    return {
        type: UPDATE_SWITCH_DEVICE_STATUS,
        params
    }
}

export const updateDeviceMode = params => {
    return {
        type: UPDATE_DEVICE_MODE,
        params
    }
}
