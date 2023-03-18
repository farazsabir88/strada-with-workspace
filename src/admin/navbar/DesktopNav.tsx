/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { MouseEvent } from 'react';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  useNavigate, Link,
  useLocation,
} from 'react-router-dom';
import {
  IconButton, Avatar, Popover,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setWorkspace } from 'admin/store/currentWorkspaceSlice';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { NotificationPopover } from 'admin/navbar/NotificationPopover';
import Logo from 'assests/images/Logo.png';
import { logout } from 'client/login/store';
import type { Iuser } from 'types';

import type { RootState } from 'mainStore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { IRecentWorkspace } from '../workSpaces/types';

interface Iprops {
  user: Iuser | null;
}

export default function DesktopNav(props: Iprops): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state: RootState) => state.auth.user);
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const workspacesData = useSelector(
    (state: RootState) => state.workspaces.workspacesData.data,
  );

  const { user } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState<HTMLElement | null>(null);
  const [workspacePopup, setWorkspacePopup] = useState <HTMLElement | null>(null);

  const handleClick: (event: MouseEvent<HTMLElement>) => void = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const workspaceHandleClick: (event: MouseEvent<HTMLElement>) => void = (event: MouseEvent<HTMLElement>) => {
    setWorkspacePopup(event.currentTarget);
  };

  const handleNotiOpen: (event: MouseEvent<HTMLElement>) => void = (event: MouseEvent<HTMLElement>) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = (): void => {
    setNotiAnchorEl(null);
  };

  const handleClose: () => void = () => {
    setAnchorEl(null);
  };
  const workspaceHandleClose: () => void = () => {
    setWorkspacePopup(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const notificationPopover = Boolean(notiAnchorEl);
  const notiId = notificationPopover ? 'simple-popover-noti' : undefined;

  const { data: recentWorskspaces = [], refetch } = useQuery(
    'get/workspace/recent_list',
    async () => axios({
      url: 'api/workspace/recent_list/',
      method: 'get',
    }),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      select: (res) => res.data.detail,
    },
  );

  useEffect(() => {
    refetch().catch((e) => { throw e; });
  }, [currentWorkspace, workspacesData]);

  const { mutate: handleSingleWorkspace } = useMutation(
    async (workspaceId: number) => axios({
      url: `/api/workspace/${workspaceId}/`,
      method: 'get',
    }),
    {
      onSuccess: (res) => {
        dispatch(setWorkspace(res.data.detail));
        navigate('/workspace/buildings', { state: res.data.detail.id });
        workspaceHandleClose();
      },
    },
  );

  return (
    <>
      <nav className='navbar-container'>
        <div className='ad-main-navbar container-fluid'>

          <div className='left-side-nav'>
            <Link to='/' className='logo-wrapper'>
              <img src={Logo} alt='strada-logo' />
            </Link>

            <div className='client-nav-links'>
              <Link
                to='/workspace/dashboard/1'
                className={location.pathname.includes('/workspace/dashboard') ? 'nav-link nav-link-focused' : 'nav-link'}

              >
                <p className='dashboard-heading'>Dashboard </p>

              </Link>
              <div className={!location.pathname.includes('/dashboard') && (location.pathname.includes('/building') || location.pathname.includes('/workspace')) ? 'buildings-cum-popover nav-link-focused' : 'buildings-cum-popover'}>
                <div className='icon-wrapper' onClick={workspaceHandleClick} aria-hidden='true'>
                  <div className='d-flex justify-content-center align-items-center cursor-pointer'>
                    <p className='workspace-heading'>Workspace </p>
                    <ArrowDropDownIcon />
                  </div>

                </div>

                <Popover
                  open={Boolean(workspacePopup)}
                  anchorEl={workspacePopup}
                  onClose={workspaceHandleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div className='workspace-popver'>
                    <h6 className='recent mt-3 mb-2'>RECENT</h6>
                    {recentWorskspaces.length > 0 && recentWorskspaces.map((item: IRecentWorkspace) => (
                      <div className='add-hover d-flex align-items-center' key={item.id} aria-hidden='true' onClick={(): void => { handleSingleWorkspace(item.id); }}>
                        <div className='logo'>
                          {item.name[0]}
                        </div>
                        <h4 className='company-name'>
                          {item.name}
                        </h4>
                      </div>
                    ))}
                    <hr />
                    <div className='add-hover' aria-hidden='true' onClick={(): void => { navigate('/workspaces'); workspaceHandleClose(); }}>
                      <h4 className='company-name'>
                        View all workspaces
                      </h4>
                    </div>
                    {(userData.role === 'admin' || userData.role === 'property_owner')
                    && (
                      <div className='add-hover' aria-hidden='true' onClick={(): void => { navigate('/workspace/create-new'); workspaceHandleClose(); }}>
                        <h4 className='company-name'>
                          Create new workspace
                        </h4>
                      </div>
                    )}
                  </div>

                </Popover>
              </div>
              {/* {!location.pathname.includes('/workspace')
              && (
                <div className={!location.pathname.includes('/dashboard') && !location.pathname.includes('/workspace') ? 'buildings-cum-popover nav-link-focused' : 'buildings-cum-popover'}>
                  <div className='icon-wrapper' onClick={buildingHandleClick} aria-hidden='true'>
                    <div className='d-flex justify-content-center align-items-center cursor-pointer'>
                      <p className='workspace-heading'>Buildings </p>
                      <ArrowDropDownIcon />
                    </div>

                  </div>

                  <Popover
                    open={buildingOpen}
                    anchorEl={buildingPopup}
                    onClose={buildingHandleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >

                    <div className='setting-popver'>

                      {Array.isArray(buildingsData) && buildingsData.map((item: Ibuilding) => (

                        <div className='option-bar' key={item.id}>
                          <span className='span-checkbox'>
                            {' '}
                            <Radio checked={currentBuilding.id === item.id} onClick={(): void => { onBuildingClick(item); }} />
                          </span>
                          <span className='span-link'>
                            <Link className='setting-option' to={`/workspace/budget-calendar/${encrypt(item.id)}`}>
                              {item.address}
                            </Link>
                          </span>
                        </div>
                      ))}

                    </div>

                  </Popover>
                </div>
              )} */}
              {/* <PrimayButton onClick={(): void => { navigate('/workspace/create-building'); }}> Create Building </PrimayButton> */}

            </div>
          </div>

          <div className='right-side-nav'>

            <IconButton onClick={handleNotiOpen}>
              <i className='fa-solid fa-bell' />
            </IconButton>

            <IconButton onClick={handleClick}>
              <Avatar
                src={`${process.env.REACT_APP_IMAGE_URL}${user?.avatar}`}
              >
                {user?.first_name}
              </Avatar>

            </IconButton>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >

              <div className='setting-popver-right'>
                <div
                  className='account-setting-option-1 cursor-pointer'
                  aria-hidden='true'
                  onClick={(): void => { navigate('/settings/account'); }}
                >
                  <Link to='/settings/account'> Account Settings </Link>
                </div>
                <div onClick={(): { type: string; payload: undefined } => dispatch(logout())} className='account-setting-option-2' aria-hidden='true'> Logout </div>
              </div>

            </Popover>

          </div>
        </div>
      </nav>
      <NotificationPopover open={notificationPopover} handleClose={handleNotiClose} id={notiId} anchorEl={notiAnchorEl} />
    </>
  );
}
