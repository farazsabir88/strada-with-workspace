/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Button, Grid, Avatar } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { setAllWorkspaces } from 'admin/store/allWorkspaces';
import { setWorkspace } from 'admin/store/currentWorkspaceSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'mainStore';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import './_workspace-listing.scss';
import { setCurrentUserRole } from 'admin/store/permissions';
import type { IallworkspaceResponse, Iallworkspace, ICurrentUserRoleResponse } from './types';

function SideBarHeaderIcon(): JSX.Element {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M13.5 11.25V12.7617H11.9883V11.25H13.5ZM13.5 8.26172V9.73828H11.9883V8.26172H13.5ZM15.0117 14.2383V6.75H9V8.26172H10.5117V9.73828H9V11.25H10.5117V12.7617H9V14.2383H15.0117ZM7.48828 5.23828V3.76172H6.01172V5.23828H7.48828ZM7.48828 8.26172V6.75H6.01172V8.26172H7.48828ZM7.48828 11.25V9.73828H6.01172V11.25H7.48828ZM7.48828 14.2383V12.7617H6.01172V14.2383H7.48828ZM4.5 5.23828V3.76172H2.98828V5.23828H4.5ZM4.5 8.26172V6.75H2.98828V8.26172H4.5ZM4.5 11.25V9.73828H2.98828V11.25H4.5ZM4.5 14.2383V12.7617H2.98828V14.2383H4.5ZM9 5.23828H16.4883V15.75H1.51172V2.25H9V5.23828Z' fill='white' />
    </svg>
  );
}

export default function WorkSpacesListing(): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const { closeSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState<Iallworkspace[]>([]);
  useQuery(
    'get-workspace',
    async () => axios({
      url: 'api/workspace/',
      method: 'GET',
    }),
    {
      // select: (res: AxiosResponse<IallworkspaceResponse>) => res.data.detail,
      onSuccess: (res: AxiosResponse<IallworkspaceResponse>) => {
        setData(res.data.detail);
        dispatch(setAllWorkspaces(res.data.detail));
      },
    },
  );

  const getUserRole = async (id: number): Promise<void> => {
    await axios.get(`api/workspace-role/?workspace=${id}`, {
    }).then((res: AxiosResponse<ICurrentUserRoleResponse>) => {
      dispatch(setCurrentUserRole(res.data.detail));
    });
  };

  const handleSingleWorkspace = (item: Iallworkspace): void => {
    closeSnackbar(); // to close snackbar if any after deleting workspace
    // eslint-disable-next-line no-void
    void getUserRole(item.id);
    dispatch(setWorkspace(item));
    if (window.innerWidth < 600) {
      navigate('/workspace/checklists');
    } else {
      navigate('/workspace/buildings', { state: item.id });
    }
  };

  return (
    <div className='container workspace-wrapper pe-0'>
      <div className='heading'>
        <h5>Workspaces</h5>
        {(user.role === 'admin' || user.role === 'property_owner')
          && (
            <Button
              startIcon={<SideBarHeaderIcon />}
              onClick={(): void => {
                navigate('/workspace/create-new');
              }}
              variant='contained'
              style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }}
              color='primary'
              className='create-workspace-btn'
              autoFocus
            >
              New workspace
            </Button>
          )}
      </div>
      <Grid container spacing={2} className='w-100'>
        {data.length > 0 && data.map((item) => (
          <Grid item lg={3} md={4} className='w-100' onClick={(): void => { handleSingleWorkspace(item); }}>
            <div className='workspace-card'>
              <Avatar sx={{ bgcolor: '#00CFA1' }} variant='rounded' src={`${process.env.REACT_APP_IMAGE_URL}${item.logo_url}`} alt={item.name[0]} />
              <h4 className='company-name'>
                {item.name}
              </h4>
              <div className='workspace-members'>
                {item.members.slice(0, 5).map((singleMember) => (
                  <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${singleMember.avatar}`} style={{ width: '26px', height: '26px' }} />
                ))}
                {`${item.members_count} members`}
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
