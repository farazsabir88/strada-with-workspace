/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Avatar,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { SuggestionDataItem } from 'react-mentions';
import { MentionsInput, Mention } from 'react-mentions';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { RootState } from 'mainStore';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type {
  Itasks, Icomments,
} from '../types';
// import StradaLoader from 'shared-components/components/StradaLoader';

interface Iattachment {
  file: string;
  file_name: string;
}
interface ITaskComment {
  focusedTask: Itasks | null;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  commentForEdit: Icomments | null;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  setCommentForEdit: (val: Icomments | null) => void;

}
function CommentIcon(): JSX.Element {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12.5 5.01172V3.5H3.5V5.01172H12.5ZM12.5 7.26172V5.75H3.5V7.26172H12.5ZM12.5 9.51172V8H3.5V9.51172H12.5ZM15.4883 1.98828V15.4883L12.5 12.5H1.98828C1.58984 12.5 1.23828 12.3477 0.933594 12.043C0.652344 11.7383 0.511719 11.3867 0.511719 10.9883V1.98828C0.511719 1.58984 0.652344 1.25 0.933594 0.96875C1.23828 0.664062 1.58984 0.511719 1.98828 0.511719H14.0117C14.4102 0.511719 14.75 0.664062 15.0312 0.96875C15.3359 1.25 15.4883 1.58984 15.4883 1.98828Z' fill='#212121' fillOpacity='0.87' />
    </svg>
  );
}
function AttachFileIcon(): JSX.Element {
  return (
    <svg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.98828 6.48828V10.25C9.98828 11.0703 9.69531 11.7734 9.10938 12.3594C8.52344 12.9453 7.82031 13.2383 7 13.2383C6.17969 13.2383 5.47656 12.9453 4.89062 12.3594C4.30469 11.7734 4.01172 11.0703 4.01172 10.25V5.36328C4.01172 4.84766 4.1875 4.41406 4.53906 4.0625C4.91406 3.6875 5.35938 3.5 5.875 3.5H6.08594C6.57812 3.54687 6.97656 3.76953 7.28125 4.16797C7.58594 4.54297 7.73828 4.97656 7.73828 5.46875V10.25H6.26172V5.36328C6.26172 5.12891 6.13281 5.01172 5.875 5.01172C5.61719 5.01172 5.48828 5.12891 5.48828 5.36328V10.25C5.48828 10.6484 5.64062 11 5.94531 11.3047C6.25 11.6094 6.60156 11.7617 7 11.7617C7.39844 11.7617 7.75 11.6094 8.05469 11.3047C8.35938 11 8.51172 10.6484 8.51172 10.25V6.48828H9.98828ZM2.5 14.0117H11.5V5.01172H8.51172V1.98828H2.5V14.0117ZM9.25 0.511719L13.0117 4.23828V14.0117C13.0117 14.4102 12.8594 14.7617 12.5547 15.0664C12.25 15.3477 11.8984 15.4883 11.5 15.4883H2.5C2.10156 15.4883 1.75 15.3477 1.44531 15.0664C1.14062 14.7617 0.988281 14.4102 0.988281 14.0117V1.98828C0.988281 1.58984 1.14062 1.25 1.44531 0.96875C1.75 0.664062 2.10156 0.511719 2.5 0.511719H9.25Z' fill='#212121' fillOpacity='0.87' />
    </svg>
  );
}

