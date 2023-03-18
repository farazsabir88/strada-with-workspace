/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import type { OptionProps, StylesConfig } from 'react-select';
import Select from 'react-select';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
// import type { IGLResponse as IGLResponseYardi } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import type { IGLData, IGLResponse } from 'admin/purchaseOrder/types';// IStatus,

interface IGLProps {
  name: string;
  value: number;
}

const selectStyles: StylesConfig<IGLProps> = {
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
  // input: () => ({
  //   width: '100%',
  // }),
};

export default function GLCodeBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCode, setSelectedCode] = React.useState<IGLProps | null>(null);
  const [finalGLList, setFinalGLList] = React.useState<IGLProps[]>([]);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  // const { data: glCodesYardi = [] } = useQuery(
  //   ['sidesheet/get-gl-code'],
  //   async () => axios({
  //     url: '/api/yardi/export_chart_of_accounts/',
  //     method: 'post',
  //     data: {
  //       id: Number(currentBuilding.id),
  //     },
  //   }),
  //   {
  //     enabled: currentBuilding.yardi_connected,
  //     select: (res: AxiosResponse<IGLResponseYardi>) => res.data.result.map((gl) => ({ name: gl.gl_account, value: gl.gl_code })),
  //   },
  // );
  let newURl = `api/filter/gl-code/?workspace=${singleSideSheetData?.workspace}`;
  if (singleSideSheetData?.property !== null) {
    newURl = `api/filter/gl-code/?workspace=${singleSideSheetData?.workspace}&property=${singleSideSheetData?.property}`;
  }

  const { data: glCodesBackend = [] } = useQuery(
    ['get-gl-accounts', singleSideSheetData?.workspace, singleSideSheetData?.id, singleSideSheetData?.building?.id],
    async () => axios({
      url: newURl,
      method: 'get',
    }),
    {
      enabled: singleSideSheetData?.workspace !== null,
      // enabled: !currentBuilding.yardi_connected,
      select: (res: AxiosResponse<IGLResponse>) => res.data.detail.map((gl: IGLData) => ({ name: gl.label, value: gl.id })),
    },
  );

  useEffect(() => {
    if (glCodesBackend.length > 0) {
      setFinalGLList(glCodesBackend);
    }
  }, [glCodesBackend]);

  // useEffect(() => {
  //   if (glCodesYardi.length > 0) {
  //     setFinalGLList(glCodesYardi);
  //   }
  // }, [glCodesYardi]);

  useEffect(() => {
    if (singleSideSheetData?.gl !== null) {
      const currentGlCode = finalGLList.filter((glCode) => singleSideSheetData?.gl === Number(glCode.value));
      setSelectedCode(currentGlCode[0]);
    } else {
      setSelectedCode(null);
    }
  }, [singleSideSheetData, finalGLList]);

  const { mutate: updateGlCode, isLoading: updatingGLCode } = useMutation(async (id: number | null) => axios({
    url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      gl: id,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      setSelectedCode(null);
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('GL Code updated successfully');
    },
  });

  function SelectCustomOption(option: OptionProps<IGLProps>): JSX.Element {
    const { data } = option;
    return (
      <div className='select-custom-option' onClick={(): void => { updateGlCode(data.value); }} aria-hidden='true'>
        {data.name}
      </div>
    );
  }

  function ClearIndicator(): JSX.Element {
    return (
      <IconButton onClick={(): void => { updateGlCode(null); }}>
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
      <h6 className='side-sheet-side-label'> G/L Code </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          {updatingGLCode ? <StradaSpinner open={updatingGLCode} message='Updating' /> : (
            <Select
              className='single-select'
              options={singleSideSheetData?.workspace !== null ? [...finalGLList] : []}
              value={selectedCode}
              placeholder={<HorizontalRuleIcon />}
              isClearable
              closeMenuOnSelect
              styles={selectStyles}
              getOptionLabel={(val): string => (val.name.length > 35 ? `${val.name.slice(0, 35)}...` : val.name)}
              components={{
                Option: SelectCustomOption,
                ClearIndicator,
                DropdownIndicator: selectedCode === null || selectedCode === undefined ? DownChevron : null,
                IndicatorSeparator: null,
              }}
            />
          )}

        </div>

      </div>
    </div>
  );
}
