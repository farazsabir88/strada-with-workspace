/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState, useEffect } from 'react';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import type { RootState } from 'mainStore';
import type { RecentActivity, RecentActivityResponse } from 'admin/buildingSection/building-dashboard/types';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import WorkspaceFilter from 'admin/buildingSection/budget-calendar/components/WorkspaceFilter';
import { useInView } from 'react-intersection-observer';

export default function RecentActivities(): JSX.Element {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [filteredActivities, setFilteredActivities] = useState<RecentActivity[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<number[]>([]);
  const [workspaceFilter, setWorkspaceFilter] = useState<number[]>([]);
  const [getNextData, setgetNextData] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string | null | undefined>(null);
  const [viewRef, setViewRef] = useState(false);

  const { ref, inView } = useInView();

  const { data: recentActivities } = useQuery(
    ['get/notification', buildingFilter, workspaceFilter],
    async () => axios({
      url: '/api/notifications/',
      method: 'GET',
      data: {
        user_id: userId,
      },
      params: {
        property: buildingFilter,
        workspace: workspaceFilter,
      },
    }),
    {
      select: (res: AxiosResponse<RecentActivityResponse>) => res.data,
      onSuccess: (res) => {
        setCursor(res?.next?.split('cursor=')[1]?.split('?')[0]);
      },
    },
  );

  const { data: loadMoreData } = useQuery(
    ['get/loadmore', cursor],
    async () => axios({
      url: `/api/notifications/?cursor=${cursor}`,
      method: 'GET',
      data: {
        user_id: userId,
      },

    }),
    {
      enabled: getNextData && cursor !== null,
      select: (res: AxiosResponse<RecentActivityResponse>) => res.data,

    },
  );

  function NotificationRenderer(): JSX.Element {
    let currentBuilding = '';
    let currentWorkspace = '';

    let currentDate = new Date();
    let isFirst = true;
    const renderDate = (date: string): string => {
      if (moment(date).format('DD-MM-YYYY') === moment(currentDate).format('DD-MM-YYYY')) {
        return 'Today';
      } if (moment(date).format('DD-MM-YYYY') === moment(new Date()).subtract(1, 'd').format('DD-MM-YYYY')) {
        return 'Yesterday';
      }
      return moment(date).format('MMMM DD, YYYY');
    };

    const allNotification: JSX.Element[] = [];

    filteredActivities.map((notification, index): JSX.Element => {
      const notificationJSX = (
        <div key={`${notification.description}-${index}`} className='notification-main-wapper'>
          {(moment(notification.time).format('DD-MM-YYYY') !== moment(currentDate).format('DD-MM-YYYY') || isFirst) && (
            <div className='date-tag'>
              {renderDate(notification.time)}
            </div>
          )}

          {renderDate(notification.time) === 'Yesterday' ? (
            <div className='name-wrapper'>
              <p className='building-tag'>
                {' '}
                {notification.workspace?.name !== undefined ? notification.workspace.name : ''}
              </p>
              <p className='property-tag'>
                { notification?.property_info}
              </p>
            </div>

          ) : renderDate(notification.time) !== 'Yesterday' && renderDate(notification.time) !== 'Today'
            ? (
              <div className='name-wrapper'>
                <p className='building-tag'>
                  {' '}
                  {notification.workspace?.name !== undefined ? notification.workspace.name : ''}
                </p>
                <p className='property-tag'>
                  { notification?.property_info}
                </p>
              </div>
            ) : (notification.workspace.name !== currentWorkspace) && (
              <div className='name-wrapper'>
                <p className='building-tag'>
                  {' '}
                  {notification.workspace?.name !== undefined ? notification.workspace.name : ''}
                </p>

                <p className='property-tag'>
                  { notification?.property_info}
                </p>
              </div>
            )}

          <div className='single-activity-wrapper'>

            <h5>
              {' '}
              {notification?.description?.substring(
                notification.description.indexOf(':') + 1,
                notification?.description?.indexOf(';'),
              )}
              {' '}
            </h5>

            <div className='card-box'>
              {notification?.user_info !== null && <Avatar className='activity-avatar' src={`${process.env.REACT_APP_IMAGE_URL}${notification?.user_info?.avatar === undefined ? '' : notification?.user_info?.avatar}`} />}
              <div className='right-side'>
                <h6>
                  {' '}
                  {notification.user_info !== null ? notification?.user_info?.name : ''}
                  <span>
                    {notification?.description?.substring(
                      0,
                      notification?.description?.indexOf(':'),
                    )}
                    {notification?.description?.substring(
                      notification.description.indexOf(';') + 1,
                      notification?.description?.length,
                    )}
                  </span>
                </h6>
                <p>
                  {' '}
                  {moment(notification.time).format('hh:mm A')}
                  {' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

      allNotification.push(notificationJSX);
      if (notification?.property_info !== currentBuilding) {
        currentBuilding = notification?.property_info;
      }
      if (notification?.workspace?.name !== currentWorkspace) {
        currentWorkspace = notification?.workspace?.name;
      }
      if (moment(notification.time).format('DD-MM-YYYY') !== moment(currentDate).format('DD-MM-YYYY')) {
        currentDate = moment(notification.time).toDate();
      }
      isFirst = false;

      return <div />;
    });

    return (
      <div>
        {allNotification}
      </div>
    );
  }

  useEffect(() => {
    if (recentActivities !== undefined) {
      setFilteredActivities(recentActivities.results);
    }
  }, [recentActivities]);

  useEffect(() => {
    if (inView && recentActivities?.next !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loadMoreData && loadMoreData?.next !== null ? setCursor(loadMoreData?.next?.split('cursor=')[1]?.split('?')[0]) : '';
      setgetNextData(true);
    } else {
      setgetNextData(false);
    }
  }, [inView]);

  useEffect(() => {
    if (getNextData && cursor !== null && recentActivities !== undefined && loadMoreData !== undefined && loadMoreData.results !== undefined) {
      setFilteredActivities([...filteredActivities, ...loadMoreData.results]);
    }
  }, [loadMoreData]);

  useEffect(() => {
    setTimeout(() => {
      setViewRef(true);
    }, 5000);
  }, []);

  return (
    <div className='recent-activity-wrapper'>
      <div className='ra-building-filter'>
        <WorkspaceFilter workspaceFilter={workspaceFilter} setWorkspaceFilter={setWorkspaceFilter} />
        <BuildingFilter
          buildingFilter={buildingFilter}
          setBuildingFilter={setBuildingFilter}
        />
      </div>
      <NotificationRenderer />
      {viewRef && recentActivities && recentActivities?.next !== null && <div ref={ref} />}

      {recentActivities?.results?.length === 0 && <p className='no-notifications'>No Notifications</p>}
    </div>
  );
}
