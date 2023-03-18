/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Autocomplete,
  Avatar,
  Chip,
  ClickAwayListener,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { SuggestionDataItem } from 'react-mentions';
import { MentionsInput, Mention } from 'react-mentions';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import AttachmentIcon from 'assests/images/comment-attachment.svg';
import AlternateEmailIcon from 'assests/images/comment-mention.svg';
import type { RootState } from 'mainStore';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type { ISSComment } from 'admin/buildingSection/budget-calendar/types';
import StradaLoader from 'shared-components/components/StradaLoader';

interface IManagers {
  id: number;
  avatar: string | null;
  display: string;
  email: string;
}

export default function CommentSection({ commentForEdit, setCommentForEdit }: { setCommentForEdit: (val: ISSComment | null) => void; commentForEdit: ISSComment | null }): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [currentElement, setCurrentElement] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [label, setLabel] = useState(false);
  const [openCol, setOpenCol] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IManagers[]>([]);
  const [focus, setFocus] = useState(false);

  const handleCommentChange = (e: { target: { value: string } }): void => {
    if (e.target.value !== '\n') {
      setComment(e.target.value);
    }
  };

  const inputFocus = (): void => {
    if (!label) {
      setLabel(true);
    }
  };

  const showLabel = (
    event:
    | React.FocusEvent<HTMLInputElement>
    | React.FocusEvent<HTMLTextAreaElement>,
  ): void => {
    if (comment === '') {
      setLabel(false);
    }
    setCurrentElement(event.target);
  };

  const showSuggestion = (): void => {
    if (comment === '@') {
      setComment('');
    }
    setComment(`${comment}@`);
    if (currentElement !== null) {
      currentElement.focus();
    }
  };

  const commentMentionItem = (id: string, display: string): string => `@ ${display}`;

  const { data: managers = [], refetch: refetchManagers } = useQuery(
    ['sidesheet-get-managers', singleSideSheetData?.workspace],
    async () => axios({
      url: '/api/filter/assignee/',
      method: 'GET',
      params: {
        workspace: singleSideSheetData?.workspace,
      },
    }),
    {
      enabled: singleSideSheetData?.workspace !== null,
      select: (res: AxiosResponse<IPeopleResponse>) => res.data.detail.map((manager) => ({
        display: manager.name,
        avatar: manager.avatar,
        id: manager.id,
        email: manager.email,
      })),
    },
  );

  const renderSuggestion = (sug: SuggestionDataItem): JSX.Element => {
    const entry = managers.filter((manager) => manager.id === Number(sug.id))[0];

    return (
      <div className='mention-suggestions'>
        <div className='comment-avatar'>
          <Avatar
            src={
              entry?.avatar !== undefined && entry.avatar !== ''
                ? `${entry.avatar}`
                : 'avatar/defaultAvatar.png'
            }
            style={{ width: '24px', height: '24px' }}
            className='avatar'
            alt={entry.display}
          />
        </div>
        <div className='comment-display'>{entry.display}</div>
        <div className='comment-email'>{entry.email}</div>
      </div>
    );
  };

  useEffect(() => {
    if (sideSheetData !== null) {
      refetchManagers().catch((e) => { throw e; });
    }
  }, [sideSheetData]);

  const { mutate: updateCollaborators } = useMutation(
    async (params: { userId: number; isDelete: boolean }) => axios({
      url: params.isDelete ? '/api/budget-calendar/collaborator-delete/' : '/api/budget-calendar/collaborator/',
      method: 'POST',
      data: {
        event: sideSheetData?.id,
        user: params.userId,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        await queryClient.invalidateQueries('others-events').then();
      },
    },
  );

  const { mutate: createComment, isLoading: loadingOnCreateComment } = useMutation(
    async () => axios({
      url: '/api/budget-calendar/event-comment/',
      method: 'POST',
      data: {
        comment,
        event: sideSheetData?.id,
        type: 'event',
        user: user.id,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        await queryClient.invalidateQueries('others-events').then();
        setFocus(false);
        setComment('');
        enqueueSnackbar('Comment added successfully');
        setLabel(false);
        setCommentForEdit(null);
        setFiles([]);
      },
      onError: (): void => {
        enqueueSnackbar('Comment sending failed ', { variant: 'error' });
      },
    },
  );
  const { mutate: updateComment, isLoading: loadingOnUpdateComment } = useMutation(
    async () => axios({
      url: `/api/budget-calendar/event-comment/${commentForEdit?.id}/`,
      method: 'PATCH',
      data: {
        comment,
        id: commentForEdit?.id,
        event: sideSheetData?.id,
        type: 'event',
        updated_at: new Date().toISOString(),
        user: user.id,
        user_info: commentForEdit?.user_info,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('others-events').then();

        await queryClient.invalidateQueries('user-created-events').then();
        setComment('');
        enqueueSnackbar('Comment is updated successfully');
        setLabel(false);
        setCommentForEdit(null);
        setFiles([]);
        setComment('');
        setFocus(false);
      },
      onError: (): void => {
        enqueueSnackbar('Comment sending failed ', { variant: 'error' });
      },
    },
  );

  useEffect(() => {
    if (singleSideSheetData !== null) {
      let newManagers: IManagers[] = [];
      singleSideSheetData.collaborators.map((collab) => {
        const filteredManagers = managers.filter((manager) => manager.id === collab.id);
        newManagers = [...newManagers, ...filteredManagers];
        return collab;
      });
      setSelectedItem(newManagers);
    }
  }, [singleSideSheetData, managers]);

  useEffect(() => {
    setLabel(false);
    setCommentForEdit(null);
    setFiles([]);
    setComment('');
    setFocus(false);
  }, [sideSheetData?.id]);
  useEffect(() => {
    if (commentForEdit !== null && typeof commentForEdit.commentString === 'string') {
      setComment(commentForEdit.commentString);
    }
  }, [commentForEdit]);

  const handleDeleteCollaborators = (id: number): void => {
    updateCollaborators({ userId: id, isDelete: true });
    const newItems = selectedItem.filter((item) => item.id !== id);
    setSelectedItem(newItems);
  };

  const { mutate: leaveEvent, isLoading: leaving } = useMutation(async () => axios({
    url: '/api/budget-calendar/collaborator-delete/',
    method: 'post',
    data: {
      event: sideSheetData?.id,
      user: user.id,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('You have left the event successfully');
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('sidesheet-get-selected-collabs').then();
    },
    onError: (): void => {
      enqueueSnackbar('You already left this event', { variant: 'error' });
    },
  });

  const { mutate: joinEvent, isLoading: joining } = useMutation(async () => axios({
    url: '/api/budget-calendar/collaborator/',
    method: 'post',
    data: {
      event: sideSheetData?.id,
      user: user.id,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('you have joined the event successfully');
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('sidesheet-get-selected-collabs').then();
    },
    onError: (): void => {
      enqueueSnackbar('Request failed', { variant: 'error' });
    },
  });

  const handleLeaveEvent = (): void => {
    leaveEvent();
  };

  const handleJoinEvent = (): void => {
    joinEvent();
  };

  const { mutate: uploadFile } = useMutation(
    async (file: File) => {
      const formData = new FormData();
      if (sideSheetData !== null) {
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('event', String(sideSheetData.id));
        // formData.append('type', 'event');
        formData.append('group', 'attachment');
      }

      return axios({
        url: '/api/budget-calendar/event-attachment/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        // enqueueSnackbar('File uploaded successfully');
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      setFiles([...files, e.target.files[0]]);
      enqueueSnackbar('Attachment added successfully ');
    }
  };

  const handleFileClick = (fileId: string): void => {
    document.getElementById(fileId)?.click();
  };

  const handleCreateComment = (): void => {
    if (comment.trim() !== '') {
      if (commentForEdit !== null) {
        updateComment();
      } else {
        createComment();
      }
    } else {
      setComment('');
      setLabel(false);
      setCommentForEdit(null);
      setFiles([]);
    }

    if (files.length > 0) {
      files.map((file) => { uploadFile(file); return file; });
    }
  };

  const enterKeyEvent = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleCreateComment();
    }
    if (e.key === 'Enter' && e.shiftKey) {
      setComment(`${comment}\r\n`);
    }
  };

  const handleDelete = (index: number): void => {
    const fileterFiles = files.filter((file, i) => index !== i);
    setFiles(fileterFiles);
  };
  return (
    <div className='sidesheet-comment-section'>
      <StradaLoader open={leaving || joining} message='Action in progress' />
      <div className='inner-wrapper'>
        <div className='first-bar'>
          <Avatar className='main-avatar' src={`${process.env.REACT_APP_IMAGE_URL}/${user.avatar}`} />
          <div className='comment-input'>
            <form className='form form-anim' onClick={(): void => { setFocus(true); }}>
              {loadingOnCreateComment || loadingOnUpdateComment
                ? (
                  <div style={{ marginLeft: '30px' }}>
                    {' '}
                    <StradaSpinner open={loadingOnCreateComment || loadingOnUpdateComment} size={40} message='Action in progress' />
                    {' '}
                  </div>
                ) : (
                  <ClickAwayListener onClickAway={(): void => { setFocus(false); }}>
                    <fieldset id='comment_box_wrapper fieldset-1' style={{ borderColor: focus ? '1px solid rgba(33, 33, 33, 0.38)' : '1px solid #00CFA1' }}>
                      <p className={label ? 'label label-on-focus' : 'label'}>Add comment </p>
                      <MentionsInput
                        className='mentions'
                        value={comment}
                        // markup='@[__names__](__id__)'
                        onChange={handleCommentChange}
                        onBlur={showLabel}
                        onFocus={inputFocus}
                        allowSuggestionsAboveCursor
                        a11ySuggestionsListLabel='this comment'
                        onKeyDown={enterKeyEvent}
                        forceSuggestionsAboveCursor

                      >
                        <Mention
                          trigger='@'
                          style={{ background: 'rgba(0, 207, 161, 0.12)' }}
                          data={managers}
                          displayTransform={commentMentionItem}
                          renderSuggestion={renderSuggestion}
                        />
                      </MentionsInput>

                      <div className='comment-attachment-wrap'>
                        {files.map((file, i) => (
                          <div className='single-attach'>
                            <div className='icon-wrapper'>
                              <DescriptionIcon htmlColor='rgba(33, 33, 33, 0.6)' />
                            </div>
                            <div className='name-wrapper'>
                              {file.name.substring(0, 35)}
                            </div>
                            <div className='close-icon-wrapper' onClick={(): void => { handleDelete(i); }} aria-hidden='true'>
                              <CloseIcon fontSize='small' htmlColor='rgba(33, 33, 33, 0.6)' />
                            </div>
                          </div>
                        ))}

                      </div>

                      <div className='comment-functions' style={{ display: focus ? 'flex' : 'none' }}>
                        <div className='comment-links'>
                          <button
                            className='comment-suggester'
                            type='button'
                            onClick={showSuggestion}
                          >
                            <img
                              src={AlternateEmailIcon}
                              width={24}
                              height={24}
                              alt='Attachment-Icon'
                            />
                          </button>

                          <button style={{ background: 'none', border: 'none', padding: 'none' }} onClick={(): void => { handleFileClick('comment-attachment'); }} type='button'>
                            <label htmlFor='ss-comment-attachment'>
                              <img
                                src={AttachmentIcon}
                                className='cursor-pointer'
                                width={24}
                                height={24}
                                alt='Attachment-Icon'
                              />
                            </label>
                          </button>

                        </div>
                        <div onClick={handleCreateComment} aria-hidden='true'>
                          <input
                            type='button'
                            className='comment-button'
                            value='Comment'
                          />
                        </div>

                      </div>
                    </fieldset>
                  </ClickAwayListener>

                )}
              <input
                type='file'
                multiple={false}
                className='cursor-pointer'
                id='comment-attachment'
                style={{ display: 'none' }}
                onChange={handleChange}
              />
              {/* </form> */}
            </form>
          </div>
        </div>
        <div className='second-row'>
          <div className='left-side'>
            <h6>Collaborators</h6>
          </div>
          {openCol ? (
            <ClickAwayListener onClickAway={(): void => { setOpenCol(false); }}>
              <div className='right-side'>
                <Autocomplete
                  multiple
                  fullWidth
                  id='tags-outlined'
                  // className='collab-autocomplete-main'
                  classes={{
                    root: 'collab-autocomplete-main',
                  }}
                  options={managers}
                  value={selectedItem}
                  getOptionLabel={(option: IManagers): string => option.display}
                  filterSelectedOptions
                  renderInput={(params): JSX.Element => (
                    <TextField
                      {...params}
                      placeholder=''
                      className='collab-autocomplete'
                      size='small'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                  renderOption={(
                    manager,
                    currentOption: IManagers,
                  ): JSX.Element => (
                    <div
                      className='collaborator-suggestions'
                      onClick={(): void => {
                        setSelectedItem([...selectedItem, currentOption]);
                        updateCollaborators({ userId: currentOption.id, isDelete: false });
                      }}
                      aria-hidden='true'
                    >
                      <div className='comment-avatar'>
                        <Avatar
                          src={`${process.env.REACT_APP_IMAGE_URL}${currentOption.avatar}`}
                          style={{ width: '24px', height: '24px' }}
                          className='avatar'
                          alt={currentOption.display}
                        />
                      </div>
                      <div className='comment-display'>
                        {currentOption.display}
                      </div>
                    </div>
                  )}
                  renderTags={(): JSX.Element[] => selectedItem.map(
                    (currentOption): JSX.Element => (
                      <Chip
                        size='small'
                        avatar={(
                          <Avatar
                            src={`${process.env.REACT_APP_IMAGE_URL}${currentOption.avatar}`}
                            style={{ width: '24px', height: '24px' }}
                            className='avatar'
                            alt={currentOption.display}
                          />
                        )}
                        key={currentOption.id}
                        tabIndex={-1}
                        label={currentOption.display}
                        className='colleborator-chip-class'
                        onDelete={(): void => {
                          handleDeleteCollaborators(currentOption.id);
                        }}
                      />
                    ),
                  )}
                />
              </div>
            </ClickAwayListener>
          ) : (
            <div className='right-side'>
              <div className='avatar-list'>
                {selectedItem.map((item) => <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${item.avatar}`} style={{ width: '24px', height: '24px', marginRight: '2px' }} />)}
                {selectedItem.length === 0
                  && (
                    <>
                      <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />
                      <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />
                      <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />
                    </>
                  )}
                {selectedItem.length === 1
                    && (
                      <>
                        <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />
                        <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />
                      </>
                    )}
                {selectedItem.length === 2
                      && <Avatar className='assignee-avatar' style={{ width: '24px', height: '24px', marginRight: '2px' }} />}
                <IconButton
                  onClick={(): void => {
                    setOpenCol(!openCol);
                  }}
                >
                  {' '}
                  <AddIcon fontSize='small' />
                  {' '}
                </IconButton>
              </div>
              {selectedItem.filter((coll) => coll.id === user.id).length > 0 ? (
                <div className='leave-event-btn' onClick={handleLeaveEvent} aria-hidden='true'>
                  <NotificationsNoneIcon htmlColor='rgba(33,33,33,.6)' fontSize='small' />
                  <h6>Leave Event</h6>
                </div>
              ) : (
                <div className='leave-event-btn' onClick={(): void => { handleJoinEvent(); }} aria-hidden='true'>
                  <NotificationsNoneIcon htmlColor='rgba(33,33,33,.6)' fontSize='small' />
                  <h6>Join Event</h6>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
