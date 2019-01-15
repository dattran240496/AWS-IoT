import {
    UPDATE_DEVICE_STATUS,
    UPDATE_AWS_STATUS,
    UPDATE_SWITCH_DEVICE_STATUS,
    UPDATE_DEVICE_MODE,
    UPDATE_SCRIPT,
    DELETE_SCRIPT,
    UPDATE_HOME_STATUS, UPDATE_SOS
} from "./type";

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

export const updateSOS = params => {
    return {
        type: UPDATE_SOS,
        params
    }
}

export const updateScript = params => {
    return {
        type: UPDATE_SCRIPT,
        params
    }
}

export const deleteScript = params => {
    return {
        type: DELETE_SCRIPT,
        params
    }
}

export const updateHomeStatus = params => {
    return {
        type: UPDATE_HOME_STATUS,
        params
    }
}
