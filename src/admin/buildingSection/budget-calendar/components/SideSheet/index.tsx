/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import type { SlideProps } from '@mui/material/Slide';
import Slide from '@mui/material/Slide';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { IAction, ISideSheetData, ISideSheetResponse } from 'admin/buildingSection/budget-calendar/types';
import { setSingleSideSheetData } from 'admin/store/SideSheetData';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import StradaLoader from 'shared-components/components/StradaLoader';
import EventContent from './EventContent';
import TaskContent from './TaskContent';

const useStyles = makeStyles(() => ({
  scrollPaper: {
    justifyContent: 'flex-end',
  },
}));
const useStylesCenter = makeStyles(() => ({
  root: {
    background: 'white',
  },
  scrollPaper: {
    height: '96%',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
  },
}));
interface IProps {
  open: boolean;
  handleClose: () => void;
}

function Transition(props: SlideProps): JSX.Element {
  return <Slide direction='left' {...props} />;
}

function getWindowSize(): { innerWidth: number;innerHeight: number } {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

export default function SideSheet({ open, handleClose }: IProps): JSX.Element {
  const classes = useStyles();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const classesCenter = useStylesCenter();
  const [action, setAction] = useState<IAction>({
    variant: 'event',
    task: null,
    data: null,
    isScheduling: false,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const dispatch = useDispatch();
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const sideSheetLoader = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetLoader);

  const dialogClose = (): void => {
    handleClose();
    setAction({
      ...action,
      variant: 'event',
      task: null,
      data: null,
    });
  };

  const { data: singleSideSheetData = null, refetch } = useQuery(
    'get-single-sidesheet',
    async () => axios({
      url: `/api/budget-calendar/event/${sideSheetData?.id}/`,
      method: 'GET',
    }),
    {
      enabled: sideSheetData !== null,
      select: (res: AxiosResponse<ISideSheetResponse>) => {
        let newData = res.data.detail;
        const comms = newData.comments.map((c) => ({ ...c, commentString: c.comment }));
        newData = { ...newData, comments: comms };
        // res.data.detail.comments = res.data.detail.comments.map((c) => ({ ...c, commentString: c.comment }));
        // return res.data.detail;
        return newData;
      },
      onSuccess: (response: ISideSheetData): void => {
        if (action.variant === 'task' && action.task !== null) {
          const currentTask = response.tasks.filter((tsk) => tsk.id === action.task?.id);
          if (currentTask.length > 0) {
            setAction({
              ...action,
              task: currentTask[0],
            });
          } else {
            setAction({
              ...action, task: null,
            });
          }
        }
      },
    },
  );

  useEffect(() => {
    if (sideSheetData !== null) {
      refetch().catch((e) => { throw e; });
    }
  }, [sideSheetData]);

  useEffect(() => {
    if (singleSideSheetData !== null) {
      dispatch(setSingleSideSheetData(singleSideSheetData));
    }
  }, [singleSideSheetData]);

  useQuery(
    ['get-single-task', action.task?.id],
    async () => axios({
      url: `/api/budget-calendar/task/${action.task?.id}/`,
      method: 'GET',
    }),
    {
      enabled: action.task !== null && action.variant === 'task',
      select: (res: AxiosResponse<ISideSheetData>) => res.data,
      onSuccess: (data: ISideSheetData): void => {
        if (action.variant === 'task' && action.task !== null) {
          setAction({
            ...action,
            data,
          });
        }
      },

    },
  );

  useEffect(() => {
    function handleWindowResize(): void {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const getSideSheetWidth = (): string => {
    if (!isFullScreen) {
      if (windowSize.innerWidth > 565 && windowSize.innerWidth < 957) {
        return '404px';
      } if (windowSize.innerWidth > 958 && windowSize.innerWidth < 1018) {
        return '525px';
      }
      return '560px';
    }
    return '560px';
  };

  return (
    <div
      className='relative'
      onMouseEnter={(e): void => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseLeave={(e): void => {
        e.stopPropagation();
        e.preventDefault();
      }}

    >
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={isFullScreen ? undefined : Transition}
        keepMounted
        // onClose={dialogClose}
        hideBackdrop
        disableScrollLock
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        classes={isFullScreen ? classesCenter : classes}
        className={isFullScreen ? 'side-sheet-dialog-fullscreen' : 'side-sheet-dialog'}
        PaperProps={{
          elevation: 2,
          style: {
            width: getSideSheetWidth(),
            boxShadow: '0 8px 10px 1px rgb(97 97 97 / 14%), 0 3px 14px 2px rgb(97 97 97 / 12%), 0 5px 5px -3px rgb(97 97 97 / 20%)',
            top: isFullScreen ? '20px' : '0',
          },
        }}
        BackdropProps={{
          style: {
            background: 'transparent',
          },
        }}
      >
        <StradaLoader open={sideSheetLoader} />
        {action.variant === 'task' && action.task !== null ? (
          <TaskContent
            action={action}
            setAction={setAction}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
          />
        ) : (
          <EventContent
            setAction={setAction}
            dialogClose={dialogClose}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
          />
        )}
      </Dialog>
    </div>
  );
}
