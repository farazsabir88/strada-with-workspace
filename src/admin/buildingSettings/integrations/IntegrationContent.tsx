import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PrimayButton from 'shared-components/components/PrimayButton';
import { decrypt } from 'shared-components/hooks/useEncryption';
import StandardButton from 'shared-components/components/StandardButton';
import yardiSvg from 'assests/images/yardi.svg';
import MRISvg from 'assests/images/MRI.svg';
import type { RootState } from 'mainStore';
import type { ISaveYardiPayload, IYardiCredentials } from 'admin/AdminFormTypes';
import { getBuildingIntegrations } from 'admin/store/buildingIntegration';
import type {
  IConnectYardiResponse,
  IYardiConnectionType,
} from './types';
import YardiDialog from './YardiDialog';
import YardiPropertyDialog from './YardiPropertyDialog';

export function SwitchIcon(): JSX.Element {
  return (
    <svg
      width='14'
      height='15'
      viewBox='0 0 14 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11.5 8.86328V4.75C11.5 3.94141 10.832 3.23828 9.98828 3.23828V0.25H8.51172V3.23828H5.59375L11.3594 9.00391L11.5 8.86328ZM5.48828 0.25H4.01172V1.65625L5.48828 3.16797V0.25ZM1.09375 0.882812L0.0390625 1.9375L2.53516 4.43359C2.5 4.53906 2.5 4.64453 2.5 4.75V8.86328L5.13672 11.5V13.75H8.86328V11.5L9.25 11.1484L12.5898 14.4883L13.6445 13.4336L1.09375 0.882812Z'
        fill='#00CFA1'
      />
    </svg>
  );
}

export default function IntegrationContent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [propertyDialog, setProertyDialog] = useState<boolean>(false);
  const [connectionTypes, setConnnectionTypes] = useState<IYardiConnectionType[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { buildingId } = useParams();
  const dispatch = useDispatch();
  const integrationList = useSelector(
    (state: RootState) => state.workspaces.buildingIntegration,
  );
  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);

  useEffect(() => {
    if (buildingId !== undefined) {
      dispatch(getBuildingIntegrations(decrypt(buildingId)));
    }
  }, [buildingId, dispatch]);
  const { mutate: connectYardi } = useMutation(
    async (data: IYardiCredentials) => axios({
      url: '/api/integrations/connect_yardi/',
      method: 'post',
      data,
    }),
    {
      onSuccess: (res: AxiosResponse<IConnectYardiResponse>) => {
        setOpen(false);
        setProertyDialog(true);
        setConnnectionTypes(res.data.results.properties);
        enqueueSnackbar('Yard Connected Successfully');
      },
      onError: () => {
        enqueueSnackbar('Connection Failed', { variant: 'error' });
      },
    },
  );
  const { mutate: saveYardiBuilding } = useMutation(async (data: ISaveYardiPayload) => axios({
    url: '/api/integrations/save_yardi_building/',
    method: 'post',
    data,
  }), {
    onSuccess: (): void => {
      setProertyDialog(false);
      dispatch(getBuildingIntegrations(decrypt(buildingId)));
      setConnnectionTypes([]);
      enqueueSnackbar('Connection type saved successfully');
    },
    onError: () => {
      enqueueSnackbar('Connection type saving failed', { variant: 'error' });
    },
  });

  const { mutate: disconnectYardi } = useMutation(async () => axios({
    url: '/api/integrations/disconnect_yardi/',
    method: 'post',
    data: {
      property_id: currentBuilding.id,
    },
  }), {
    onSuccess: (): void => {
      dispatch(getBuildingIntegrations(decrypt(buildingId)));
      enqueueSnackbar('Yardi disconnected successfully');
      setConnnectionTypes([]);
    },
    onError: (): void => {
      enqueueSnackbar('Diconnect action failed');
    },
  });
  return (
    <Grid container justifyContent='center' style={{ marginTop: '92px' }}>
      <YardiDialog
        open={open}
        handleClose={(): void => {
          setOpen(false);
        }}
        connectYardi={connectYardi}
      />
      <YardiPropertyDialog open={propertyDialog} handleClose={(): void => { setProertyDialog(false); }} connectionTypes={connectionTypes} saveYardiBuilding={saveYardiBuilding} />
      <Grid item md={7}>
        <div className='integration-wrapper'>
          {/* Yardi Integration */}
          <div className='integration-bar'>
            <div className='left-side'>
              <div className='icon-wrapper'>
                <img src={yardiSvg} alt='yardi-logo' />
              </div>
              <div className='text-area'>
                <h4> Yardi </h4>
                <p>Yardi System Inc.</p>
              </div>
            </div>
            <div className='right-side'>
              {integrationList.status === 'connected' ? (
                <div className='status-box'>
                  <div className='status'>
                    Property:
                    {' '}
                    {integrationList.yardi_code}
                  </div>
                  <div className='status'>
                    Version:
                    {' '}
                    {integrationList.yardi_database}
                  </div>
                </div>
              ) : ''}

              <div className='button-wapper'>
                {integrationList.status === 'connected' ? (
                  <StandardButton
                    onClick={(): void => { disconnectYardi(); }}
                    startIcon={<SwitchIcon />}
                  >
                    Disconnect
                  </StandardButton>
                ) : (
                  <PrimayButton onClick={(): void => { setOpen(true); }}> Connect </PrimayButton>
                )}
              </div>
            </div>
          </div>
          {/* MRI Integration */}
          <div className='integration-bar'>
            <div className='left-side'>
              <div className='icon-wrapper'>
                <img src={MRISvg} alt='yardi-logo' />
              </div>
              <div className='text-area'>
                <h4> MRI </h4>
                <p>Real Estate Software</p>
              </div>
            </div>
            <div className='right-side'>
              <div className='button-wapper'>
                <PrimayButton> Connect </PrimayButton>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
