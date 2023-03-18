/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import type {
  IAction, ISSComment,
} from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import AssigneeBar from './AssigneeBar';
import BuildingsBar from './BuildingsBar';
import StatusBar from './StatusBar';
import GLCodeBar from './GLCodeBar';
import AmountBudgetedBar from './AmountBudgetedBar';
import FinalCostBar from './FinalCostBar';
import DueDateBar from './DueDateBar';
import DateRangeBar from './DateRangeBar';
import VendorBar from './VendorBar';
import MonthBar from './MonthBar';
import OccuranceBar from './OccuranceBar';
import TaskSection from './TaskSection';
import CommentSection from './CommentSection';
import ActivitySection from './ActivitySection';
import SideSheetHeader from './SideSheetHeader';
import TagsBar from './TagsBar';
import AttachmentBar from './AttachmentBar';
import PurchaseOrderBar from './PurchaseOrderBar';

interface IEventContent {

  setAction: (action: IAction) => void;
  dialogClose: () => void;
  isFullScreen: boolean;
  setIsFullScreen: (status: boolean) => void;

}

export default function EventContent({
  setAction, dialogClose, isFullScreen, setIsFullScreen,
}: IEventContent): JSX.Element {
  const [commentForEdit, setCommentForEdit] = useState<ISSComment | null>(null);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  return (
    <>
      <SideSheetHeader
        dialogClose={dialogClose}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}

      />
      <DialogContent style={{ marginTop: '18px' }}>
        <AssigneeBar />
        <BuildingsBar />
        <StatusBar />
        <AmountBudgetedBar />
        <VendorBar />
        <GLCodeBar />
        <DueDateBar />
        <DateRangeBar />
        <TagsBar />
        <FinalCostBar />
        <MonthBar />
        <OccuranceBar />
        {singleSideSheetData !== null && singleSideSheetData.po_id && <PurchaseOrderBar />}
        <TaskSection setAction={setAction} />
        <AttachmentBar />
        <ActivitySection setCommentForEdit={setCommentForEdit} />
      </DialogContent>
      <DialogActions className='side-sheet-dialog-action'>
        <CommentSection commentForEdit={commentForEdit} setCommentForEdit={setCommentForEdit} />
      </DialogActions>
    </>
  );
}
