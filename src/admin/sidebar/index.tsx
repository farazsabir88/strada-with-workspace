/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import {
  Collapse,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import SidebarHeader from './components/SidebarHeader';
import './_sidebar.scss';
import { mainNavbarConfig, settingNavbarConfig } from './components/navConfig';
import { StyledMainNavButton } from './components/styledComponents';
import type { IMainSidebarProps, INavbarItem, IMenuItemProps } from './types';
import { setCollapseState } from './store';

export default function Sidebar(props: IMainSidebarProps): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserRole = useSelector((state: RootState) => state.workspaces.userPermission.currentUserRole);

  const isTemplateOpen = useSelector((state: RootState) => state.sidebar.template);
  const [manuItems, setMenuItems] = useState<INavbarItem[]>([]);
  const [variant, setVariant] = useState<string | undefined>('main');
  const { activeLink, variant: propsVariant } = props;

  function SingleItem(itemProps: IMenuItemProps): JSX.Element {
    const { item, al, isChild } = itemProps;
    const currentLocation = window.location;
    const stringUrl = currentLocation.pathname;

    const handleClick = (): void => {
      if (item.name === 'templates') {
        item.route = `${window.location.pathname}`;
        navigate(`${window.location.pathname}`);
      } else if (item.name === 'budget-calendar') {
        navigate('/workspace/budget-calendar');
      } else if (al !== item.name) {
        navigate(`${item.route}`);
      } else if (stringUrl.includes('schedule') || stringUrl.includes('RFP')) {
        navigate('/workspace/budget-calendar');
      }
    };

    return (
      <StyledMainNavButton
        onClick={handleClick}
        active={item.name === al}
        isChild={isChild}
      >
        <div className='left-side'>

          {item.icon && <item.icon />}

          <h6>
            {' '}
            {item.heading}
          </h6>
        </div>
        <div className='right-side'>
          {item.hasChildren && item.name !== 'templates' && <i className='fa-solid fa-angle-down' />}

        </div>

      </StyledMainNavButton>
    );
  }
  const getNavbarPagePermissions = (): boolean => {
    if (currentUserRole !== null) {
      if (currentUserRole.role !== 3) {
        return true;
      }
      return false;
    }
    return true;
  };
  function MultiItem(multiItemProps: IMenuItemProps): JSX.Element {
    const { item, al } = multiItemProps;
    const { children } = item;
    const handleClick = (): void => {
      dispatch(setCollapseState({ template: !isTemplateOpen }));
      navigate(`${item.route}`);
    };

    return (
      <div>
        <div onClick={(): void => { handleClick(); }} aria-hidden='true'>
          <SingleItem isChild={false} item={item} al={activeLink} />
        </div>

        <Collapse style={{ marginLeft: '1.5rem' }} in={isTemplateOpen} timeout='auto' unmountOnExit>
          {children?.map((child: INavbarItem) => <SingleItem isChild key={`single-item-${child.id}`} item={child} al={al} />)}
        </Collapse>
      </div>
    );
  }

  function MenuItem(menuItemProps: IMenuItemProps): JSX.Element {
    const { item, al } = menuItemProps;
    const Component = item.hasChildren ? MultiItem : SingleItem;
    return <Component {...{ item, al }} />;
  }

  useEffect(() => {
    setVariant(propsVariant);
  }, [props, propsVariant]);

  useEffect(() => {
    if (variant === 'main') {
      setMenuItems(mainNavbarConfig);
    } else if (variant === 'settings') {
      setMenuItems(settingNavbarConfig);
    }
  }, [variant]);

  return (
    <div>
      <div className='sidebar-wrapper'>
        <SidebarHeader variant={variant} />

        <div className='sidebar-links-wrapper'>

          {manuItems.map((item) => <MenuItem key={`menu-item-sidebar-${item.name}-${item.id}`} item={item} al={activeLink} />)}

        </div>
        <div className='settings-btn'>
          {!location.pathname.includes('/workspace/settings/') && !location.pathname.includes('/dashboard') && !location.pathname.includes('/workspaces') && getNavbarPagePermissions()
            && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                className='wrapper'
                onClick={(): void => {
                  navigate('/workspace/settings/details');
                  localStorage.setItem('backUrl', location.pathname);
                }}
              >

                <IconButton>
                  <SettingsIcon />
                </IconButton>
                <p className='name'>Workspace Settings</p>
              </div>
            )}
        </div>
      </div>

      <div className='sidebar-spacer' />
    </div>

  );
}
