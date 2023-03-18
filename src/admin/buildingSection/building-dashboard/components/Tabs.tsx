import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MyEvents from '../TabPages/MyEvents';
import Reports from '../TabPages/Reports';
import RecentActivities from '../TabPages/RecentActivities';
import CalendarPage from '../TabPages/CalendarPage';

export interface TabsProps {
  id: number;
  heading: string;
  component: JSX.Element;
}

export default function Tabs(): JSX.Element {
  const { tabId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabsProps>({
    id: 1,
    heading: 'My events',
    component: <div> my events</div>,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tabs: TabsProps[] = useMemo(() => [
    {
      id: 1,
      heading: 'My events',
      component: <MyEvents />,
    },
    {
      id: 2,
      heading: 'Calendar',
      component: <CalendarPage />,
    },
    {
      id: 3,
      heading: 'Reports',
      component: <Reports />,
    },
    {
      id: 4,
      heading: 'Recent activity',
      component: <RecentActivities />,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  useEffect(() => {
    const currentTab = tabs.filter((tab) => tab.id === Number(tabId));
    if (currentTab.length > 0) {
      setActiveTab(currentTab[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId]);

  return (
    <div className='tabs-page'>
      <div className='tabs-wrapper'>
        {tabs.map((tab) => (
          <div
            onClick={(): void => {
              navigate(`/workspace/dashboard/${tab.id}`);
            }}
            aria-hidden='true'
            className={
              tab.id === activeTab.id ? 'single-tab active' : 'single-tab'
            }
            key={tab.heading}
          >
            {' '}
            <h6>
              {' '}
              {tab.heading}
              {' '}
            </h6>
            {' '}
          </div>
        ))}
      </div>

      {activeTab.component}
    </div>
  );
}
