/* eslint-disable react-hooks/exhaustive-deps */
import { Popover } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import DialogSkeleton from 'shared-components/components/DialogSkeleton';

export interface IBuildingOption {
  name: string;
  value: number;
  color: string;
  background: string;
}

const optionsList = [
  {
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    value: 2,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
  {
    name: 'Scheduled',
    value: 3,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 4,
    color: 'rgb(76, 175, 80)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'As Needed',
    value: 5,
    color: 'rgb(0, 172, 193)',
    background: 'rgba(0, 172, 193, 0.08)',
  },
  {
    name: 'Contingency',
    value: 6,
    color: 'rgb(216, 27, 96)',
    background: 'rgba(216, 27, 96, 0.08)',
  },
  {
    name: 'Contract',
    value: 7,
    color: 'rgb(94, 53, 177)',
    background: 'rgba(94, 53, 177, 0.08)',
  },
];

export default function StatusBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const [openModal, setOpenModal] = React.useState(false);
  const [associativeVal, setAssociativeVal] = React.useState<number>(0);
  const [tagVal, setTagVal] = React.useState<string>('');

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<IBuildingOption | null>({
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  });
  useEffect(() => {
    if (sideSheetData !== null) {
      if (sideSheetData.status !== null) {
        const currentStatus = optionsList.filter((status) => sideSheetData.status === status.value);
        setSelectedTag(currentStatus[0]);
      }
    } else {
      setSelectedTag(null);
    }
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  }, [sideSheetData, sideSheetData && sideSheetData.status]);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedTag]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { mutate: updateStatus, isLoading: updatingStatus } = useMutation(async (statusId: number) => axios({
    url: `/api/budget-calendar/event/${sideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      status: statusId,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Status updated successfully');
    },
  });
  const statusModal = (val: number): void => {
    setAssociativeVal(val);
    if ([1, 2, 3, 4].includes(val)) {
      updateStatus(val);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (sideSheetData?.associative_key !== null) {
      setOpenModal(true);
    } else {
      updateStatus(val);
    }
  };

  const confirmStatus = (): void => {
    setOpenModal(false);
    updateStatus(associativeVal);
  };

  useEffect(() => {
    if (associativeVal !== 0) {
      const tag = optionsList.filter((status) => associativeVal === status.value);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      tag[0].name && setTagVal(tag[0].name);
    }
  }, [associativeVal]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Status </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' onClick={handleClick} aria-hidden='true'>
          {updatingStatus ? <StradaSpinner open={updatingStatus} message='Updating' /> : (
            <div>
              {selectedTag !== null ? (
                <div style={{ background: selectedTag.background, color: selectedTag.color }} className='single-tag'>
                  {' '}
                  {selectedTag.name}
                </div>
              ) : '-'}
            </div>
          )}

        </div>
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
          <div className='assignee-popover'>
            {optionsList.map((status) => (
              <div className={selectedTag !== null && selectedTag.value === status.value ? 'popover-option active' : 'popover-option'} key={status.name} onClick={(): void => { statusModal(status.value); handleClose(); }} aria-hidden='true'>
                <div style={{ marginLeft: '4px', background: status.background, color: status.color }} className='single-tag-global'>
                  {' '}
                  {status.name}
                </div>
              </div>
            ))}

          </div>
        </Popover>
        <DialogSkeleton
          open={openModal}
          handleClose={(): void => { setOpenModal(false); setAssociativeVal(0); }}
          action={confirmStatus}
          text={`Would you like to change status to ${tagVal} for all associated events?`}
          header={`Change status to ${tagVal}`}
          btnText='Change'

        />
      </div>
    </div>
  );
}
