/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button, IconButton, InputAdornment, Checkbox,
} from '@mui/material';
import { StyledMenu, StyledMenuItem } from 'shared-components/components/StyledComponent';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Editor } from '@tinymce/tinymce-react';
import InputField from 'shared-components/inputs/InputField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import StradaLoader from 'shared-components/components/StradaLoader';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublishIcon from '@mui/icons-material/Publish';
import EmailIcon from '@mui/icons-material/Email';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  IContent, ITasks, ISubTasks, ISendEmailData, DropResult, IOptions,
} from './types';

interface IRenderTaskContentProps {
  data: ITasks[] | undefined;
  setData: (value: ITasks[]) => void;
  focusedTask: ITasks | undefined;
  setAddChanges: (value: boolean) => void;
}

function MergeTagIcon(): JSX.Element {
  return (
    <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M7.5 3.57812L9.98438 4.98438L8.57812 2.5L9.98438 0.015625L7.5 1.42188L5.01562 0.015625L6.42188 2.5L5.01562 4.98438L7.5 3.57812ZM19.5 13.4219L17.0156 12.0156L18.4219 14.5L17.0156 16.9844L19.5 15.5781L21.9844 16.9844L20.5781 14.5L21.9844 12.0156L19.5 13.4219ZM21.9844 0.015625L19.5 1.42188L17.0156 0.015625L18.4219 2.5L17.0156 4.98438L19.5 3.57812L21.9844 4.98438L20.5781 2.5L21.9844 0.015625ZM14.3906 5.3125C14.1719 5.09375 13.9219 4.98438 13.6406 4.98438C13.3906 4.98438 13.1562 5.09375 12.9375 5.3125L1.3125 16.9375C1.09375 17.1562 0.984375 17.4062 0.984375 17.6875C0.984375 17.9375 1.09375 18.1719 1.3125 18.3906L3.60938 20.6875C3.82812 20.9062 4.0625 21.0156 4.3125 21.0156C4.59375 21.0156 4.84375 20.9062 5.0625 20.6875L16.6875 9.0625C16.9062 8.84375 17.0156 8.60938 17.0156 8.35938C17.0156 8.07812 16.9062 7.84375 16.6875 7.65625L14.3906 5.3125ZM13.3594 10.7969L11.2031 8.64062L13.6406 6.20312L15.7969 8.35938L13.3594 10.7969Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function hanldeAddMergeTag(mergeFieldType: string, sendEmaildata: IContent, labelKey: string | undefined, data: ITasks[], setData: (value: ITasks[]) => void, focusedTask: ITasks, setAddChanges: (value: boolean) => void): void {
  if (data !== undefined && focusedTask !== undefined) {
    setData(data.map((task: ITasks) => {
      if (task.unique_position_key === focusedTask.unique_position_key) {
        task.content.map((item: IContent) => {
          if (item.unique_position_key === sendEmaildata.unique_position_key && item.sendEmailData !== undefined && labelKey !== undefined) {
            if (labelKey.length > 30) {
              item.sendEmailData[`${mergeFieldType}` as keyof ISendEmailData] += `{{form.${labelKey.slice(0, 29)}}}`;
            } else {
              item.sendEmailData[`${mergeFieldType}` as keyof ISendEmailData] += `{{form.${labelKey}}}`;
            }
          }
        });
      }
      return task;
    }));
    setAddChanges(true);
  }
}
function renderMergeTagList(mergeFieldType: string, item: IContent, data: ITasks[] | undefined, setData: (value: ITasks[]) => void, focusedTask: ITasks, setAddChanges: (value: boolean) => void): JSX.Element {
  let emailFieldsExist = false;
  let formFieldsExist = false;
  return (
    <div>
      { data !== undefined ? data.map((task) => task.content.map((contentt) => {
        if (contentt.type === 'form' && contentt.form_type !== 'fileUpload' && (mergeFieldType === 'subject' || mergeFieldType === 'body')) {
          formFieldsExist = true;
          return <StyledMenuItem className='mergetag-menu-item' onClick={(): void => { hanldeAddMergeTag(mergeFieldType, item, contentt.label_key, data, setData, focusedTask, setAddChanges); }}><span className='btn-txt'>{contentt.label}</span></StyledMenuItem>;
        } if (contentt.type === 'form' && contentt.form_type === 'email') {
          emailFieldsExist = true;
          formFieldsExist = true;
          return <StyledMenuItem className='mergetag-menu-item' onClick={(): void => { hanldeAddMergeTag(mergeFieldType, item, contentt.label_key, data, setData, focusedTask, setAddChanges); }}><span className='btn-txt'>{contentt.label}</span></StyledMenuItem>;
        }
        return null;
      })) : null}
      {!emailFieldsExist && mergeFieldType !== 'subject' && mergeFieldType !== 'body'
        ? <StyledMenuItem className='mergetag-menu-item'><span className='btn-txt'>No Form Field Exist</span></StyledMenuItem>
        : !formFieldsExist
          ? <StyledMenuItem className='mergetag-menu-item'><span className='btn-txt'>No Form Field Exist</span></StyledMenuItem>
          : null}
    </div>
  );
}

export default function RenderTaskContent(props: IRenderTaskContentProps): JSX.Element {
  const {
    data, setData, focusedTask, setAddChanges,
  } = props;
  const [editorLoader, setEditorLoader] = useState<boolean>(true);
  const [selectedContentItem, setSelectedContentItem] = useState<IContent>();
  const [openDeleteContentBlock, setOpenDeleteContentBlock] = useState<boolean>(false);
  const [mergeFieldType, setMergeFieldType] = useState<string>('');
  const [mergeTagAnchorEl, setMergeTagAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showSubtaskInputIndex, setShowSubtaskInputIndex] = useState<number>(-1);
  const [showDropdownInputIndex, setShowDropdownInputIndex] = useState<number>(-1);
  const [showRadioInputIndex, setShowRadioInputIndex] = useState<number>(-1);
  const [showMultichoiceInputIndex, setShowMultichoiceInputIndex] = useState<number>(-1);
  const [formItemkey, setFormItemkey] = useState<string>('');

  function handleChangeEditorContent(editor_content: string, editordata: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === editordata.unique_position_key) {
              item.value = editor_content;
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function swapWithUpperContent(content_index: number): void {
    if (data !== undefined && focusedTask !== undefined) {
      if (content_index !== 0) {
        setData(data.map((task: ITasks) => {
          if (task.unique_position_key === focusedTask.unique_position_key) {
            const temp = task.content[content_index - 1];
            task.content[content_index - 1] = task.content[content_index];
            task.content[content_index] = temp;
          }
          return task;
        }));
        setAddChanges(true);
      }
    }
  }
  function swapWithLowerContent(content_index: number): void {
    if (data !== undefined && focusedTask !== undefined) {
      const index = data.findIndex((task) => task.unique_position_key === focusedTask.unique_position_key);
      if (content_index !== data[index].content.length - 1) {
        setData(data.map((task: ITasks) => {
          if (task.unique_position_key === focusedTask.unique_position_key) {
            const temp = task.content[content_index + 1];
            task.content[content_index + 1] = task.content[content_index];
            task.content[content_index] = temp;
          }
          return task;
        }));
        setAddChanges(true);
      }
    }
  }
  function deleteTaskItem(itemData: IContent | undefined): void {
    if (data !== undefined && focusedTask !== undefined) {
      if (itemData !== undefined) {
        const index = data.findIndex((task) => task.unique_position_key === focusedTask.unique_position_key);
        const index2 = data[index].content.findIndex((item) => item.unique_position_key === itemData.unique_position_key);
        setData(data.map((task: ITasks, indx) => {
          if (index === indx) {
            task.content.splice(index2, 1);
          }
          return task;
        }));
        setAddChanges(true);
        setOpenDeleteContentBlock(false);
      }
    }
  }
  function duplicateContentItem(seletedContent: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj: IContent = JSON.parse(JSON.stringify(seletedContent));
      obj.unique_position_key = Date.now().toString();
      delete obj.id;
      if (obj.type === 'subTask' && obj.subTasks !== undefined) {
        obj.subTasks.map((subtask: ISubTasks) => {
          delete subtask.id;
        });
      }
      if (obj.type === 'file') {
        obj.is_duplicate = true;
        obj.is_new = false;
      }
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleFileClick(fileId: string): void {
    document.getElementById(fileId)?.click();
  }
  async function file2Base64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => { resolve(reader.result !== null && typeof reader.result === 'string' ? reader.result.toString() : ''); };
      reader.onerror = (error): void => { reject(error); };
    });
  }
  async function onProcessAttachment(addedFile: File, fileitem: IContent): Promise<string> {
    const base64 = await file2Base64(addedFile).then((res): string => {
      const obj = {
        file: res,
        file_name: addedFile.name,
      };
      if (data !== undefined && focusedTask !== undefined) {
        setData(data.map((task: ITasks) => {
          if (task.unique_position_key === focusedTask.unique_position_key) {
            task.content.map((item: IContent) => {
              if (item.unique_position_key === fileitem.unique_position_key) {
                item.files = obj;
                item.is_new = true;
                item.is_duplicate = false;
              }
            });
          }
          return task;
        }));
        setAddChanges(true);
      }
      return res;
    });
    return base64;
  }
  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>, descItem: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === descItem.unique_position_key) {
              item.description = e.target.value;
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleSendEmailChange(e: React.ChangeEvent<HTMLInputElement> | string, sendEmaildata: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === sendEmaildata.unique_position_key && item.sendEmailData !== undefined) {
              if (typeof e === 'string') {
                item.sendEmailData.body = e;
              } else {
                item.sendEmailData[e.target.name as keyof ISendEmailData] = e.target.value;
              }
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleSubTaskInputChange(value: string, subTaskItem: IContent, subTaskInnerItem: ISubTasks): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === subTaskItem.unique_position_key && item.subTasks !== undefined) {
              item.subTasks.map((subTasksItem: ISubTasks) => {
                if (subTasksItem.unique_position_key === subTaskInnerItem.unique_position_key) {
                  subTasksItem.value = value;
                }
              });
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addNewSubTask(subTaskItem: IContent, subTaskItemIndex: number): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        // isTrue:false,
        value: '',
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === subTaskItem.unique_position_key && item.subTasks !== undefined) {
              item.subTasks.splice(subTaskItemIndex + 1, 0, obj);
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
      setShowSubtaskInputIndex(subTaskItemIndex + 1);
    }
  }
  function handleIsRequiredCheckbox(subTaskItem: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === subTaskItem.unique_position_key && item.is_required !== undefined) {
              item.is_required = !item.is_required;
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleFormLabelChange(label: string, formItem: IContent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === formItem.unique_position_key) {
              item.label = label;
              item.label_key = `${label.toLowerCase().replaceAll(' ', '_')}_${item.unique_position_key.toString().slice(-4)}`;
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleOption(label: string, formItem: IContent, singleOption: IOptions): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === formItem.unique_position_key && item.options !== undefined) {
              item.options.map((option: IOptions) => {
                if (option.unique_position_key === singleOption.unique_position_key) {
                  option.label = label;
                }
              });
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addNewOption(dropdownItem: IContent, dropdownItemIndex: number): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        // isTrue:false,
        label: '',
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === dropdownItem.unique_position_key && item.options !== undefined) {
              item.options.splice(dropdownItemIndex + 1, 0, obj);
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
      if (dropdownItem.form_type === 'dropdown') {
        setShowDropdownInputIndex(dropdownItemIndex + 1);
      } else if (dropdownItem.form_type === 'radio') {
        setShowRadioInputIndex(dropdownItemIndex + 1);
      } else {
        setShowMultichoiceInputIndex(dropdownItemIndex + 1);
      }
    }
  }
  function removeOption(dropdownItem: IContent, dropdownItemIndex: number): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.map((item: IContent) => {
            if (item.unique_position_key === dropdownItem.unique_position_key && item.options !== undefined && item.options.length > 1) {
              item.options.splice(dropdownItemIndex, 1);
            }
          });
        }
        return task;
      }));
      setAddChanges(true);
    }
  }

  function reorder(list: IContent[], startIndex: number, endIndex: number | undefined): IContent[] {
    const result = Array.from(list);
    if (endIndex !== undefined) {
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
    }
    return result;
  }
  function onContentDragEnd(result: DropResult): void {
    if (data !== undefined && focusedTask !== undefined) {
      if (result.destination !== undefined) {
        setData(data.map((task: ITasks) => {
          if (task.unique_position_key === focusedTask.unique_position_key) {
            task.content = reorder(task.content, result.source.index, result.destination?.index);
          }
          return task;
        }));
        setAddChanges(true);
      }
    }
  }

  return (
    <div className='task-form-wrapper'>
      {focusedTask !== undefined && focusedTask.content.length > 0 ? (
        <DragDropContext onDragEnd={(result: DropResult): void => { onContentDragEnd(result); }}>
          <Droppable droppableId='11223344'>
            {(provided): JSX.Element => (
              <div ref={provided.innerRef}>
                {focusedTask.content.map((item: IContent, index) => (
                  <Draggable draggableId={String(item.unique_position_key)} key={String(item.unique_position_key)} index={index}>
                    {(provideed): JSX.Element => (
                      <div ref={provideed.innerRef} {...provideed.draggableProps} {...provideed.dragHandleProps}>
                        {item.type === 'text' ? (
                          <div className='task-form-item' key={item.unique_position_key}>
                            <div className='editor-wrapper'>
                              <div className='swap-up-down-wrapper'>
                                <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                              </div>
                              <div className='editor-div'>
                                <div className='loader-div'><StradaLoader open={editorLoader} /></div>
                                <Editor
                                  apiKey='1y7zut3pxyomlx5vhlj7wuh2q7r7sd4w8x7oevrxn05o07fq'
                                  // eslint-disable-next-line react/no-array-index-key
                                  key={`index-${index}`}
                                  onLoadContent={(): void => { setEditorLoader(false); }}
                                  init={{
                                    height: 150,
                                    branding: false,
                                    menubar: false,
                                    skin: 'material-outline',
                                    content_css: 'material-outline',
                                    plugins: [
                                      'advlist autolink lists link image charmap print preview anchor',
                                      'searchreplace visualblocks code fullscreen',
                                      'insertdatetime media table paste code help ',
                                    ],
                                    toolbar: 'undo redo | styleselect | fontsizeselect | backcolor | bold italic underline|  bullist numlist | outdent indent',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;} ',
                                  }}
                                  value={item.value}
                                  onEditorChange={(content: string): void => { handleChangeEditorContent(content, item); }}
                                />
                              </div>
                              <div className='delete-duplicate-wrapper'>
                                <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                              </div>
                            </div>
                          </div>
                        ) : item.type === 'file'
                          ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                {item.files !== undefined && item.files.file_name !== ''
                                  ? (
                                    <div style={{ width: '100%' }}>
                                      <div className='file-div'>
                                        <DescriptionIcon />
                                        <div style={{ width: '100%' }}>
                                          <h6>{item.files.file_name}</h6>
                                          <p>PDF</p>
                                        </div>
                                        <PopupState variant='popper' popupId='demo-popup-popper'>
                                          {(popupState): JSX.Element => (
                                            <div>
                                              <IconButton {...bindToggle(popupState)}>
                                                <MoreVertIcon fontSize='inherit' />
                                              </IconButton>
                                              <Popper {...bindPopper(popupState)} transition style={{ zIndex: '10000' }}>
                                                {({ TransitionProps }): JSX.Element => (
                                                  <ClickAwayListener
                                                    onClickAway={(): void => {
                                                      popupState.close();
                                                    }}
                                                  >
                                                    <Fade {...TransitionProps} timeout={350}>
                                                      <Paper className='checklist-list-popover'>
                                                        <div
                                                          className='chart-btn'
                                                          onClick={(): void => {
                                                            popupState.close();
                                                          }}
                                                          aria-hidden='true'
                                                        >
                                                          <a style={{ textDecoration: 'none' }} href={`${process.env.REACT_APP_IMAGE_URL}/${item.files !== undefined ? item.files.file_name : ''}`}>
                                                            <span className='edit-delete-text '>
                                                              Download
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </Paper>
                                                    </Fade>
                                                  </ClickAwayListener>
                                                )}
                                              </Popper>
                                            </div>
                                          )}
                                        </PopupState>
                                      </div>
                                      <div className='file-description-div'>
                                        <InputField
                                          name='name'
                                          label='Description(optional)'
                                          type='text'
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleDescriptionChange(e, item); }}
                                          value={item.description}
                                        />
                                      </div>
                                    </div>
                                  )
                                  : (
                                    <div className='file-input-wrap'>
                                      <input
                                        type='file'
                                        name='file'
                                        id={`selectImage${item.unique_position_key}`}
                                        style={{ display: 'none' }}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                          if (e.target.files === null) return;
                                          onProcessAttachment(e.target.files[0], item).then(
                                            () => {},
                                            () => {},
                                          );
                                        }}
                                      />
                                      <div className='file-input-div' aria-hidden='true' onClick={(): void => { handleFileClick(`selectImage${item.unique_position_key}`); }}>
                                        <PublishIcon />
                                        <p>Upload file</p>
                                      </div>
                                    </div>
                                  )}
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.type === 'sendEmail' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='sendEmail-input-wrap'>
                                    <InputField
                                      id='to'
                                      name='to'
                                      label='To'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailChange(e, item); }}
                                      value={item.sendEmailData !== undefined ? item.sendEmailData.to : ''}
                                      endAdornment={(
                                        <InputAdornment position='end'>
                                          <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>): void => { setMergeTagAnchorEl(event.currentTarget); setMergeFieldType('to'); }}>
                                            <MergeTagIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      )}
                                    />
                                  </div>
                                  <div className='sendEmail-input-wrap'>
                                    <InputField
                                      id='cc'
                                      name='cc'
                                      label='Cc'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailChange(e, item); }}
                                      value={item.sendEmailData !== undefined ? item.sendEmailData.cc : ''}
                                      error={false}
                                      endAdornment={(
                                        <InputAdornment position='end'>
                                          <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>): void => { setMergeTagAnchorEl(event.currentTarget); setMergeFieldType('cc'); }}>
                                            <MergeTagIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      )}
                                    />
                                  </div>
                                  <div className='sendEmail-input-wrap'>
                                    <InputField
                                      id='bcc'
                                      name='bcc'
                                      label='Bcc'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailChange(e, item); }}
                                      value={item.sendEmailData !== undefined ? item.sendEmailData.bcc : ''}
                                      endAdornment={(
                                        <InputAdornment position='end'>
                                          <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>): void => { setMergeTagAnchorEl(event.currentTarget); setMergeFieldType('bcc'); }}>
                                            <MergeTagIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      )}
                                    />
                                  </div>
                                  <div className='sendEmail-input-wrap'>
                                    <InputField
                                      id='subject'
                                      name='subject'
                                      label='Subject'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailChange(e, item); }}
                                      value={item.sendEmailData !== undefined ? item.sendEmailData.subject : ''}
                                      error={false}
                                      endAdornment={(
                                        <InputAdornment position='end'>
                                          <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>): void => { setMergeTagAnchorEl(event.currentTarget); setMergeFieldType('subject'); }}>
                                            <MergeTagIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      )}
                                    />
                                  </div>
                                  <div className='file-description-div'>
                                    <div style={{ marginLeft: '6%' }}><StradaLoader open={editorLoader} /></div>
                                    <div style={{ display: 'flex' }}>
                                      <div style={{ width: '100%' }}>
                                        <Editor
                                          apiKey='1y7zut3pxyomlx5vhlj7wuh2q7r7sd4w8x7oevrxn05o07fq'
                                          onLoadContent={(): void => { setEditorLoader(false); }}
                                          init={{
                                            height: 150,
                                            branding: false,
                                            menubar: false,
                                            skin: 'material-outline',
                                            content_css: 'material-outline',
                                            plugins: [
                                              'advlist autolink lists link image charmap print preview anchor',
                                              'searchreplace visualblocks code fullscreen',
                                              'insertdatetime media table paste code help ',
                                            ],
                                            toolbar: 'undo redo | styleselect | fontsizeselect | backcolor | bold italic underline|  bullist numlist | outdent indent',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;} ',
                                          }}
                                          value={item.sendEmailData !== undefined ? item.sendEmailData.body : ''}
                                          onEditorChange={(content: string): void => { handleSendEmailChange(content, item); }}
                                        />
                                      </div>
                                      <IconButton className='merge-tag-div' onClick={(event: React.MouseEvent<HTMLButtonElement>): void => { setMergeTagAnchorEl(event.currentTarget); setMergeFieldType('body'); }}>
                                        <MergeTagIcon />
                                      </IconButton>
                                    </div>
                                    <StyledMenu
                                      id='job-menu'
                                      elevation={0}
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                      }}
                                      anchorEl={mergeTagAnchorEl}
                                      keepMounted
                                      open={Boolean(mergeTagAnchorEl)}
                                      onClose={(): void => { setMergeTagAnchorEl(null); }}
                                      PaperProps={{
                                        style: {
                                          borderRadius: 8,
                                          boxShadow: '0px 8px 10px 1px rgba(97, 97, 97, 0.14), 0px 3px 14px 2px rgba(97, 97, 97, 0.12), 0px 5px 5px -3px rgba(97, 97, 97, 0.2)',
                                          width: 322,
                                          padding: '0 0 8 0',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'flex-start',
                                        },
                                      }}
                                    >
                                      {renderMergeTagList(mergeFieldType, item, data, setData, focusedTask, setAddChanges)}
                                    </StyledMenu>
                                  </div>
                                  <div className='send-email-div'>
                                    <EmailIcon />
                                    <p>Send email</p>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.type === 'subTask' && item !== undefined && item.subTasks !== undefined ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div className='sub-task-wrapper'>
                                  <div>
                                    {item.subTasks.map((subtask, indx) => (
                                      <div className='all-required-div'>
                                        <h6>{indx + 1}</h6>
                                        <Checkbox
                                          sx={{
                                            fill: 'rgba(33, 33, 33, 0.6);',
                                            '&.Mui-checked': {
                                              fill: '#00CFA1',
                                            },
                                          }}
                                        />
                                        {(showSubtaskInputIndex === indx) && (formItemkey === item.unique_position_key)
                                          ? (
                                            <ClickAwayListener onClickAway={(): void => { setShowSubtaskInputIndex(-1); setFormItemkey(''); }}>
                                              <div className='subtask-input'>
                                                <InputField
                                                  name='name'
                                                  placeholder='Type here or press enter to add another subtask'
                                                  type='text'
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSubTaskInputChange(e.target.value, item, subtask); }}
                                                  value={subtask.value}
                                                  autoFocus
                                                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      addNewSubTask(item, indx);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </ClickAwayListener>
                                          )
                                          : (
                                            <div className='subtask-value' aria-hidden='true' onClick={(): void => { setShowSubtaskInputIndex(indx); setFormItemkey(item.unique_position_key); }}>
                                              {subtask.value
                                                ? <div className='subtask-item-value'>{subtask.value}</div>
                                                : <div className='subtask-default-value'>Type here or press enter to add another subtask</div>}
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className='all-required-div'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span> Required (All subtasks)</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'shortText' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='Something will be typed here...'
                                      type='text'
                                      value=''
                                    />
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'longText' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='Something will be typed here...'
                                      type='text'
                                      value=''
                                      multiline
                                      rows={2}
                                    />
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'email' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='User will be able to type something here...'
                                      type='text'
                                      value=''
                                      startAdornment={<EmailIcon />}
                                    />
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'dropdown' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='An option will be selected from this list:'
                                      type='text'
                                      error={false}
                                      value=''
                                      endAdornment={<ArrowDropDownIcon />}
                                    />
                                  </div>
                                  <div className='form-options-div'>
                                    {item?.options?.map((option, indx) => (
                                      <div className='options-wrap'>
                                        <p className='option-index'>{indx + 1}</p>
                                        {showDropdownInputIndex === indx && (formItemkey === item.unique_position_key)
                                          ? (
                                            <ClickAwayListener onClickAway={(): void => { setShowDropdownInputIndex(-1); setFormItemkey(''); }}>
                                              <div className='option-input'>
                                                <InputField
                                                  name='name'
                                                  placeholder='Type here or press enter to add another option'
                                                  type='text'
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleOption(e.target.value, item, option); }}
                                                  value={option.label}
                                                  autoFocus
                                                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      addNewOption(item, indx);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </ClickAwayListener>
                                          )
                                          : (
                                            <div
                                              className='option-value-div'
                                              style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'cemter', width: '100%', margin: '5px 0px',
                                              }}
                                              aria-hidden='true'
                                              onClick={(): void => { setShowDropdownInputIndex(indx); setFormItemkey(item.unique_position_key); }}
                                            >
                                              {option.label
                                                ? <div className='option-value'>{option.label}</div>
                                                : <div className='option-default-value'>Type here or press enter to add another option</div>}
                                              <div className='option-item-close' aria-hidden='true' onClick={(): void => { removeOption(item, indx); }}><CloseIcon /></div>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'radio' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-options-div'>
                                    {item?.options?.map((option, indx) => (
                                      <div className='options-wrap'>
                                        <p className='option-index'><RadioButtonUncheckedIcon /></p>
                                        {showRadioInputIndex === indx && (formItemkey === item.unique_position_key)
                                          ? (
                                            <ClickAwayListener onClickAway={(): void => { setShowRadioInputIndex(-1); setFormItemkey(''); }}>
                                              <div className='option-input'>
                                                <InputField
                                                  name='name'
                                                  placeholder='Type here or press enter to add another option'
                                                  type='text'
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleOption(e.target.value, item, option); }}
                                                  value={option.label}
                                                  autoFocus
                                                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      addNewOption(item, indx);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </ClickAwayListener>
                                          )
                                          : (
                                            <div
                                              className='option-value-div'
                                              style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'cemter', width: '100%', margin: '5px 0px',
                                              }}
                                              aria-hidden='true'
                                              onClick={(): void => { setShowRadioInputIndex(indx); setFormItemkey(item.unique_position_key); }}
                                            >
                                              {option.label
                                                ? <div className='option-value'>{option.label}</div>
                                                : <div className='option-default-value'>Type here or press enter to add another radio button</div>}
                                              <div className='option-item-close' aria-hidden='true' onClick={(): void => { removeOption(item, indx); }}><CloseIcon /></div>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'multiChoice' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='Multiple options can be selected from this list:'
                                      type='text'
                                      error={false}
                                      value=''
                                      endAdornment={<ArrowDropDownIcon />}
                                    />
                                  </div>
                                  <div className='form-options-div'>
                                    {item?.options?.map((option, indx) => (
                                      <div className='options-wrap'>
                                        <p className='option-index'>{indx + 1}</p>
                                        {showMultichoiceInputIndex === indx && (formItemkey === item.unique_position_key)
                                          ? (
                                            <ClickAwayListener onClickAway={(): void => { setShowMultichoiceInputIndex(-1); setFormItemkey(''); }}>
                                              <div className='option-input'>
                                                <InputField
                                                  name='name'
                                                  placeholder='Type here or press enter to add another option'
                                                  type='text'
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleOption(e.target.value, item, option); }}
                                                  value={option.label}
                                                  autoFocus
                                                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      addNewOption(item, indx);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </ClickAwayListener>
                                          )
                                          : (
                                            <div
                                              className='option-value-div'
                                              style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'cemter', width: '100%', margin: '5px 0px',
                                              }}
                                              aria-hidden='true'
                                              onClick={(): void => { setShowMultichoiceInputIndex(indx); setFormItemkey(item.unique_position_key); }}
                                            >
                                              {option.label
                                                ? <div className='option-value'>{option.label}</div>
                                                : <div className='option-default-value'>Type here or press enter to add another option</div>}
                                              <div className='option-item-close' aria-hidden='true' onClick={(): void => { removeOption(item, indx); }}><CloseIcon /></div>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'fileUpload' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='file-upload-div'>
                                    <PublishIcon />
                                    <p>File will be uploaded here</p>
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'website' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='e.g., https://www.strada.ai/'
                                      type='text'
                                      error={false}
                                      value=''
                                      startAdornment={<LanguageIcon />}
                                    />
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'date' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='file-upload-div'>
                                    <DateRangeIcon />
                                    <p>Date will be set here</p>
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : item.form_type === 'numbers' ? (
                            <div className='task-form-item'>
                              <div className='editor-wrapper'>
                                <div className='swap-up-down-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithUpperContent(index); }}><KeyboardArrowUpIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { swapWithLowerContent(index); }}><KeyboardArrowDownIcon /></div>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <div className='form-input-wrap'>
                                    <InputField
                                      id='label'
                                      name='name'
                                      placeholder='Type Label here'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleFormLabelChange(e.target.value, item); }}
                                      value={item.label}
                                      required
                                    />
                                  </div>
                                  <div className='form-disabled-input-wrap'>
                                    <InputField
                                      id='value'
                                      name='name'
                                      placeholder='Numbers will be typed here...'
                                      type='text'
                                      value=''
                                    />
                                  </div>
                                  <div className='form-is-required'>
                                    <Checkbox
                                      checked={item.is_required}
                                      sx={{
                                        fill: 'rgba(33, 33, 33, 0.6);',
                                        '&.Mui-checked': {
                                          fill: '#00CFA1',
                                        },
                                      }}
                                      onChange={(): void => { handleIsRequiredCheckbox(item); }}
                                    />
                                    <span>Required</span>
                                  </div>
                                </div>
                                <div className='delete-duplicate-wrapper'>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { setSelectedContentItem(item); setOpenDeleteContentBlock(true); }}><DeleteIcon /></div>
                                  <div className='delete-div' aria-hidden='true' onClick={(): void => { duplicateContentItem(item); }}><FileCopyIcon /></div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className='checklist-task-no-content'>
          Click the buttons on the right to add content
        </div>
      )}
      <Dialog
        open={openDeleteContentBlock}
        onClose={(): void => {
          setOpenDeleteContentBlock(false);
        }}
      >
        <DialogContent style={{ width: 400, padding: '24px' }}>
          <div className='dialog-heading'>Delete this content block??</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            This content block will be deleted.
          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpenDeleteContentBlock(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={(): void => { deleteTaskItem(selectedContentItem); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
