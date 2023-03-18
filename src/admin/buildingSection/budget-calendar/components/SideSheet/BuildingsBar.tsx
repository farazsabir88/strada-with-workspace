/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Popover } from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useSnackbar } from 'notistack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IBuildingResponse } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface IBuildingOption {
  name: string;
  value: number;
}

export default function BuildingsBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectedBuilding, setSelectedBuiding] = React.useState<IBuildingOption | null>(null);
  // const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedBuilding]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { data: buildings = [] } = useQuery(
    ['building-in-sidesheet', singleSideSheetData?.workspace],
    async () => axios({
      url: `/api/filter/property/?workspace=${singleSideSheetData?.workspace}`,
      method: 'get',
    }),
    {
      enabled: singleSideSheetData?.workspace !== null,
      select: (res: AxiosResponse<IBuildingResponse>) => res.data.detail.map((building) => ({ name: building.address, value: building.id })),
    },
  );
  const { data: allBuildings = [] } = useQuery(
    ['all-building-in-sidesheet', singleSideSheetData?.workspace],
    async () => axios({
      url: '/api/filter/property/',
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<IBuildingResponse>) => res.data.detail.map((building) => ({ name: building.address, value: building.id })),
    },
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (singleSideSheetData !== null && singleSideSheetData.building !== null) {
      const currentBuilding = buildings.filter((building) => singleSideSheetData.building.id === building.value);
      if (currentBuilding.length !== 0) {
        setSelectedBuiding(currentBuilding[0]);
      } else {
        setSelectedBuiding(null);
      }
    } else {
      setSelectedBuiding(null);
    }
  }, [singleSideSheetData, buildings]);

  const { mutate: updateBuilding, isLoading: updatingBuilding } = useMutation(async (buildingId: number) => axios({
    url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      property: buildingId,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();

      enqueueSnackbar('Building updated successfully');
    },
    // onError: async (): Promise<void> => {
    //   await queryClient.invalidateQueries('others-events').then();

    //   await queryClient.invalidateQueries('sidesheet/get-events').then();
    //   await queryClient.invalidateQueries('user-assigned-events').then();
    //   await queryClient.invalidateQueries('prioritized-events').then();
    //   await queryClient.invalidateQueries('allevents/get-events').then();
    //   await queryClient.invalidateQueries('user-created-events').then();
    // },
  });
  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Building </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' onClick={handleClick} aria-hidden='true' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {updatingBuilding ? <StradaSpinner open={updatingBuilding} message='Updating' /> : (
            <>
              <p>
                {' '}
                {selectedBuilding ? selectedBuilding.name : <HorizontalRuleIcon fontSize='small' />}
                {' '}
              </p>
              <ArrowDropDownIcon fontSize='small' htmlColor='' />
            </>
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
            {/* <div className={selectedBuilding === null ? 'popover-option active' : 'popover-option'} key='firts-option' onClick={(): void => { setSelectedBuiding(null); }} aria-hidden='true'>
              <h5>No Assignee</h5>
            </div> */}
            {singleSideSheetData?.workspace === null ? allBuildings.map((building) => (
              <div className={selectedBuilding !== null && selectedBuilding.value === building.value ? 'popover-option active' : 'popover-option'} key={building.name} onClick={(): void => { updateBuilding(building.value); }} aria-hidden='true'>
                <h5>
                  {' '}
                  {building.name}
                  {' '}
                </h5>
              </div>
            )) : buildings.map((building) => (
              <div className={selectedBuilding !== null && selectedBuilding.value === building.value ? 'popover-option active' : 'popover-option'} key={building.name} onClick={(): void => { updateBuilding(building.value); }} aria-hidden='true'>
                <h5>
                  {' '}
                  {building.name}
                  {' '}
                </h5>
              </div>
            ))}

          </div>
        </Popover>

      </div>
    </div>
  );
}
