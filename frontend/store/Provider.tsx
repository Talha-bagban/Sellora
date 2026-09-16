'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { useEffect, useState } from 'react';
import { getAuth } from './authStorage';
import { setCredentials } from './authSlice';

function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);

  // useEffect(() => {
  //   const auth = getAuth();

  //   if (auth) {
  //     dispatch(setCredentials(auth));
  //   }
  // }, [dispatch]);
  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      dispatch(setCredentials(auth));
    }

    setInitialized(true);
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  return children;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}