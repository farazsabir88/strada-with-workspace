/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Popover } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

interface INotiProps {
  open: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  id: string | undefined;
}

interface IUserInfo {
  avatar: string;
  name: string;
  id: number;
  email: string;
}

interface INotification {
  description: string;
  event: number;
  property: number;
  property_info: string;
  time: string;
  event_type: string;
  user_info: IUserInfo;
}
interface INotificationResponse {
  results: INotification[];
}

export function NotificationPopover(props: INotiProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [notificationData, setNotificationData] = useState <INotification[]>([]);

  let date = '';
  let property = '';
  const {
    open, handleClose, anchorEl, id,
  } = props;

  useQuery(
    'get/notifications',
    async () => axios({
      url: 'api/notifications/',
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<INotificationResponse>) => res.data.results,
      onSuccess: (res: INotification[]) => {
        setNotificationData(res);
      },
      onError: () => {
        enqueueSnackbar('Couldnot refresh data', { variant: 'error' });
      },
    },
  );

  const handleNotificationClick = (notification: INotification): void => {
    if (notification.event_type !== '' && notification.event_type !== 'task') {
      handleClose();
      navigate(`/workspace/budget-calendar?eventId=${notification.event}`);
    }
  };

  const getName = (notification: INotification): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (notification.user_info !== undefined && notification.user_info.name !== null) {
      if (notification.user_info.name) {
        return (
          <div className='name'>
            {notification.user_info.name}
            &nbsp;
          </div>
        );
      }
      return <div className='default-name text-dark'>Default User</div>;
    }
    return <div />;
  };

  const getDescription = (notification: INotification): (JSX.Element | string)[] => {
    const splited = notification.description.split(' :');
    const data = splited.map((splits) => {
      if (splits.includes(';')) {
        const parts = splits.split(';');
        return (
          <React.Fragment key={parts[0]}>
            <span className={`noti-link ${notification.event_type !== '' && 'cursor-pointer'}`} aria-hidden='true' onClick={(): void => { handleNotificationClick(notification); }}>
            &nbsp;
              {parts[0]}
            </span>
            {parts[1]}
          </React.Fragment>
        );
      }
      return splits;
    });
    return data;
  };

  return (
    <Popover
      id={id}
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >

      <div className='notification-popover'>
        <div className='heading'>
          <div className='head'>Notifications</div>
          <div className='close-btn' aria-hidden='true' onClick={handleClose}>
            <i className='fas fa-times' />
          </div>
        </div>
        {notificationData !== undefined && notificationData.length > 0 && notificationData.map((notification: INotification) => {
          let newDate = true;
          let NewProperty = true;
          let type = 'other';
          let avatarUrl = '';
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (date === moment(notification.time).format('YYYY-MM-DD')) {
            newDate = false;
          } else {
            date = moment(notification.time).format('YYYY-MM-DD');
            property = '';
            if (moment(notification.time).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) {
              type = 'today';
            } else if (moment(notification.time).format('YYYY-MM-DD') === moment(yesterday).format('YYYY-MM-DD')) {
              type = 'yesterday';
            }
          }

          if (property === notification.property_info) {
            NewProperty = false;
          } else {
            property = notification.property_info;
          }

          // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
          if (notification.user_info !== null && notification.user_info.avatar !== null) {
            avatarUrl = `${process.env.REACT_APP_IMAGE_URL}/${notification.user_info.avatar}`;
          } else {
            avatarUrl = `${process.env.REACT_APP_IMAGE_URL}/media/avatar/defaultAvatar.png`;
          }

          return (
            <div className='notification-panel' key={notification.time}>
              {newDate && (
                <div className='date-card'>
                  {type === 'other' ? moment(notification.time).format('MMMM DD, YYYY') : type}
                </div>
              )}

              {NewProperty && <div className='property'>{notification.property_info}</div>}
              <div className='history-body'>
                <div className=' history-details'>
                  <div className='notification-logo'>
                    <Avatar src={avatarUrl} />
                  </div>
                  <div className='desc'>
                    {getName(notification)}
                    {getDescription(notification)}
                  </div>
                </div>
                <div className='history-time'>{moment(notification.time).format('hh:mm A')}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Popover>
  );
}
