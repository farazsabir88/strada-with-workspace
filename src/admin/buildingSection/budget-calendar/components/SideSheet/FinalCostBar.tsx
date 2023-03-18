/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

export default function FinalCostBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isFocused, setIsFocused] = useState(false);
  const [amount, setAmount] = useState(NaN);
  // const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    if (singleSideSheetData !== null) {
      if (singleSideSheetData.final_cost !== null) {
        setAmount(singleSideSheetData.final_cost);
      } else {
        setAmount(NaN);
      }
    } else {
      setAmount(NaN);
    }
  }, [singleSideSheetData]);

  const { mutate: updateFinalCost, isLoading } = useMutation(async () => axios({
    url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      // eslint-disable-next-line use-isnan
      final_cost: Number(amount) === NaN ? 0 : amount,
    },
  }), {
    onSuccess: async (res): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res.data.cost_final !== null && enqueueSnackbar('Final cost updated successfully');
    },
  });

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (singleSideSheetData !== null && singleSideSheetData.final_cost !== amount) {
        if (!(singleSideSheetData.final_cost === null && Number.isNaN(amount))) {
          updateFinalCost();
        }
      }
    }
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (singleSideSheetData !== null && singleSideSheetData.final_cost !== amount) {
      if (!(singleSideSheetData.final_cost === null && Number.isNaN(amount))) {
        updateFinalCost();
      }
    }
  };

  const handleConditionalText = (): JSX.Element => {
    if (isFocused || !Number.isNaN(amount)) {
      return <>$</>;
    }
    return <HorizontalRuleIcon />;
  };

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Final Cost </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          { isLoading && !Number.isNaN(amount) ? <StradaSpinner open={isLoading} message='Updating' /> : (
            <div className='input-bar'>
              {handleConditionalText()}
              <input
                value={amount}
                onChange={(e): void => { setAmount(e.target.valueAsNumber); handleConditionalText(); }}
                onFocus={(): void => { setIsFocused(true); }}
                onBlur={(): void => { handleBlur(); }}
                onKeyPress={handleEnterPress}
                type='number'
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
