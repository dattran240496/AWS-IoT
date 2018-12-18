import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import reducers from './reducers'

export default () => {

    // const persistedReducer = combineReducers(reducers)
    const store = createStore(
        reducers,
        compose(
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
                ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
                : f => f,
        ),
    )
    return {
        store
    }
}
