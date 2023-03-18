/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid, IconButton, Paper, Popper, Stack, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { RootState } from 'mainStore';
import { useDispatch, useSelector } from 'react-redux';
import InputField from 'shared-components/inputs/InputField';
import PrimayButton from 'shared-components/components/PrimayButton';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import StradaLoader from 'shared-components/components/StradaLoader';
import CameraOverlay from 'assests/images/camera_overlay.svg';
import { FilePond, registerPlugin } from 'react-filepond';
import type {
  FilePondFile, FilePondServerConfigProps,
} from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import { setWorkspace } from 'admin/store/currentWorkspaceSlice';
import type { Iworkspace } from 'types';
import type { IDetailErrorResponse } from 'admin/AdminFormTypes';

interface FileProps extends FilePondFile, FilePondServerConfigProps {

}
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop);

export default function DetailForm(): JSX.Element {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const currentUserRole = useSelector((state: RootState) => state.workspaces.userPermission.currentUserRole);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [workspaceNameError, setWorkspaceNameError] = useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [files, setFiles] = React.useState<FileProps[]>([]);

  const handleClose: () => void = () => {
    setOpen(false);
    setFiles([]);
  };

  useEffect(() => {
    setWorkspaceName(currentWorkspace.name);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const initials = currentWorkspace.name.charAt(0);
    const nameElement = document.getElementById('name');
    if (nameElement !== null) {
      nameElement.innerHTML = initials;
    }
  }, [currentWorkspace]);

  useEffect(() => {
  }, [currentWorkspace]);

  const updateCurrentWorkspace = async (id: number | undefined): Promise<Iworkspace> => {
    const res = await axios({
      url: `api/workspace/${id}/`,
      method: 'get',
    });
    const data: Iworkspace = await res.data.detail;
    if (Object.keys(data).length > 0) {
      dispatch(setWorkspace(data));
      return data;
    }
    return currentWorkspace;
  };

  const getDetailPagePermissions = (): boolean => {
    if (currentUserRole !== null) {
      if (currentUserRole.role === 0) {
        return true;
      }
      return false;
    }
    return true;
  };

  const handleOpen: () => void = () => {
    if (getDetailPagePermissions()) {
      setOpen(true);
    }
  };

  const { mutate: uploadPicture, isLoading: uploadLoader } = useMutation(
    async () => {
      const formData = new FormData();
      formData.append('logo', files[0].file);

      return axios({
        url: `/api/workspace/${currentWorkspace.id}/`,
        method: 'PATCH',
        data: formData,
      });
    },
    {
      onSuccess: async () => {
        enqueueSnackbar('Picture Uploaded successfully.');
        await updateCurrentWorkspace(currentWorkspace.id);
        handleClose();
      },
      onError: (e: IDetailErrorResponse) => {
        if (e.data.response.message) {
          enqueueSnackbar(e.data.response.message);
          handleClose();
        } else {
          enqueueSnackbar('Error in Uploading Picture. Try again.');
          handleClose();
        }
      },
    },
  );

  const { mutate: updateName, isLoading: updateLoader } = useMutation(
    async () => axios({
      url: `/api/workspace/${currentWorkspace.id}/`,
      method: 'PATCH',
      data: {
        name: workspaceName,
      },
    }),
    {
      onSuccess: async () => {
        enqueueSnackbar('Changes were saved.');
        await updateCurrentWorkspace(currentWorkspace.id);
      },
      onError: () => {
        enqueueSnackbar('Error Occured.');
      },
    },
  );

  const handleSave = (): void => {
    updateName();
  };

  const handlePictureUpload = (): void => {
    uploadPicture();
  };

  const handleDeleteClick = (): void => {
    setOpenDeleteDialog(true);
  };

  const { mutate: undoDeleteWorkspace, isLoading: undoLoader } = useMutation(
    async () => axios({
      url: `/api/workspace/${currentWorkspace.id}/`,
      method: 'PATCH',
      data: {
        is_archived: false,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get-workspace').then();
        navigate('/workspaces');
      },
      onError: () => {
        enqueueSnackbar('Error Occured.');
      },
    },
  );

  const onUndoClick = (): void => {
    undoDeleteWorkspace();
    closeSnackbar();
  };

  const { mutate: deleteWorkspace, isLoading: deleteLoader } = useMutation(
    async () => axios({
      url: `/api/workspace/${currentWorkspace.id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        enqueueSnackbar(`Workspace "${currentWorkspace.name}" was deleted`, {
          action: () => (
            <Button
              size='small'
              style={{ color: '#00cfa1' }}
              onClick={(): void => { onUndoClick(); }}
            >
              Undo
            </Button>
          ),
        });
        setOpenDeleteDialog(false);
        await queryClient.invalidateQueries('get-workspace').then();
        navigate('/workspaces');
      },
      onError: () => {
        enqueueSnackbar('Error deleting workspace. Try again.');
        setOpenDeleteDialog(true);
      },
    },
  );

  useEffect(() => {
    if (deleteLoader) {
      setOpenDeleteDialog(false);
    }
  }, [deleteLoader]);

  return (
    <div style={{ display: 'flex' }} className='Main-purchase-orders'>
      <StradaLoader open={deleteLoader || undoLoader || updateLoader} />
      <div className='purchases'>
        <Grid container mt={2} spacing={3} className='search-field-wrapper'>
          <Grid item sm={6}>
            <p
              className='search-field-typo'
              style={{
                marginLeft: '10px', fontFamily: 'Roboto-Medium', fontSize: '24px', color: 'rgba(33, 33, 33, 0.87)',
              }}
            >
              Workspace details
            </p>
          </Grid>
          <Grid item sm={6} className='search-field'>
            <PopupState variant='popper' popupId='demo-popup-popper'>
              {(popupState): JSX.Element => (
                <div>
                  {getDetailPagePermissions()
                    && (
                      <IconButton {...bindToggle(popupState)}>
                        <MoreHorizIcon fontSize='small' />
                      </IconButton>
                    )}
                  <Popper
                    {...bindPopper(popupState)}
                    transition
                  >
                    {({ TransitionProps }): JSX.Element => (
                      <ClickAwayListener onClickAway={(): void => { popupState.close(); }}>
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper className='rfp-popover'>
                            <div
                              className='chart-btn'
                              onClick={(): void => {
                                handleDeleteClick();
                                popupState.close();
                              }}
                              aria-hidden='true'
                            >
                              Delete
                            </div>
                          </Paper>
                        </Fade>
                      </ClickAwayListener>
                    )}
                  </Popper>
                </div>
              )}
            </PopupState>
          </Grid>
        </Grid>

        <Stack direction='column' className='mt-3 edit-workspace-wrapper'>

          {currentWorkspace.logo_url === null ? (
            <div id='container' onClick={handleOpen} aria-hidden='true'>
              <div id='name' />
              <div className='overlay'>
                <img src={CameraOverlay} alt='overlay' className='icon' />
              </div>
            </div>
          ) : (
            <div id='container' onClick={handleOpen} aria-hidden='true' style={{ background: 'none' }}>
              <img id='name' src={`${process.env.REACT_APP_IMAGE_URL}${currentWorkspace.logo_url}`} alt='workspace' style={{ height: '100px', width: '100px' }} />
              <div className='overlay'>
                <img src={CameraOverlay} alt='overlay' className='icon' />
              </div>
            </div>
          )}

          <div className={workspaceNameError ? 'input-field-wrapper-error' : 'input-field-wrapper'}>
            <InputField
              type='text'
              label='Name'
              name='name'
              disabled={!getDetailPagePermissions()}
              value={workspaceName}
              onChange={(event): void => {
                setWorkspaceName(event.target.value);
                setWorkspaceNameError(false);
              }}
            />
            <label className='error-message' style={{ paddingBottom: '0px' }}>
              {workspaceNameError ? 'This workspace already exists' : ''}
            </label>
          </div>

          <div className='text-end'>
            <PrimayButton style={{ width: '10%' }} disabled={workspaceName.replace(/^\s+|\s+$/g, '') === '' || !getDetailPagePermissions()} onClick={handleSave}>Save</PrimayButton>
          </div>
        </Stack>
      </div>

      <Dialog open={openDeleteDialog} aria-labelledby='form-dialog-title'>
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>
            Delete the
            {` "${currentWorkspace.name}" `}
            workspace?
          </div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            This will delete the workspace, along with any:
            <ul>
              <li>Properties.</li>
              <li>Events.</li>
              <li>COIs.</li>
              <li>Purchase Orders.</li>
              <li>Templates.</li>
            </ul>
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => { setOpenDeleteDialog(false); }} color='primary' style={{ color: '#00CFA1', textTransform: 'inherit' }}>Cancel</Button>
          <Button
            onClick={(): void => { deleteWorkspace(); }}
            style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }}
            color='primary'
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog aria-labelledby='form-dialog-title' open={open}>
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <Typography sx={{ fontSize: '20px', margin: '10px 0px 10px 0' }}>Upload Workspace Picture</Typography>
          <FilePond
            files={[...files.map((singleFile: FilePondFile) => singleFile.file)]}
            allowImageCrop
            allowMultiple={false}
            // allowFileTypeValidation
            // allow
            acceptedFileTypes={['image/png', 'image/jpeg']}
            imageCropAspectRatio='1:1'
            onupdatefiles={setFiles}
            labelIdle='Drag & Drop an image or <span class="filepond--label-action">click</span>'
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={uploadLoader} color='primary' style={{ color: '#00CFA1', textTransform: 'inherit' }}>Cancel</Button>
          <Button
            onClick={handlePictureUpload}
            style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }}
            color='primary'
            disabled={uploadLoader || files.length === 0}
            variant='contained'
          >
            {uploadLoader ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
