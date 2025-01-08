import { combineReducers } from 'redux';
import AuthReducer from './auth/authSlice';

const rootReducer = combineReducers({
    auth: AuthReducer
});

export default rootReducer;