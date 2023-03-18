/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import {
  Avatar, Button,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TitleIcon from '@mui/icons-material/Title';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import InputField from 'shared-components/inputs/InputField';
import AvatarGroup from '@mui/material/AvatarGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  ITasks, IContent, ISubTasks, Iassignee, DropResult,
} from './types';

interface IAllTaskProps {
  data: ITasks[] | undefined;
  setData: (value: ITasks[]) => void;
  focusedTask: ITasks | undefined;
  setFocusedTask: (value: ITasks) => void;
  setAddChanges: (value: boolean) => void;
}

function HandIcon(): JSX.Element {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17.2617 4.11328V15.0117C17.2617 15.832 16.957 16.5352 16.3477 17.1211C15.7617 17.707 15.0586 18 14.2383 18H8.78906C7.94531 18 7.23047 17.707 6.64453 17.1211L0.738281 11.1094C1.37109 10.5 1.69922 10.1953 1.72266 10.1953C1.88672 10.0547 2.08594 9.98438 2.32031 9.98438C2.48438 9.98438 2.63672 10.0195 2.77734 10.0898L6.01172 11.918V2.98828C6.01172 2.68359 6.11719 2.42578 6.32812 2.21484C6.5625 1.98047 6.83203 1.86328 7.13672 1.86328C7.44141 1.86328 7.69922 1.98047 7.91016 2.21484C8.14453 2.42578 8.26172 2.68359 8.26172 2.98828V8.26172H9V1.125C9 0.796875 9.10547 0.527344 9.31641 0.316406C9.52734 0.105469 9.79688 0 10.125 0C10.4531 0 10.7227 0.105469 10.9336 0.316406C11.1445 0.527344 11.25 0.796875 11.25 1.125V8.26172H11.9883V1.86328C11.9883 1.55859 12.0938 1.30078 12.3047 1.08984C12.5391 0.855469 12.8086 0.738281 13.1133 0.738281C13.418 0.738281 13.6758 0.855469 13.8867 1.08984C14.1211 1.30078 14.2383 1.55859 14.2383 1.86328V8.26172H15.0117V4.11328C15.0117 3.80859 15.1172 3.55078 15.3281 3.33984C15.5625 3.10547 15.832 2.98828 16.1367 2.98828C16.4414 2.98828 16.6992 3.10547 16.9102 3.33984C17.1445 3.55078 17.2617 3.80859 17.2617 4.11328Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function AllTasks(props: IAllTaskProps): JSX.Element {
  const {
    data, setData, focusedTask, setFocusedTask, setAddChanges,
  } = props;
  const [hideTaskIndex, setHideTaskIndex] = useState<boolean>(false);
  const [focusTaskIndex, setFocusTaskIndex] = useState<number>(0);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState<boolean>(false);
  const [isDataFound, setIsDataFound] = useState<boolean>(false);

  useEffect(() => {
    const taskElement = document.getElementById(focusTaskIndex.toString());
    taskElement?.focus();
  }, [focusTaskIndex]);

  useEffect(() => {
    let index = 1;
    if (data && !isDataFound) {
      const filteredData = data.map((task: ITasks): ITasks => {
        if (!task.is_heading) {
          task.task_index = index;
          index++;
        }
        return task;
      });
      setIsDataFound(true);
      setData(filteredData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    let index = 1;
    if (data !== undefined) {
      const filteredData = data.map((task: ITasks): ITasks => {
        if (!task.is_heading) {
          task.task_index = index;
          index++;
        }
        return task;
      });
      setData(filteredData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideTaskIndex, focusTaskIndex]);

  function HandleTaskOrder(index: number): string {
    if (data !== undefined) {
      if (index === 0) {
        return 'task-input-first';
      }
      if (index === data.length - 1) {
        return 'task-input-last';
      }
    }
    return 'task-input-middle';
  }
  function HandleTaskName(event: React.ChangeEvent<HTMLInputElement>, index: number): void {
    if (data !== undefined) {
      setData(data.map((task: ITasks, indx) => {
        if (index === indx) {
          task.name = event.target.value;
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addTaskOrHeading(isheading: boolean): void {
    if (data !== undefined) {
      const obj: ITasks = {
        unique_position_key: Date.now().toString(),
        name: '',
        is_heading: isheading,
        assignees: [],
        content: [],
        due_is_after: true,
        due_is_weekday_only: false,
        due_minutes: 0,
        due_months: 0,
        due_days: 0,
        due_hours: 0,
        is_stop: false,
      };
      data.splice(focusTaskIndex + 1, 0, obj);
      setData(data);
      setAddChanges(true);
      setFocusedTask(obj);
      setFocusTaskIndex(focusTaskIndex + 1);
    }
  }
  function duplicateTask(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj: ITasks = JSON.parse(JSON.stringify(focusedTask));
      obj.unique_position_key = Date.now().toString();
      delete obj.id;
      obj.content.map((item: IContent) => {
        delete item.id;
        if (item.type === 'subTask' && item.subTasks !== undefined) {
          item.subTasks.map((subtask: ISubTasks) => {
            delete subtask.id;
          });
        }
        if (item.type === 'file') {
          item.is_duplicate = true;
          item.is_new = false;
        }
      });
      const newData = [...data];
      newData.push(obj);
      setData(newData);
      setFocusedTask(newData[newData.length - 1]);
      setFocusTaskIndex(newData.length - 1);
      setAddChanges(true);
    }
  }
  function swapWithUpperTask(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const index = data.findIndex((item) => item.unique_position_key === focusedTask.unique_position_key);
      if (index !== 0) {
        const newData = [...data];
        const temp = newData[index - 1];
        newData[index - 1] = newData[index];
        newData[index] = temp;
        setData(newData);
        setAddChanges(true);
        setFocusTaskIndex(index - 1);
      }
    }
  }
  function swapWithLowerTask(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const index = data.findIndex((item) => item.unique_position_key === focusedTask.unique_position_key);
      if (index !== data.length - 1) {
        const newData = [...data];
        const temp = newData[index + 1];
        newData[index + 1] = newData[index];
        newData[index] = temp;
        setData(newData);
        setAddChanges(true);
        setFocusTaskIndex(index + 1);
      }
    }
  }
  function reorder(list: ITasks[], startIndex: number, endIndex: number): ITasks[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  function onDragEnd(result: DropResult): void {
    if (data !== undefined) {
      if (result.destination) {
        setData(reorder(data, result.source.index, result.destination.index));
        setHideTaskIndex(false);
        setAddChanges(true);
      }
    }
  }
  function deleteTask(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const index = data.findIndex((task) => task.unique_position_key === focusedTask.unique_position_key);
      if (data.length !== 1) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        setAddChanges(true);
        if (index !== 0) {
          setFocusedTask(newData[index - 1]);
          setFocusTaskIndex(index - 1);
        } else {
          setFocusedTask(newData[index]);
          setFocusTaskIndex(index);
        }
        setOpenDeleteTaskDialog(false);
      }
    }
  }

  return (
    <div className='task-wrap-div'>
      <div className='task-wrap'>
        <DragDropContext onDragEnd={(result: DropResult): void => { onDragEnd(result); }} onDragStart={(): void => { setHideTaskIndex(true); }}>
          <Droppable droppableId='12345678'>

            {(provided): JSX.Element => (
              <div ref={provided.innerRef}>
                {
                  data !== undefined ? data.map((task: ITasks, index) => (
                    <Draggable draggableId={String(task.unique_position_key)} key={task.unique_position_key} index={index}>
                      {(provideed): JSX.Element => (
                        <div ref={provideed.innerRef} {...provideed.draggableProps} {...provideed.dragHandleProps}>
                          <div className='task-input d-flex align-items-center' aria-hidden='true' onClick={(): void => { setFocusedTask(task); setFocusTaskIndex(index); }}>
                            <div className='task-index' style={{ color: focusedTask !== undefined && focusedTask.unique_position_key === task.unique_position_key ? '#00CFA1' : '#212121' }}>
                              <p>{task.task_index}</p>
                              {task.is_stop && <div className={focusedTask !== undefined && focusedTask.unique_position_key === task.unique_position_key ? 'hand-icon-focus' : 'hand-icon'}><HandIcon /></div>}
                            </div>
                            <div className={HandleTaskOrder(index)}>
                              <div className={task.is_heading ? 'headingInput' : 'taskInput'}>
                                <InputField
                                  name='name'
                                  id={index.toString()}
                                  type='text'
                                  onChange={(event): void => { HandleTaskName(event, index); }}
                                  value={task.name}
                                  required
                                  autoFocus
                                  endAdornment={(
                                    <AvatarGroup max={2}>
                                      {task.assignees.map((assignee: Iassignee) => (
                                        <Avatar alt={assignee.name} key={assignee.id} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                                      ))}
                                    </AvatarGroup>
                                  )}
                                  placeholder={task.is_heading ? 'Type heading name here' : 'Type task name here'}
                                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addTaskOrHeading(false);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )) : null
                }
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* {renderTasks(filterData, setData, hideTaskIndex, setHideTaskIndex, focusedTask, setFocusedTask, focusTaskIndex, setFocusTaskIndex, setAddChanges)} */}
      </div>
      <div className='bottom-menu'>
        <div className='menu-wrap'>
          <div className='menu-item' aria-hidden='true' onClick={(): void => { addTaskOrHeading(false); }}>
            <AddBoxIcon />
            <p>Task</p>
          </div>
          <div className='menu-item' aria-hidden='true' onClick={(): void => { addTaskOrHeading(true); }}>
            <TitleIcon />
            <p>Heading</p>
          </div>
          <div className='menu-item' aria-hidden='true' onClick={(): void => { duplicateTask(); }}>
            <FileCopyIcon />
            <p>Duplicate</p>
          </div>
          <div className='menu-item' aria-hidden='true' onClick={(): void => { swapWithUpperTask(); }}>
            <ArrowUpwardIcon />
          </div>
          <div className='menu-item' aria-hidden='true' onClick={(): void => { swapWithLowerTask(); }}>
            <ArrowDownwardIcon />
          </div>
          <div className='menu-item' style={{ borderRight: 'none' }} aria-hidden='true' onClick={(): void => { setOpenDeleteTaskDialog(true); }}>
            <DeleteIcon />
          </div>
        </div>
      </div>
      <Dialog
        open={openDeleteTaskDialog}
        keepMounted
      >
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>Delete selected task?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            This task and all of its content will be deleted
          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpenDeleteTaskDialog(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={(): void => { deleteTask(); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
