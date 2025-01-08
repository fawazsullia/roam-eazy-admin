import { configureStore } from '@reduxjs/toolkit';

import rootReducer  from './reducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});

export default store;
