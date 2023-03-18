/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, {
  useMemo, useState, useRef, useEffect,
} from 'react';
import {
  Button, Divider, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { Cell } from 'react-table';
import { useSnackbar } from 'notistack';
import StradaLoader from 'shared-components/components/StradaLoader';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import type { ICOIBuilding } from 'admin/buildingSettings/vendorCOI/types';
import makeStyles from '@mui/styles/makeStyles';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IresponseCelery, Iresult } from 'admin/COIs/AddCOIs/types';
import AddGLModal from './AddGLModal';
import type {
  IAction, IChartsOfAccountResponse, IWorkspaceCOA, IUploadResponse, IUploadDetails,
} from './types';

export function FileUploadIcon(): JSX.Element {
  return (
    <svg width='12' height='14' viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.761719 13.0117H11.2383V11.5H0.761719V13.0117ZM0.761719 5.48828H3.75V9.98828H8.25V5.48828H11.2383L6 0.25L0.761719 5.48828Z' fill='#00CFA1' />
    </svg>
  );
}

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        maxWidth: '550px',
        width: '550px',
      },

    },
  },
}));

export default function AccountsContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState<IAction>({ type: 'add', data: undefined });
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [coaList, setCOAList] = useState<IWorkspaceCOA[]>([]);
  const [celeryModalOpen, setCeleryModalOpen] = React.useState(false);
  const [getProgress, setGetProgress] = useState(false);
  const [fileUploadData, setFileUploadData] = useState<IUploadDetails[]>([]);
  const intervals = useRef<NodeJS.Timer | null>(null);

  const { isLoading } = useQuery(['get/chart_of_accounts', currentWorkspace, search], async () => axios({
    url: `/api/workspace-gl-code/?workspace=${currentWorkspace.id}`,
    method: 'get',
    params: {
      search,
    },
  }), {
    enabled: Boolean(currentWorkspace),
    select: (res: AxiosResponse<IChartsOfAccountResponse>) => res.data.detail,
    onSuccess: (res: IWorkspaceCOA[]) => {
      const data = res.map((item) => {
        if (item.buildings.length <= 3) {
          let coa = item;
          coa = { ...item, showTooltip: false, allBuildings: item.buildings };
          return coa;
        }
        let coa = item;
        const builds = item.buildings;
        const dividedData1 = item.buildings.slice(0, 3);
        const dividedData2 = item.buildings.slice(3, item.buildings.length);
        coa = {
          ...item, showTooltip: true, allBuildings: builds, buildings: dividedData1, tooltipData: dividedData2,
        };
        return coa;
      });
      setCOAList(data);
    },
  });

  const handleEdit = (dialogProps: IWorkspaceCOA): void => {
    setOpen(true);
    setAction({ type: 'edit', data: dialogProps });
  };

  const { mutate: deleteAccount, isLoading: deleting } = useMutation(async (payload: IDataObject) => axios({
    url: `/api/workspace-gl-code/${payload.id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/chart_of_accounts')
        .then();
      enqueueSnackbar('Successfully Deleted');
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
      Header: 'G/L Code',
      accessor: 'gl_code',
      width: '10%',
    },
    {
      Header: 'Account',
      accessor: 'gl_account',
      width: '30%',
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
                    <Tooltip title={getTooltipMessage(original.tooltipData)}>
                      <p className='ms-2'>
                        {`+ ${original.tooltipData?.length}`}
                      </p>
                    </Tooltip>
                  </div>
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
          <div style={{ textAlign: 'center' }}>
            <i
              className='fas fa-pen me-4'
              aria-hidden='true'
              onClick={(): void => {
                handleEdit(original);
              }}
            />
            <i
              className='far fa-trash-alt'
              aria-hidden='true'
              onClick={(): void => { deleteAccount(original); }}
            />
          </div>
        );
      },
    },
  ], [currentWorkspace]);

  const handleResetFilters = (): void => {
    setSearch('');
  };

  const checkProgress = (data: IUploadDetails[]): void => {
    if (intervals.current === null) {
      try {
        const newInterval = setInterval(async () => {
          await axios.post(`${process.env.REACT_APP_BASE_URL}api/celery-progress/`, data, {
          }).then(async (res: AxiosResponse<IresponseCelery>) => {
            const { result } = res.data;

            let runn = false;
            const unprogressedFiles: Iresult[] = result.filter((file) => !file.uploaded);
            runn = unprogressedFiles.length > 0;

            if (!runn) {
              clearInterval(newInterval);
              intervals.current = null;
              setCeleryModalOpen(false);
              setGetProgress(false);
              if (result[0].uploaded && result[0].progress === -1) {
                enqueueSnackbar(result[0].result);
              } else {
                await queryClient.invalidateQueries('get/chart_of_accounts').then();
                enqueueSnackbar(`Accounts were imported from ${fileUploadData[0].name}.`);
              }
            }
          }).catch(() => {
            clearInterval(newInterval);
            intervals.current = null;
            setCeleryModalOpen(false);
            setGetProgress(false);
            enqueueSnackbar('Failed to upload file, please try again.');
          });
        }, 1000);
        intervals.current = newInterval;
      } catch (e) {
        setCeleryModalOpen(false);
        setGetProgress(false);
        enqueueSnackbar('Failed to upload file, please try again.');
      }
    }
  };

  useEffect(() => {
    if (getProgress) {
      checkProgress(fileUploadData);
    }
  }, [getProgress, fileUploadData]);

  const { mutate: uploadGLAccount } = useMutation(
    async (file: File) => {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('workspace', String(currentWorkspace.id));

      return axios({
        url: '/api/workspace-gl-code/upload_file/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: (res: AxiosResponse<IUploadResponse>) => {
        setFileUploadData([res.data.detail]);
        setGetProgress(true);
      },
      onError: () => {
        setGetProgress(false);
        enqueueSnackbar('Failed to upload file, check file format and try again.');
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      setCeleryModalOpen(true);
      uploadGLAccount(e.target.files[0]);
    }
  };

  const onInputClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const onCeleryClose = (): void => {
    setGetProgress(false);
    setCeleryModalOpen(false);
  };

  return (
    <>
      <StradaLoader open={isLoading || deleting} />
      {coaList.length === 0 && search === '' ? (
        <div className='empty-array-wrapper'>
          <p>There are no G/L Codes</p>
          <div className='d-flex'>

            <Button
              variant='text'
              className='text-transform-none me-3 ms-1'
              style={{ border: '0', padding: '5px 10px', color: '#00cfa1' }}
              component='label'
            >
              <div className='icon-wrapper me-2'>
                <FileUploadIcon />
              </div>
              <h6>Upload</h6>
              <input hidden accept='.xlsx,.xls,.csv' multiple={false} type='file' onChange={handleChange} onClick={onInputClick} />
            </Button>

            <PrimayButton onClick={(): void => { setOpen(true); }}> Add G/L Code </PrimayButton>
          </div>
        </div>
      ) : (
        <div className='vendor-contacts-wrapper' style={{ marginTop: '86px' }}>
          <div className='header'>
            <h6> Chart of Accounts </h6>
            <div className='right-side d-flex align-items-center'>
              <div className='search-wrapper'>
                <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
              </div>
              <Button
                variant='text'
                className='text-transform-none me-1 ms-1'
                style={{ border: '0', padding: '5px 10px', color: '#00cfa1' }}
                component='label'
              >
                <FileUploadIcon />
                <p className='ms-1'>Upload</p>
                <input hidden accept='.xlsx,.xls,.csv' multiple={false} type='file' onChange={handleChange} onClick={onInputClick} />
              </Button>

              <div className='create-new-button ms-1'>
                <PrimayButton onClick={(): void => { setOpen(true); }}> New G/L Code </PrimayButton>
              </div>
            </div>

          </div>
          <Divider sx={{ mt: 3, mb: 0.9 }} />
          { coaList.length === 0 && !isLoading
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
                <CustomTable {...{ columns, data: coaList }} />
              </div>
            )}
        </div>

      )}

      <AddGLModal
        handleClose={(): void => { setOpen(false); setAction({ type: 'add', data: undefined }); }}
        action={action}
        open={open}
      />

      <Dialog
        open={celeryModalOpen}
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle>
          <p className='gl-diloag-title'>
            Uploading in progress
          </p>
        </DialogTitle>
        <DialogContent style={{ color: 'rgba(33, 33, 33, 0.6)' }}>
          This should take a few minutes. If you’d like, you can close this dialog and continue working.
        </DialogContent>
        <DialogActions>
          <Button variant='text' className='text-transform-none me-3 primary-color' onClick={onCeleryClose}>
            Close
          </Button>
          <div className='upload-button'>
            <StradaSpinner open message='Uploading' />
          </div>
        </DialogActions>
      </Dialog>

    </>
  );
}
