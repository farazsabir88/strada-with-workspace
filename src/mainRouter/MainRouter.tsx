/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from 'client/login/store';
import ClientRouter from 'client/ClientRouter';
import AdminRouter from 'admin/AdminRouter';
import type { RootState } from 'mainStore';

export default function MainRouter(): JSX.Element {
  const [counter, setCounter] = useState(0);
  const dispatch = useDispatch();
  const reduxAuth = useSelector((state: RootState) => state.auth);
  const authJsontest = window.localStorage.getItem('auth');

  const checkIsLoggedIn: () => void = () => {
    const authJson = window.localStorage.getItem('auth');
    if (authJson != null) {
      const auth = JSON.parse(authJson);
      dispatch(setLogin(auth.user));
    }
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  useEffect(() => {
    setCounter(counter + 1);
  }, [reduxAuth]);

  return (
    <BrowserRouter>
      {authJsontest != null ? <AdminRouter /> : <ClientRouter />}
    </BrowserRouter>

  );
}
