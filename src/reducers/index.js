import {combineReducers} from 'redux';
import awsiot from './awsIoT';


const appReducers = combineReducers({
    awsiot,
});

const rootReducer = (state, action) => {
    return appReducers(state, action)
};

export default rootReducer;
