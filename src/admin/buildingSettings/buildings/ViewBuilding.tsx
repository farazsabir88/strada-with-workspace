import React, { useState } from 'react';
import Sidebar from 'admin/sidebar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PrimayButton from 'shared-components/components/PrimayButton';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import ApartmentIcon from '@mui/icons-material/Apartment';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IViewBuildingData } from './types';
import './_viewBuilding.scss';

export default function ViewBuilding(): JSX.Element {
  const buildingData = useLocation().state as IViewBuildingData;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const currentUserRole = useSelector((state: RootState) => state.workspaces.userPermission.currentUserRole);

  const [open, setOpen] = useState<boolean>(false);

  const { mutate: deleteBuilding, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `/api/building/${id}/`,
      method: 'delete',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/buildings').then();
        setOpen(false);
        enqueueSnackbar('Building deleted successfully');
        navigate('/workspace/settings/buildings');
      },
    },
  );
  const getBuildingPagePermissions = (): boolean => {
    if (currentUserRole !== null) {
      if (currentUserRole.role !== 2) {
        return true;
      }
      return false;
    }
    return true;
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='properties' />
      <div className='view-wrapper'>
        <StradaLoader open={deleteLoader} />
        <div className='d-flex align-items-center'>
          <div aria-hidden='true' className='cursor-pointer' onClick={(): void => { window.history.back(); }}>
            <ArrowBackIcon />
            {' '}
          </div>
          <h5 className='building-heading'>{buildingData.address}</h5>
        </div>
        {getBuildingPagePermissions()
        && (
          <div className='d-flex mt-4 mb-4'>
            <div
              className='button-div'
              onClick={(): void => {
                navigate('/workspace/buildings/editBuilding', { state: buildingData });
              }}
              aria-hidden='true'
            >
              <EditIcon />
              <p className='button-text'>Edit</p>
            </div>
            <div
              className='button-div'
              aria-hidden='true'
              onClick={(): void => {
                setOpen(true);
              }}
            >
              <DeleteIcon />
              <p className='button-text'>Delete</p>
            </div>
          </div>
        )}
        <h5 className='sub-heading' style={{ marginTop: !getBuildingPagePermissions() ? '20px' : '0px' }}>Business Address</h5>
        <div className='d-flex mt-3'>
          <LocationOnIcon />
          <p className='description'>
            {`${buildingData.address}, ${buildingData.city}, ${buildingData.state}, ${buildingData.country}, ${buildingData.zip}`}
          </p>
        </div>
        <div className='d-flex mt-3'>
          <ApartmentIcon />
          <p className='description'>
            {buildingData.company}
          </p>
        </div>
        <h5 className='sub-heading mt-4'>Contact Person</h5>
        <div className='d-flex mt-3'>
          <PersonIcon />
          <p className='description'>
            {`${buildingData.contact_first_name} ${buildingData.contact_last_name}`}
          </p>
        </div>
        <div className='d-flex mt-3'>
          <EmailIcon />
          <p className='description'>
            {buildingData.contact_email}
          </p>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={(): void => { setOpen(false); }}
        fullWidth
        maxWidth='xs'
        PaperProps={{
          style: {
            minWidth: '530px',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading-delete'> Delete property</h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='dialog-desc-building'>
            <p>
              Delete will remove property information permanently along with any:
            </p>
            <ul>
              <li>
                Events
              </li>
              <li>
                RFP
              </li>
              <li>
                Checklist
                {' '}

              </li>
              <li>
                COI

              </li>
              <li>
                PO
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={(): void => { setOpen(false); }}>Cancel</SecondaryButton>
          <div style={{ minWidth: '64px', marginLeft: '10px' }}>
            <PrimayButton onClick={(): void => { deleteBuilding(buildingData.id); }}>Delete</PrimayButton>
          </div>

        </DialogActions>
      </Dialog>
    </div>
  );
}
