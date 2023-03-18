import React, { useState } from 'react';
import {
  Grid, Divider, Typography, Stack, Box,
} from '@mui/material';
import './_invoice.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import NumberTextfield from 'shared-components/inputs/NumberTextfield';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';
import AddNewThreshold from './AddNewThreshold';
import AddApprover from './AddApprover';
import type { Imanagers } from './type';
import EditAddApprover from './EditAddApprover';
import AddThresholdApprover from './AddThresholdApprover';
import EditThresholdApprover from './EditThresholdApprover';

interface Ipayload { no_invoice_approval: number}
interface IupdateThreshold {threshold: number; id: number}

interface IthresholdMap {
  id: number;
  creted_at: string;
  updated_at: string;
  threshold: number;
  managers: [ {
    email: string;
    firstName: string;
    lastName: string;
    token: string;
  }];
  is_default: boolean;
}

const defaultManagers = {
  email: '',
  firstName: '',
  lastName: '',
  token: '',

};
interface IpayloadDelete {

  firstName: string;
  lastName: string;
  email: string;
  token: string | null;

}
interface IDataToDelete {
  listId: number;
  filtredManagers: IpayloadDelete[];
}
interface IThresholdApproverProps {
  threshold: number;
  id: number;
}
const defaultIThresholdApproverProps = {
  threshold: 0,
  id: 0,
};
interface IEditThresholdApproverProps {
  threshold: number;
  id: number;
  is_default: boolean;
}
const defaultIEditThresholdApproverProps = {
  threshold: 0,
  id: 0,
  is_default: false,
};
interface IDeleteThresholdApprover {
  id: number;
  managers: IpayloadDelete[];
}

interface IDetail {
  default_approvals: IthresholdMap[];
  thresholds: IthresholdMap[];
  no_invoice_approval: number;
  have_default_approval: boolean;
}
interface IInvoiceApprovalResponse {
  detail: IDetail;
}

