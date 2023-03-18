import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { WithContext as ReactTags } from 'react-tag-input';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import type { RootState } from 'mainStore';
import type { ITagResponse } from 'admin/buildingSection/budget-calendar/types';

export default function TagsBar(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<{ id: string; text: string }[]>([]);
  const handleClose = (): void => {
    setOpen(false);
  };

  const handleDelete = (i: number): void => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  const handleAddition = (tag: { id: string; text: string }): void => {
    if (tag.text.trim()) {
      setTags([...tags, tag]);
    }
  };

  const { mutate: updateTag, isLoading: loadingOnUpdateTag } = useMutation(
    async () => axios({
      url: '/api/budget-calendar/multiple-tags/',
      method: 'POST',
      params: {
        type: 'event',
      },
      data: {
        event: singleSideSheetData?.id,
        tag: tags.map((singleTag) => singleTag.text),
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('sidesheet/get-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        await queryClient.invalidateQueries('get-all-tags').then();
        enqueueSnackbar('Tags updated successfully');
        handleClose();
      },
      onError: (): void => {
        enqueueSnackbar('Tags updateding failed', { variant: 'error' });
      },
    },
  );

  useEffect(() => {
    if (singleSideSheetData !== null) {
      if (singleSideSheetData.tags !== null) {
        const prevTags = singleSideSheetData.tags.map((tag) => ({
          id: String(tag.id),
          text: tag.name,
        }));
        setTags(prevTags);
      }
    }
  }, [singleSideSheetData]);

  const handleAddTags = (): void => {
    if (tags.length > 0) {
      updateTag();
    }
  };
  const renderTagsData = (): string => {
    let data = '';
    // eslint-disable-next-line array-callback-return
    singleSideSheetData?.tags?.map((tag): void => {
      data += `${tag.name}, `;
    });
    if (data.length > 50) {
      data = `${data.slice(0, 50)}...`;
    }
    return data;
  };

  const { data: allTags = [] } = useQuery(
    ['get-all-tags', singleSideSheetData?.workspace],
    async () => axios({
      url: '/api/filter/tag/',
      method: 'get',
      params: {
        workspace: singleSideSheetData?.workspace,
      },
    }),
    {
      enabled: singleSideSheetData?.workspace !== null,
      select: (res: AxiosResponse<ITagResponse>) => res.data.detail,
    },
  );
  return (
    <>
      <div className='assignee-sheet-bar'>
        <h6 className='side-sheet-side-label'> Project Tag </h6>
        <div className='assignee-sheet-popover' onClick={(): void => { setOpen(true); }} aria-hidden='true'>
          <div className='popover-btn' aria-hidden='true' style={{ color: 'rgba(33, 33, 33, 0.6)' }}>
            { singleSideSheetData?.tags?.length === 0 ? <HorizontalRuleIcon fontSize='small' /> : renderTagsData()}
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'> Add project tag </h3>
        </DialogTitle>
        <DialogContent>
          <div className='tag-main-wrapper'>
            <ReactTags
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              placeholder='Tags'
              autofocus
              handleInputBlur={(tagVal): void => { handleAddition({ id: String(tagVal), text: String(tagVal) }); }}
            />
          </div>
          <div className='all-tags-list'>
            {allTags.map((tag) => (
              <div key={tag.id} className='single-tag' onClick={(): void => { handleAddition({ id: String(tag.id), text: String(tag.name) }); }} aria-hidden='true'>
                {' '}
                {tag.name}
                {' '}
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton
            className='secondary-btn-secondary'
            onClick={handleClose}
          >
            Cancel
          </SecondaryButton>
          <SecondaryButton
            className='secondary-diloag-btn'
            disabled={tags.length === 0 || loadingOnUpdateTag}
            onClick={handleAddTags}
          >
            Add
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
