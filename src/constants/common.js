export const DATE_TIMER_FORMAT = 'DD-MM-YYYY h:mm A'
export const isJSON = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
};

export const isInt = number => {
    try {
        parseInt(number)
    } catch (e) {
        return false
    }
    return true
}
