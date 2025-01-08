import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { useDispatch } from 'react-redux';
import { verifyLogin } from 'store/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyLogin());
  },[])
  return <BrowserRouter >{renderRoutes(routes)}</BrowserRouter>;
};

export default App;
