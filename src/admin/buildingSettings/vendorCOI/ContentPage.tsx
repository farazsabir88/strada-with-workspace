/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  ClickAwayListener, Fade, IconButton, Paper, Popper, Tooltip,
} from '@mui/material';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import React, { useMemo, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Cell } from 'react-table';
import { useSnackbar } from 'notistack';
import PrimayButton from 'shared-components/components/PrimayButton';
import CustomTable from 'shared-components/tables/CustomTable';
import { encrypt } from 'shared-components/hooks/useEncryption';
import type { IDataObject } from 'formsTypes';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import StradaLoader from 'shared-components/components/StradaLoader';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import type { IVendorICO, IWorkspaceVendorCOI, ICOIBuilding } from './types';

export default function ContentPage(): JSX.Element {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [coiList, setCOIList] = useState<IWorkspaceVendorCOI[]>([]);

  const { isLoading } = useQuery(['get/vendor-coi', search], async () => axios({
    url: `api/workspace-vendor-coi/?workspace=${currentWorkspace.id}`,
    method: 'get',
    params: {
      search,
    },
  }), {
    select: (res: AxiosResponse<IVendorICO>) => res.data.detail,
    onSuccess: (res: IWorkspaceVendorCOI[]) => {
      const data = res.map((item) => {
        if (item.buildings.length <= 3) {
          let coi = item;
          coi = { ...item, showTooltip: false };
          return coi;
        }
        let coi = item;
        const dividedData1 = item.buildings.slice(0, 3);
        const dividedData2 = item.buildings.slice(3, item.buildings.length);
        coi = {
          ...item, showTooltip: true, buildings: dividedData1, tooltipData: dividedData2,
        };
        return coi;
      });
      setCOIList(data);
    },
  });

  const { mutate: deleteVendorCio, isLoading: isDeleting } = useMutation(async (id: number | string) => axios({
    url: `api/workspace-vendor-coi/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async () => {
      enqueueSnackbar('Vendor COI deleted successfully');
      await queryClient.invalidateQueries('get/vendor-coi')
        .then();
    },
    onError: (): void => {
      enqueueSnackbar('Vendor COI delete failed', { variant: 'error' });
    },
  });

  const getTooltipMessage = (list: ICOIBuilding[] | undefined): JSX.Element => {
    if (list !== undefined) {
      return (
        <ul style={{ paddingLeft: '1rem', margin: '0', fontSize: '13px' }}>
          {list.map((data) => (
            <li>
              {data.address}
            </li>
          ))}
        </ul>
      );
    }
    return <div />;
  };

  const columns = useMemo(() => [
    {
      Header: 'Vendor Category Name',
      accessor: 'name',
      width: '40%',
    },
    {
      Header: 'Available for properties',
      accessor: 'names',
      width: '50%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;
        return (
          <div className='d-flex'>
            {original.building_access_all && (
              <div className='building-cell ms-2'>
                All Buildings
              </div>
            )}
            {original.showTooltip !== null && original.showTooltip === false ? original.buildings.map((building) => (
              <div className='building-cell ms-2'>
                {building.address}
              </div>
            ))
              : (
                <div className='d-flex'>
                  {original.buildings.map((building) => (
                    <div className='building-cell ms-2'>
                      {building.address}
                    </div>
                  ))}
                  <div className='tooltipData'>
                    <Tooltip title={getTooltipMessage(original?.tooltipData)}>
                      <p className='ms-2'>
                        {`+ ${original.tooltipData?.length}`}
                      </p>
                    </Tooltip>
                  </div>
                  {/* <div className='tooltips'>
                    Hover over me
                    <span className='tooltiptexts'>
                      <ul>
                        <li>1</li>
                        <li>2</li>
                      </ul>

                    </span>
                  </div> */}
                </div>
              )}
          </div>
        );
      },

    },
    {
      Header: '',
      accessor: 'account_new',
      width: '10%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;

        return (
          <div style={{ textAlign: 'right' }}>
            <StradaLoader open={isDeleting} message='Delete in progress' />
            <PopupState variant='popper' popupId='demo-popup-popper'>
              {(popupState): JSX.Element => (
                <div>
                  <IconButton {...bindToggle(popupState)}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Popper {...bindPopper(popupState)} transition>
                    {({ TransitionProps }): JSX.Element => (
                      <ClickAwayListener onClickAway={(): void => { popupState.close(); }}>
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper className='chart-accounts-popover'>
                            <div
                              className='chart-btn'
                              onClick={(): void => { navigate(`/workspace/settings/cio/${encrypt(original.id)}`); popupState.close(); }}
                              aria-hidden='true'
                            >
                              Edit
                            </div>
                            <div className='chart-btn' onClick={(): void => { deleteVendorCio(original.id); popupState.close(); }} aria-hidden='true'> Delete </div>
                          </Paper>
                        </Fade>
                      </ClickAwayListener>
                    )}
                  </Popper>
                </div>
              )}
            </PopupState>

          </div>
        );
      },
    },
  ], [deleteVendorCio, navigate]);

  const handleResetFilters = (): void => {
    setSearch('');
  };

  return (
    <>
      <StradaLoader open={isLoading} />
      {coiList.length === 0 && search === '' ? (
        <div className='empty-array-wrapper'>
          <p>There are no Vendor COI</p>
          <div className='create-new-button'>
            <PrimayButton onClick={(): void => { navigate('/workspace/settings/cio/new'); }}>
              Add vendor category
            </PrimayButton>
          </div>
        </div>
      ) : (
        <div className='vendor-coi-wrapper'>
          <div className='header'>
            <h6> Vendor COI</h6>
            <div className='right-side d-flex align-items-center'>
              <div className='search-wrapper'>
                <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
              </div>
              <div className='create-new-button ms-3'>
                <PrimayButton onClick={(): void => { navigate('/workspace/settings/cio/new'); }}>
                  Add vendor category
                </PrimayButton>
              </div>
            </div>
          </div>

          { coiList.length === 0 && !isLoading
            ? (
              <div className='empty-array-wrapper'>
                <p>No data were found matching your search</p>
                <div className='create-new-button'>
                  <PrimayButton
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </PrimayButton>
                </div>
              </div>
            ) : (
              <div className='vendor-table-wrapper'>
                <CustomTable {...{ columns, data: coiList }} />
              </div>
            )}
        </div>
      )}
    </>
  );
}
