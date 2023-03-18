/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { useParams } from 'react-router-dom';
import type { OptionProps, StylesConfig } from 'react-select';
import Select from 'react-select';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
// import { decrypt } from 'shared-components/hooks/useEncryption';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type {
  IAction, INonYardiVendorResponse, // IVendorResponse,
} from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface IVendorProps {
  name: string;
  value: number | string;
}

const selectStyles: StylesConfig<IVendorProps> = {
  control: () => ({
    border: 'none',
    width: '100%',
    // background: 'red',
    display: 'flex',
    borderRadius: '4px',
  }),
  valueContainer: () => ({
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  }),
  singleValue: () => ({
    color: 'rgba(33, 33, 33, 0.6)',
    fontSize: '14px',
  }),
};

export default function TaskVendorBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  // const { buildingId } = useParams();
  const [selectedCode, setSelectedCode] = React.useState<IVendorProps | null>(null);
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  // const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);

  // const { data: yardiVendors = [] } = useQuery(
  //   ['sidesheet/get-yardi-vendors'],
  //   async () => axios({
  //     url: '/api/yardi/get_vendors/',
  //     method: 'post',
  //     data: {
  //       id: Number(decrypt(buildingId)),
  //     },
  //   }),
  //   {
  //     enabled: currentBuilding.yardi_connected,
  //     select: (res: AxiosResponse<IVendorResponse>) => res.data.result.map((vendor) => ({ name: `${vendor.VendorLastName} (${vendor.Salutation})`, value: vendor.VendorId })),
  //   },
  // );

  const { data: vendors = [] } = useQuery(
    ['sidesheet/get-vendors'],
    async () => axios({
      url: 'api/filter/vendor/',
      params: {
        workspace: currentWorkspace.id,
      },
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<INonYardiVendorResponse>) => res.data.detail.map((vendor) => ({ name: vendor.label, value: vendor.id })),
    },
  );

  const { mutate: updateVendor, isLoading } = useMutation(async (vendorData: number | string | null) => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      vendor: vendorData,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Vendor updated successfully');
    },
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentTask !== null && currentTask !== undefined) {
      if (currentTask.vendor !== null) {
        const currentVendorCode = [...vendors].filter((vendor) => vendor.value === currentTask.vendor); // ...yardiVendors,
        setSelectedCode(currentVendorCode[0]);
      } else {
        setSelectedCode(null);
      }
    } else {
      setSelectedCode(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTask]);

  function SelectCustomOption(option: OptionProps<IVendorProps>): JSX.Element {
    const { data } = option;
    return (
      <div className='select-custom-option' onClick={(): void => { updateVendor(data.value); }} aria-hidden='true'>
        {data.name}
      </div>
    );
  }

  function ClearIndicator(): JSX.Element {
    return (
      <IconButton onClick={(): void => { updateVendor(null); }}>
        <CloseIcon fontSize='small' />
      </IconButton>
    );
  }
  function DownChevron(): JSX.Element {
    return (
      <div>
        <ArrowDropDownIcon fontSize='small' />
      </div>
    );
  }
  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Vendor </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          {isLoading ? <StradaSpinner open={isLoading} message='Updaing' /> : (
            <Select
              className='single-select'
              options={[...vendors]} // , ...yardiVendors
              value={selectedCode}
              placeholder={<HorizontalRuleIcon />}
              isClearable
              closeMenuOnSelect
              styles={selectStyles}
              getOptionLabel={(val): string => val.name}
              components={{
                Option: SelectCustomOption,
                ClearIndicator,
                DropdownIndicator: selectedCode === null ? DownChevron : null,
                IndicatorSeparator: null,
              }}
            />
          ) }

        </div>

      </div>
    </div>
  );
}