function InvoiceContent(): JSX.Element {
  // const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);
  // const user = useSelector((state: RootState) => state.auth.user);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  /// // Add Approver //////
  const [addApprover, setAddApprover] = useState<boolean>(false);
  const [addNewThreshold, setAddNewThreshold] = useState<boolean>(false);
  const [noApproval, setNoApproval] = useState<number>(0); // currentBuilding.no_approval
  const [InvoiceContentData, setInvoiceContentData] = useState<IDetail>();

  /// // Edit Approver //////
  const [editApprover, setEditApprover] = useState<boolean>(false);
  const [isLessThen, setIsLessThen] = useState(true);
  const [managersList, setManagersList] = useState<Imanagers[]>([]);
  const [managersListId, setManagersListId] = useState<number>(0);
  const [editManager, setEditManager] = useState<Imanagers>(defaultManagers);

  /// // Add Threshold Approver /////
  const [addThresholdApprover, setAddThresholdApprover] = useState<boolean>(false);
  const [thresholdApproverPropsData, setThresholdApproverPropsData] = useState<IThresholdApproverProps>(defaultIThresholdApproverProps);

  /// // Edit Threshold Approver /////
  const [editThresholdApprover, setEditThresholdApprover] = useState<boolean>(false);
  const [editThresholdApproverPropsData, setEditThresholdApproverPropsData] = useState<IEditThresholdApproverProps>(defaultIEditThresholdApproverProps);
  /// const [threshold, setThreshold] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  /// //// Listing //////
  useQuery(
    'workspace-invoice-approval',
    async () => axios({
      url: `api/workspace-invoice-approval/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      select: (res: AxiosResponse<IInvoiceApprovalResponse>) => res.data.detail,
      onSuccess: (approvalData: IDetail) => {
        setInvoiceContentData(approvalData);
        setNoApproval(approvalData.no_invoice_approval);
      },
    },
  );

  /// ///No Approver //////

  const { mutate, isLoading: noApproverLoader } = useMutation(async (payload: Ipayload) => axios({
    url: `api/workspace-approval/${currentWorkspace.id}/`,
    method: 'patch',
    data: payload,
  }), {
    onSuccess: () => {
      // enqueueSnackbar('Invoice Updated Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const onNoApproverChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    const val = Math.abs(Number(e.target.value));
    setNoApproval(val);
  };

  const onNoApproverBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const payload = { no_invoice_approval: Number(e.target.value) };
    mutate(payload);
  };

  /// /// Delete Approver ////
  const { mutate: deleteApprover, isLoading: deleteApproverLoader } = useMutation(async (payload: IDataToDelete) => axios({
    url: `api/workspace-invoice-approval/${payload.listId}/`,
    method: 'patch',
    data: { managers: [...payload.filtredManagers] },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      enqueueSnackbar('Approver Deleted Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });
    /// /// Delete Threshold  ////
  const { mutate: deleteThreshold, isLoading: deleteThresholdLoader } = useMutation(async (payload: number) => axios({
    url: `api/workspace-invoice-approval/${payload}/`,
    method: 'delete',

  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      enqueueSnackbar('Threshold Deleted Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });
  /// /// Delete Threshold Approver  ////
  const { mutate: deleteThresholdApprover, isLoading: deleteThresholdApproverLoader } = useMutation(async (payload: IDeleteThresholdApprover) => axios({
    url: `api/workspace-invoice-approval/${payload.id}/`,
    method: 'patch',
    data: { managers: payload.managers },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      enqueueSnackbar('Threshold Deleted Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });
  /// /// Update Threshold   ////
  const { mutate: updateThreshold } = useMutation(async (payload: IupdateThreshold) => axios({
    url: `api/workspace-invoice-approval/${payload.id}/`,
    method: 'patch',
    data: { threshold: payload.threshold },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      // enqueueSnackbar('Threshold Updated Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });
  const handleApproverDelete: (email: string) => void = (email) => {
    if (InvoiceContentData !== undefined) {
      const indexOfManagers = InvoiceContentData.default_approvals.length - 1;
      const listId: number = InvoiceContentData.default_approvals[indexOfManagers].id;
      setManagersListId(listId);
      const managerList: Imanagers[] = InvoiceContentData.default_approvals[indexOfManagers].managers;
      const filtredManagers: IpayloadDelete[] = managerList.filter((item: Imanagers) => item.email !== email);
      const dataToSend = {
        listId,
        filtredManagers,
      };
      deleteApprover(dataToSend);
    }
  };
  const handleThresholdChange = (index: number, value: string): void => {
    if (InvoiceContentData !== undefined) {
      const newContent = InvoiceContentData.thresholds.map((item, indx) => {
        if (index === indx) {
          // eslint-disable-next-line no-param-reassign
          item.threshold = Number(value);
        }
        return item;
      });
      setInvoiceContentData({ ...InvoiceContentData, thresholds: newContent });
    }
  };
  const thresholdChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void = (e, id) => {
    const payload: IupdateThreshold = { threshold: Number(e.target.value), id };
    updateThreshold(payload);
  };

  const editApproverHandler: (e: Imanagers) => void = (e) => {
    if (InvoiceContentData !== undefined) {
      const indexOfManagers = InvoiceContentData.default_approvals.length - 1;
      const listId: number = InvoiceContentData.default_approvals[indexOfManagers].id;
      setManagersListId(listId);
      const managerList: Imanagers[] = InvoiceContentData.default_approvals[indexOfManagers].managers;
      setEditApprover(true);
      setManagersList(managerList);
      const manager: Imanagers = e;
      setEditManager(manager);
    }
  };

  const addThresholdApproverHandler: (e: IthresholdMap) => void = (e) => {
    const propsData: IThresholdApproverProps = {

      threshold: e.threshold,
      id: e.id,
    };
    setThresholdApproverPropsData(propsData);
    setAddThresholdApprover(true);
  };

  const editThresholdApproverHandler: (e: IthresholdMap, payload: Imanagers) => void = (e, payload) => {
    if (InvoiceContentData !== undefined) {
      const propsData: IEditThresholdApproverProps = {
        id: e.id,
        threshold: e.threshold,
        is_default: e.is_default,
      };
      setEditThresholdApproverPropsData(propsData);
      setEditThresholdApprover(true);
      setEditManager(payload);
      const previousData = InvoiceContentData.thresholds.filter((item: IthresholdMap) => item.id === e.id);
      setManagersList(previousData[0].managers);
    }
  };

  const deleteThresholdHandler: (e: number) => void = (e) => {
    deleteThreshold(e);
  };
  const deleteThresholdManagersHandler: (e: number, manager: Imanagers) => void = (e, manager) => {
    if (InvoiceContentData !== undefined) {
      const managersListData: IthresholdMap[] = InvoiceContentData.thresholds;
      const filteredManagersList: IthresholdMap[] = managersListData.filter((item: IthresholdMap) => item.id === e);
      const previousMangersList: IpayloadDelete[] = filteredManagersList[0].managers;
      const updatedManagers: IpayloadDelete[] = previousMangersList.filter((item: IpayloadDelete) => item.email !== manager.email);
      const paylaod: IDeleteThresholdApprover = {
        id: e,
        managers: updatedManagers,
      };
      deleteThresholdApprover(paylaod);
    }
  };
  return (

    <div style={{ margin: '1.4rem 1rem 2rem', marginTop: '92px' }}>
      <StradaLoader open={deleteApproverLoader} />
      <StradaLoader open={deleteThresholdLoader} />
      <StradaLoader open={noApproverLoader} />
      <StradaLoader open={deleteThresholdApproverLoader} />
      <Grid container className='Invoice-container'>
        <Grid item sx={{ width: '33.3rem' }}>
          <Typography className='header'>Invoice Approval</Typography>
          <Typography className='desc'>This is your approval workflow for invoices. For changes of this Approval workflow based on the total dollar amount of an invoice, setup as many additional workflows you would like.</Typography>
          <Grid container mt={2}>

            <Grid item sm={8}><Typography className='header'> Default Invoice Approval Workflow</Typography></Grid>
            <Grid item sm={4}>
              <div className='d-flex justify-content-end'>
                <i className='fa-solid fa-plus plus-icon fa-2xs' />
                <Typography className='add-approver' onClick={(): void => { setAddApprover(true); }}>Add Approver</Typography>
              </div>
            </Grid>

          </Grid>
          <Divider sx={{ marginTop: '.8rem' }} />
          <Typography className='desc-2'>This is your approval workflow for invoices.</Typography>
          {InvoiceContentData !== undefined ? InvoiceContentData.default_approvals.map((item) => (
            <div key={item.id}>
              {item.managers.map((manager: Imanagers) => (

                <div key={manager.email}>
                  <Divider sx={{ margin: '4px' }} />
                  <Grid container mt={1}>
                    <Grid item sm={1}><i className='fa-solid fa-bars menu-icon' /></Grid>
                    <Grid item sm={8} pl={2}>
                      <Typography className='sub-heading'>
                        {' '}
                        {`${manager.firstName} ${manager.lastName}`}
                      </Typography>
                      <Typography className='desc-3'>
                        {' '}
                        {manager.email}
                      </Typography>
                    </Grid>
                    <Grid item sm={3} className='d-flex justify-content-end'>
                      <Stack direction='row'>
                        <Typography onClick={(): void => { editApproverHandler(manager); }}><i className='fas fa-pen edit-icon fa-lg' /></Typography>
                        <DeleteIcon className='delete-icon' onClick={(): void => { handleApproverDelete(manager.email); }} />
                      </Stack>
                    </Grid>
                  </Grid>
                </div>
              ))}
            </div>
          )) : null}
          <Grid container mt={7}>
            <Grid item sm={8}><Typography className='header'> Thresholds</Typography></Grid>
            <Grid item sm={4}>
              <div className='d-flex justify-content-end'>
                <i className='fa-solid fa-plus plus-icon fa-2xs' />
                <Typography className='add-approver' onClick={(): void => { setAddNewThreshold(true); }}>Add Threshold</Typography>
              </div>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: '.8rem' }} />
          <Typography className='desc-2' mt={2.2} mb={3.5}>For changes to default approval workflow based on the dollar amount of an invoice, setup as many additional wokflows you would like.</Typography>
          {InvoiceContentData !== undefined ? InvoiceContentData.thresholds.map((item: IthresholdMap, index) => (
            <div key={item.id}>
              <Grid container mt={2} key={item.id}>
                <Grid item sm={4}>
                  <Typography mt={2} className='sub-heading'>
                    When invoice total  &gt;
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <NumberTextfield
                    type='number'
                    value={item.threshold}
                    name='threshold'
                    label='threshold'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleThresholdChange(index, e.target.value); }}
                    onBlur={(e): void => { thresholdChange(e, item.id); }}
                  />
                </Grid>
                <Grid item sm={2} className='d-flex justify-content-end'>
                  <Typography onClick={(): void => { deleteThresholdHandler(item.id); }}><i className='fa-solid fa-xmark clear-icon  fa-lg fa-4x' /></Typography>
                </Grid>
              </Grid>

              {item.managers.map((manager: Imanagers) => (
                <div key={manager.email}>
                  {' '}
                  <Divider sx={{ marginTop: '.5rem' }} />

                  <Grid container mt={1}>
                    <Grid item sm={1}><i className='fa-solid fa-bars menu-icon' /></Grid>
                    <Grid item sm={8} pl={2}>
                      <Typography className='sub-heading'>
                        {`${manager.firstName} ${manager.lastName}`}
                      </Typography>
                      <Typography className='desc-3'>{manager.email}</Typography>
                    </Grid>
                    <Grid item sm={3} className='d-flex justify-content-end'>
                      <Stack direction='row'>
                        <Typography onClick={(): void => { editThresholdApproverHandler(item, manager); }}><i className='fas fa-pen edit-icon fa-lg' /></Typography>
                        <DeleteIcon className='delete-icon' onClick={(): void => { deleteThresholdManagersHandler(item.id, manager); }} />

                      </Stack>
                    </Grid>
                  </Grid>

                </div>
              ))}
              <Box mt={2} className='d-flex '>
                <i className='fa-solid fa-plus plus-icon fa-2xs' />
                <Typography className='add-approver' onClick={(): void => { addThresholdApproverHandler(item); }}>Add Approver</Typography>
              </Box>
            </div>
          )) : null}

          {/* <Box mt={2} className='d-flex '>
            <i className='fa-solid fa-plus plus-icon fa-2xs' />
            <Typography className='add-approver' onClick={(): void => { setAddApprover(true); }}>Add Approver</Typography>
          </Box> */}
          <Grid container mt={5}>
            <Grid item sm={2} mt={1}>
              <Switch value={isLessThen} checked={isLessThen} onChange={(e, val): void => { setIsLessThen(val); }} />
            </Grid>
            <Grid item sm={4} mt={1.7} ml={-3}>
              <Typography className='sub-heading'>Invoices less than</Typography>
            </Grid>
            <Grid item sm={4} ml={-3}>
              <NumberTextfield
                type='number'
                name='threshold'
                label='threshold'
                disabled={!isLessThen}
                value={isLessThen ? noApproval : 0}
                onChange={onNoApproverChange}
                onBlur={onNoApproverBlur}
              />
            </Grid>
            <Grid item sm={2} ml={2}>

              <Typography className='sub-heading'> require no approval</Typography>

            </Grid>

          </Grid>
        </Grid>
        <AddApprover handleClose={(): void => { setAddApprover(false); }} open={addApprover} />
        {InvoiceContentData?.thresholds !== undefined
        && <AddNewThreshold managers={InvoiceContentData.thresholds} handleClose={(): void => { setAddNewThreshold(false); }} open={addNewThreshold} />}
        <EditAddApprover managersListId={managersListId} editManager={editManager} managersList={managersList} handleClose={(): void => { setEditApprover(false); }} open={editApprover} />
        {InvoiceContentData?.thresholds !== undefined
        && <AddThresholdApprover managers={InvoiceContentData.thresholds} thresholdApproverPropsData={thresholdApproverPropsData} handleClose={(): void => { setAddThresholdApprover(false); }} open={addThresholdApprover} />}
        <EditThresholdApprover managersList={managersList} editThresholdApproverPropsData={editThresholdApproverPropsData} editManager={editManager} handleClose={(): void => { setEditThresholdApprover(false); }} open={editThresholdApprover} />
      </Grid>

    </div>
  );
}

export default InvoiceContent;
