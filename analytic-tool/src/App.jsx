import './App.css'
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Dashboard, Folder, List, PlusOne, TableBar, TableBarSharp, TableChart } from "@mui/icons-material";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {UiContext} from './store/context/store';
import { Alert, Snackbar } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import Reports from './pages/Reports';
import DashboardTemplate from './pages/dashboards/Dashboard';


const NAVIGATION = [
  {
      segment: 'reports',
      title: 'Hesabatlar',
      icon: <TableChart/>,
      children: [
          {
              segment: '',
              title: 'Siyahı',
              icon: <List/>,
          },
          {
              segment: 'create',
              title: 'Yeni',
              icon: <PlusOne />,
          },
      ],
  },
  {
      segment: 'pages',
      title: 'Səhifələr',
      icon: <Dashboard/>,
      children: [
          {
              segment: '/',
              title: 'Siyahı',
              icon: <List/>,
          },
          {
              segment: 'create',
              title: 'Yeni',
              icon: <PlusOne />,
          },
      ],
  },
  {
      segment: 'folders',
      title: 'Qovluqlar',
      icon: <Folder/>,
      children: [
          {
              segment: '/',
              title: 'Siyahı',
              icon: <List/>,
          },
          {
              segment: 'create',
              title: 'Yeni',
              icon: <PlusOne />,
          },
      ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity
    }
  }
})

function AppProviderBasic(props) {
  const { window } = props;
  const [uiContext, setUiContext] = React.useState({
    loading: false,
    success: null,
    error: null
  })
  const [pathname, setPathname] = React.useState('/page');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (

    // preview-start


        <QueryClientProvider client={queryClient}>
          <UiContext.Provider value={[uiContext, setUiContext]}>
            <BrowserRouter>
              <Reports />
              <DashboardTemplate />
            </BrowserRouter>
            <Snackbar onClose={() => setUiContext({...uiContext, error: null, success: null})} autoHideDuration={5000} open={(uiContext.success || uiContext.error) !== null}>
              <Alert 
                onClose={() => setUiContext({...uiContext, error: null, success: null})}
                severity={uiContext.success ? "success" : 'error'}
                variant="filled"
                sx={{ width: '100%' }}>
                  {uiContext.success || uiContext.error}
              </Alert>
            </Snackbar>
          </UiContext.Provider>
        </QueryClientProvider>


    // preview-end
  );
}

AppProviderBasic.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default AppProviderBasic;
