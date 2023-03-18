import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useQuery } from 'react-query';
import type { RootState } from 'mainStore';
import './_coisErrors.scss';
import Img from 'assests/images/cois-error.svg';
import type { Ipayload } from './types';

export default function ButtonAppBar(): JSX.Element {
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const navigate = useNavigate();
  const { data: coisErrorCount } = useQuery(
    'get/cois-errors',
    async () => axios({
      url: `/api/coise-errors/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: Boolean(currentWorkspace.id),
      select: (res: AxiosResponse<Ipayload>) => res.data.total_count,
    },
  );

  return (

    <div>
      { coisErrorCount !== undefined && coisErrorCount > 0 && (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position='static' className='cois-error-bar' elevation={0}>
            <Toolbar>
              <img src={Img} alt='error' />
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>

                <div className='details'>
                  {coisErrorCount}
                  {' '}
                  deficient certification
                </div>

              </Typography>
              <Typography
                className='learn-more'
                onClick={(): void => {
                  navigate('/workspace/cois/errors');
                }}
              >

                Learn More

              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </div>
  );
}
