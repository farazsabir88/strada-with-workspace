import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainRouter from 'mainRouter/MainRouter';
import { store, persistor } from 'mainStore';
import { PersistGate } from 'redux-persist/integration/react';
import 'assests/sass/_base.scss';
import { initAxios } from 'utils';
import CacheBuster from 'react-cache-buster';
import version from '../package.json';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00CFA1',
    },
  },
});
// const isProduction = process.env.NODE_ENV === 'production';
function App(): JSX.Element {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initAxios();

  return (

    <CacheBuster
      currentVersion={version.version}
      isEnabled
      isVerboseMode={false}
      metaFileDirectory='.'
    >
      <div>
        <QueryClientProvider client={client}>

          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider
                maxSnack={1}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <ThemeProvider theme={theme}>
                  <MainRouter />
                </ThemeProvider>
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </QueryClientProvider>

      </div>
    </CacheBuster>
  );
}

export default App;