export default function TaskComment(props: ITaskComment): JSX.Element {
  const {
    focusedTask, commentForEdit, setCommentForEdit,
  } = props;
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [label, setLabel] = useState(false);

  const handleCommentChange = (
    e: { target: { value: string } },
  ): void => {
    if (e.target.value !== '\n') {
      setComment(e.target.value);
    }
  };

  const inputFocus = (): void => {
    if (!label) {
      setLabel(true);
    }
  };

  const showLabel = (): void => {
    if (comment === '') {
      setLabel(false);
    }
  };
  const commentMentionItem = (id: string, display: string): string => `@ ${display}`;

  const { data: managers = [] } = useQuery(
    'sidesheet-get-managers',
    async () => axios({
      url: '/api/filter/assignee/',
      params: {
        workspace: currentWorkspace.id,
      },
      method: 'get',
    }),
    {
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
              entry.avatar !== ''
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

  const { mutate: createComment, isLoading: loadingOnCreateComment } = useMutation(
    async () => axios({
      url: '/api/checklist-task-comment/',
      method: 'POST',
      data: {
        comment,
        task: focusedTask?.id,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get/checklist').then();
        setComment('');
        setLabel(false);
        enqueueSnackbar('Comment added successfully');
      },
      onError: (): void => {
        enqueueSnackbar('Comment sending failed ', { variant: 'error' });
      },
    },
  );
  const { mutate: createAttachment, isLoading: loadingOnCreateAttachment } = useMutation(
    async (attachmentData: Iattachment[]) => axios({
      url: '/api/checklist-task-comment/',
      method: 'POST',
      data: {
        attachments: attachmentData,
        task: focusedTask?.id,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get/checklist').then();
        setComment('');
        setLabel(false);
        enqueueSnackbar('Comment added successfully');
      },
      onError: (): void => {
        enqueueSnackbar('Comment sending failed ', { variant: 'error' });
      },
    },
  );
  const { mutate: updateComment, isLoading: loadingOnUpdateComment } = useMutation(
    async () => axios({
      url: `/api/checklist-task-comment/${commentForEdit?.id}/`,
      method: 'PATCH',
      data: {
        comment,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get/checklist').then();
        setComment('');
        enqueueSnackbar('Comment is updated successfully');
        setLabel(false);
        setCommentForEdit(null);
      },
      onError: (): void => {
        enqueueSnackbar('Comment sending failed ', { variant: 'error' });
      },
    },
  );

  useEffect(() => {
    if (commentForEdit !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setComment(commentForEdit.comment);
    }
  }, [commentForEdit]);

  const handleCreateComment = (): void => {
    if (comment !== null && comment.trim() !== '') {
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
    //   files.map((file) => { uploadFile(file); return file; });
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

  async function file2Base64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => { resolve(reader.result !== null && typeof reader.result === 'string' ? reader.result.toString() : ''); };
      reader.onerror = (error): void => { reject(error); };
    });
  }
  const handleFileClick = (fileId: string): void => {
    document.getElementById(fileId)?.click();
    setCommentForEdit(null);
  };
  const handleChecklistTaskAttachments = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const attachments: Iattachment[] = [];
    e.target.files !== null && e.target.files.length > 0 && Array.prototype.slice.call(e.target.files).map((file: File) => {
      let base64 = '';
      file2Base64(file).then((res) => {
        base64 = res;
        const obj = {
          file: base64,
          file_name: file.name,
        };
        attachments.push(obj);
      }).catch(() => {})
        .finally(() => {
          if (e.target.files !== null && attachments.length === e.target.files.length) {
            createAttachment(attachments);
          }
        });
    });
  };
  return (
    <div className='add-comment-wrapper'>
      <div className='comment-wrap'>
        {window.innerWidth > 600
        && (
          <div style={{ marginRight: '8px' }}>
            <Avatar className='main-avatar' src={`${process.env.REACT_APP_IMAGE_URL}/${user.avatar}`} />
          </div>
        ) }
        <div className='comment-input'>
          <form className='form form-anim'>
            {loadingOnCreateComment || loadingOnUpdateComment ? (
              <div style={{ marginLeft: '30px' }}>
                {' '}
                <StradaSpinner open={loadingOnCreateComment || loadingOnCreateAttachment || loadingOnUpdateComment} size={40} message='Comment is being created' />
                {' '}
              </div>
            ) : (
              <>
                <fieldset style={{ width: '100%' }} id='comment_box_wrapper'>
                  <p className={label ? 'label label-on-focus' : 'label'}>Add comment </p>
                  <MentionsInput
                    className='mentions'
                    value={comment !== null ? comment : ''}
                    onChange={handleCommentChange}
                    onBlur={showLabel}
                    onFocus={inputFocus}
                    allowSuggestionsAboveCursor
                    a11ySuggestionsListLabel='this comment'
                    onKeyDown={enterKeyEvent}
                  >
                    <Mention
                      trigger='@'
                      style={{ background: 'rgba(0, 207, 161, 0.12)' }}
                      data={managers}
                      displayTransform={commentMentionItem}
                      renderSuggestion={renderSuggestion}
                    />
                  </MentionsInput>
                </fieldset>
                <div className='comment-button-flex-div'>
                  <div className='comment-button-div' aria-hidden='true' onClick={(): void => { commentForEdit !== null ? updateComment() : createComment(); }}>
                    <CommentIcon />
                    <p>Add comment</p>
                  </div>
                  <input
                    type='file'
                    name='file'
                    id='selectImage'
                    style={{ display: 'none' }}
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                      handleChecklistTaskAttachments(e);
                    }}
                  />
                  <div className='comment-button-div' aria-hidden='true' onClick={(): void => { handleFileClick('selectImage'); }}>
                    <AttachFileIcon />
                    <p>Attach file</p>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
