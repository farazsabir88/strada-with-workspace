/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Avatar, IconButton, Tooltip } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type {
  IRefectorComment, ISSComment, ISSRefectorComments, IHistory, ISSEmail,
} from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import StradaLoader from 'shared-components/components/StradaLoader';
import parse from 'html-react-parser';

export default function ActivitySection({ setCommentForEdit }: { setCommentForEdit: (val: ISSComment | null) => void }): JSX.Element {
  const [activeTab, setActiveTab] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  function CommentCompnent({ comments }: { comments: ISSComment[] | undefined }): JSX.Element {
    const { mutate: deleteComment, isLoading } = useMutation(async (commentId: number) => axios({
      url: `/api/budget-calendar/event-comment/${commentId}/`,
      method: 'DELETE',
    }), {
      onSuccess: async (): Promise<void> => {
        enqueueSnackbar('Comment deleted successfully');
        await queryClient.invalidateQueries('get-single-sidesheet').then();
      },
      onError: () => {
        enqueueSnackbar('Request failed');
      },
    });

    if (comments === undefined) {
      return <div />;
    }

    if (comments.length === 0) {
      return (
        <div className='content-not-found-heading'>
          {/* {' '}
          <SentimentVeryDissatisfiedIcon style={{ color: 'rgba(33, 33, 33, 0.6)' }} fontSize='small' />
          {' '}
          <p>No comment found</p>
          {' '} */}
        </div>
      );
    }

    const refactorComments = (commentsForRef: ISSComment[]): ISSRefectorComments[] => {
      const newComments: ISSRefectorComments[] = [];
      commentsForRef.forEach((cmt) => {
        let comment: ISSRefectorComments = cmt;
        if (typeof comment.comment === 'object') {
          // do nothing
        } else {
          // eslint-disable-next-line no-useless-escape
          const names = [...comment.comment.matchAll(/\@\[(.*?)\]\(.*?\)/g)];
          if (names.length > 0) {
            const newComment: IRefectorComment[] = [];
            let nameIndex = 0;
            const parts = comment.comment.split('@');
            parts.forEach((part) => {
              if (part === '') {
                // do nothing
              } else if (part.startsWith('[')) {
                const lastIndex = part.indexOf(')');
                newComment.push({ part: names[nameIndex][1], flag: true });
                const newPart = part.replace(part.substr(0, lastIndex + 1), '');
                newComment.push({ part: newPart, flag: false });
                nameIndex += 1;
              } else newComment.push({ part, flag: false });
            });
            // comment.newComment = newComment;
            comment = { ...comment, comment: newComment };
            // comment.comment = newComment;
          }
        }

        newComments.push(comment);
      });
      return newComments;
    };

    const handleEditComment = (commentId: number): void => {
      const commnetforId = comments.filter((c) => c.id === commentId);
      if (commnetforId.length > 0) {
        setCommentForEdit(commnetforId[0]);
      }
    };

    const refComment: ISSRefectorComments[] = refactorComments(comments);

    const renderComment = (comment: IRefectorComment[] | string): JSX.Element => {
      if (typeof comment === 'object') {
        const arrayComment: JSX.Element[] = [];
        comment.forEach((part: { flag: boolean; part: string }) => {
          if (part.flag) {
            arrayComment.push(<span style={{ color: '#00CFA1', cursor: 'pointer' }}>{part.part}</span>);
          } else arrayComment.push(<span>{part.part}</span>);
        });

        return (
          <pre className='comment-detail'>
            {arrayComment.map((arrComment) => arrComment)}
          </pre>
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return <pre className='comment-detail'>{parse(comment)}</pre>;
    };

    return (
      <>
        <StradaLoader open={isLoading} message='Action in progress' />
        {refComment.map((comment: ISSComment): JSX.Element => (
          <div className='comment' key={comment.id}>
            <Avatar src={`${process.env.REACT_APP_IMAGE_URL}/${comment.user_info.avatar}`} className='comment-avatar' />
            <div className='comment-details'>
              <div className='comment-heading'>
                <div className='comment-name'>
                  {comment.user_info.name}
                </div>
                <div className='comment-time'>
                  {moment(comment.updated_at).format('MMMM DD, YYYY')}
                </div>
                {userId === comment.user_info.id && (
                  <PopupState variant='popover' popupId='demo-popup-popover'>
                    {(popupState): JSX.Element => (
                      <div className='comment-options'>
                        <IconButton
                          {...bindTrigger(popupState)}
                        >
                          <MoreVertIcon fontSize='small' />
                        </IconButton>
                        <Popover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <Typography sx={{ p: 2 }} style={{ cursor: 'pointer', fontSize: '14px' }} onClick={(): void => { handleEditComment(comment.id); }}>
                            Edit
                          </Typography>
                          <Typography sx={{ p: 2 }} style={{ cursor: 'pointer', fontSize: '14px' }} onClick={(): void => { deleteComment(comment.id); popupState.close(); }}>Delete</Typography>
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                )}

              </div>
              <div className='bottom-bar'>
                {/* <h6> Maria Laghari </h6> */}
                {renderComment(comment.comment)}
              </div>
            </div>

          </div>

        ))}
      </>

    );
  }

  function HistoryComponent({ history }: { history: IHistory[] | undefined }): JSX.Element {
    if (history?.length === 0) {
      return (
        <div className='content-not-found-heading'>
          {/* {' '}
          <SentimentVeryDissatisfiedIcon style={{ color: 'rgba(33, 33, 33, 0.6)' }} fontSize='small' />
          {' '}
          <p>No history element found</p>
          {' '} */}
        </div>
      );
    }
    return (
      <div>
        {history?.map((historyInstance) => (
          <div className='single-history-element' key={historyInstance.time}>
            <div className='left-side'>
              <Avatar src={`${process.env.REACT_APP_IMAGE_URL}/${historyInstance.user_info.avatar}`} className='history-avatar' />
              <div className='text-area'>
                <h6>
                  {' '}
                  {historyInstance.user_info.name}
                  {' '}
                  <span>
                    {' '}
                    {historyInstance.description}
                    {' '}
                  </span>
                </h6>

              </div>
            </div>
            <div className='right-side'>
              <Tooltip title={moment(historyInstance.time).format('hh:mm A')}>
                <p className='cursor-pointer'>
                  {' '}
                  {moment(historyInstance.time).format('MMM DD, YYYY')}
                  {' '}
                </p>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function SingleEmail({ email }: { email: ISSEmail }): JSX.Element {
    const [subjectExpended, setSubjectExpended] = useState(false);
    const [messagesExpended, setMessageExpended] = useState(false);

    return (
      <div className='email-main-wrapper'>
        {/* Email Bar */}
        {!messagesExpended && (
          <div className='ss-email-wrapper' aria-hidden='true' onClick={(): void => { setSubjectExpended(true); }}>
            <div className='email-info'>
              {subjectExpended && (
                <IconButton onClick={(e): void => { e.stopPropagation(); setSubjectExpended(false); }} className='back-button'>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <h6>
                {' '}
                {email.name}
                {' '}
                <span>
                  {' '}
                  (
                  {email.email}
                  )
                  {' '}
                </span>
                {' '}
              </h6>
            </div>
            <div className='expand-icon'>
              {!subjectExpended && <ChevronRightIcon fontSize='small' /> }
            </div>
          </div>
        )}

        {/* Subject Bar */}
        {subjectExpended && (
          <div className='email-subject-wrapper' onClick={(): void => { setMessageExpended(true); }} aria-hidden='true'>
            <div className='left-side'>
              {messagesExpended && (
                <IconButton onClick={(e): void => { e.stopPropagation(); setMessageExpended(false); }} className='back-button'>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <h6>
                {' '}
                {email.subject}
                {' '}
              </h6>
            </div>
            <div className='expand-icon'>
              {!messagesExpended && <ChevronRightIcon fontSize='small' />}
            </div>
          </div>
        ) }

        {/* Messages List */}
        {messagesExpended
          && email.data.map((message) => (
            <div className='ss-message-wrapper' key={message.dateTime}>
              <div className='message-header'>
                <div className='message-text-side'>
                  <h6>
                    {' '}
                    {message.name}
                    {' '}
                    <span>
                      (
                      {email.email}
                      )
                    </span>
                    {' '}
                  </h6>
                </div>
                <div className='time-side'>
                  {moment(message.dateTime).format('MMM DD, YYYY hh:mm A')}
                </div>
              </div>

              <pre className='message-text'>
                {message.message}
              </pre>
            </div>
          ))}

      </div>
    );
  }

  function EmailComponent({ emails }: { emails: ISSEmail[] | undefined }): JSX.Element {
    if (emails?.length === 0) {
      return (
        <div className='content-not-found-heading'>
          {/* {' '}
          <SentimentVeryDissatisfiedIcon style={{ color: 'rgba(33, 33, 33, 0.6)' }} fontSize='small' />
          {' '}
          <p>No email found</p>
          {' '} */}
        </div>
      );
    }
    return (
      <div>
        {emails?.map((email) => <SingleEmail key={email.id} email={email} />)}
      </div>
    );
  }

  const tabs = [
    {
      id: 1,
      heading: 'Comments',
      component: <CommentCompnent comments={singleSideSheetData?.comments} />,
    },
    {
      id: 2,
      heading: 'History',
      component: <HistoryComponent history={singleSideSheetData?.histories} />,
    },
    {
      id: 3,
      heading: 'Tracked Emails',
      component: <EmailComponent emails={singleSideSheetData?.tracked_emails} />,
    },
  ];

  return (
    <div className='active-section-main-wrapper'>
      <div className='inner-wrapper'>
        <div className='heading'>
          <h6> Activity </h6>
        </div>
        <div className='tabs-row'>
          <p> Show </p>
          <div className='tabs-wrapper'>
            {tabs.map((tab): JSX.Element => (
              <div key={tab.id} className={activeTab === tab.id ? 'single-tab active' : 'single-tab'} aria-hidden='true' onClick={(): void => { setActiveTab(tab.id); }}>
                {tab.heading}
              </div>
            ))}
          </div>

        </div>

      </div>
      <div className='mt-2'>
        {tabs.filter((tab) => tab.id === activeTab)[0].component}
      </div>

    </div>
  );
}
