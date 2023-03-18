import React, { useEffect, useState } from 'react';
import { DialogActions, DialogContent } from '@mui/material';
import type {
  IAction, IEventTask, IEventTaskResponse, ISSComment,
} from 'admin/buildingSection/budget-calendar/types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { setCurrentTask } from 'admin/store/SideSheetData';
import TaskSheetHeader from './TaskSheetComponents/TaskSheetHeader';
import TaskAssigneeBar from './TaskSheetComponents/TaskAssigneeBar';
import TaskStatusBar from './TaskSheetComponents/TaskStatusBar';
import TaskVendorBar from './TaskSheetComponents/TaskVendorBar';
import TaskDueDateBar from './TaskSheetComponents/TaskDueDateBar';
import TaskDateRangeBar from './TaskSheetComponents/TaskDateRangeBar';
import TaskDescriptionBar from './TaskSheetComponents/TaskDescriptionBar';
import TaskCommentSection from './TaskSheetComponents/TaskCommentSection';
import TaskActivitySection from './TaskSheetComponents/TaskActivitySection';
import TaskAttachmentBar from './TaskSheetComponents/TaskAttachmentBar';

interface ITaskContent {
  action: IAction;
  setAction: (action: IAction) => void;
  isFullScreen: boolean;
  setIsFullScreen: (status: boolean) => void;
}
export default function TaskContent(props: ITaskContent): JSX.Element {
  const {
    action, setAction, isFullScreen, setIsFullScreen,
  } = props;
  const dispatch = useDispatch();
  const [showAttachment, setShowAttachment] = useState(false);
  const [commentForEdit, setCommentForEdit] = useState<ISSComment | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentTask !== null && currentTask !== undefined) {
      if (currentTask.attachments.length > 0) {
        setShowAttachment(true);
      }
    }
  }, [currentTask]);
  useQuery(
    ['get-single-task-data', action.task?.id],
    async () => axios({
      url: `/api/budget-calendar/task/${action.task?.id}/`,
      method: 'GET',
    }),
    {
      enabled: action.variant === 'task',
      select: (res: AxiosResponse<IEventTaskResponse>) => res.data.detail,
      onSuccess: (data: IEventTask): void => {
        dispatch(setCurrentTask(data));
      },
    },
  );
  return (
    <>
      <TaskSheetHeader
        action={action}
        setAction={setAction}
        setShowAttachment={setShowAttachment}
        showAttachment={showAttachment}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
      />
      <DialogContent style={{ marginTop: '18px' }}>
        <TaskAssigneeBar action={action} />
        <TaskStatusBar action={action} />
        <TaskVendorBar action={action} />
        <TaskDueDateBar action={action} />
        <TaskDateRangeBar action={action} />
        <TaskDescriptionBar action={action} />
        {showAttachment && <TaskAttachmentBar action={action} />}
        <TaskActivitySection setCommentForEdit={setCommentForEdit} />
      </DialogContent>
      <DialogActions className='side-sheet-dialog-action'>

        <TaskCommentSection
          commentForEdit={commentForEdit}
          setCommentForEdit={setCommentForEdit}
        />
      </DialogActions>
    </>
  );
}
