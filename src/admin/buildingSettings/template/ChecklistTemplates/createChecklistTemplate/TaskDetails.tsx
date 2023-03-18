/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import React, { useState } from 'react';
import {
  Grid, Popover, Avatar, Checkbox, Button,
} from '@mui/material';
import SelectInput from 'shared-components/inputs/SelectInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import AvatarGroup from '@mui/material/AvatarGroup';
import type { RootState } from 'mainStore';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import InputField from 'shared-components/inputs/InputField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmailIcon from '@mui/icons-material/Email';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SubjectIcon from '@mui/icons-material/Subject';
import LanguageIcon from '@mui/icons-material/Language';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RenderTaskContent from './RenderTaskContent';
import type {
  ITasks, Iassignee, IPeopleResponse, Iresult,
} from './types';

interface ITaskDetailsProps {
  data: ITasks[] | undefined;
  setData: (value: ITasks[]) => void;
  focusedTask: ITasks | undefined;
  showContent: boolean;
  setShowContent: (value: boolean) => void;
  closeContent: boolean;
  setCloseContent: (value: boolean) => void;
  setAddChanges: (value: boolean) => void;
}
const useStyles = makeStyles({
  select_design: {
    '&. MuiSelect-select': {
      marginTop: '2px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // borderStyle: 'none',
    },
  },
});
function SideMenuClose(): JSX.Element {
  return (
    <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function HandIcon(): JSX.Element {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17.2617 4.11328V15.0117C17.2617 15.832 16.957 16.5352 16.3477 17.1211C15.7617 17.707 15.0586 18 14.2383 18H8.78906C7.94531 18 7.23047 17.707 6.64453 17.1211L0.738281 11.1094C1.37109 10.5 1.69922 10.1953 1.72266 10.1953C1.88672 10.0547 2.08594 9.98438 2.32031 9.98438C2.48438 9.98438 2.63672 10.0195 2.77734 10.0898L6.01172 11.918V2.98828C6.01172 2.68359 6.11719 2.42578 6.32812 2.21484C6.5625 1.98047 6.83203 1.86328 7.13672 1.86328C7.44141 1.86328 7.69922 1.98047 7.91016 2.21484C8.14453 2.42578 8.26172 2.68359 8.26172 2.98828V8.26172H9V1.125C9 0.796875 9.10547 0.527344 9.31641 0.316406C9.52734 0.105469 9.79688 0 10.125 0C10.4531 0 10.7227 0.105469 10.9336 0.316406C11.1445 0.527344 11.25 0.796875 11.25 1.125V8.26172H11.9883V1.86328C11.9883 1.55859 12.0938 1.30078 12.3047 1.08984C12.5391 0.855469 12.8086 0.738281 13.1133 0.738281C13.418 0.738281 13.6758 0.855469 13.8867 1.08984C14.1211 1.30078 14.2383 1.55859 14.2383 1.86328V8.26172H15.0117V4.11328C15.0117 3.80859 15.1172 3.55078 15.3281 3.33984C15.5625 3.10547 15.832 2.98828 16.1367 2.98828C16.4414 2.98828 16.6992 3.10547 16.9102 3.33984C17.1445 3.55078 17.2617 3.80859 17.2617 4.11328Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function HandStopIcon(): JSX.Element {
  return (
    <svg width='15' height='17' viewBox='0 0 15 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M8.73828 7.62891L6.875 5.76562V1.6875C6.875 1.42969 6.96875 1.20703 7.15625 1.01953C7.34375 0.832031 7.56641 0.738281 7.82422 0.738281C8.08203 0.738281 8.29297 0.832031 8.45703 1.01953C8.64453 1.20703 8.73828 1.42969 8.73828 1.6875V7.62891ZM14.0117 9.5625V8.26172V3.9375C14.0117 3.67969 13.918 3.45703 13.7305 3.26953C13.543 3.08203 13.3203 2.98828 13.0625 2.98828C12.8047 2.98828 12.582 3.08203 12.3945 3.26953C12.207 3.45703 12.1133 3.67969 12.1133 3.9375V8.26172H11.375V2.42578C11.375 2.16797 11.2812 1.95703 11.0938 1.79297C10.9062 1.60547 10.6836 1.51172 10.4258 1.51172C10.168 1.51172 9.94531 1.60547 9.75781 1.79297C9.59375 1.95703 9.51172 2.16797 9.51172 2.42578V8.36719L14.0117 12.8672V9.5625ZM6.13672 3.19922C6.13672 2.94141 6.04297 2.71875 5.85547 2.53125C5.66797 2.34375 5.44531 2.25 5.1875 2.25C4.92969 2.25 4.70703 2.34375 4.51953 2.53125C4.35547 2.69531 4.27344 2.89453 4.27344 3.12891L6.13672 4.99219V3.19922ZM8.73828 7.62891L6.875 5.76562V1.6875C6.875 1.42969 6.96875 1.20703 7.15625 1.01953C7.34375 0.832031 7.56641 0.738281 7.82422 0.738281C8.08203 0.738281 8.29297 0.832031 8.45703 1.01953C8.64453 1.20703 8.73828 1.42969 8.73828 1.6875V7.62891ZM14.0117 9.5625V8.26172V3.9375C14.0117 3.67969 13.918 3.45703 13.7305 3.26953C13.543 3.08203 13.3203 2.98828 13.0625 2.98828C12.8047 2.98828 12.582 3.08203 12.3945 3.26953C12.207 3.45703 12.1133 3.67969 12.1133 3.9375V8.26172H11.375V2.42578C11.375 2.16797 11.2812 1.95703 11.0938 1.79297C10.9062 1.60547 10.6836 1.51172 10.4258 1.51172C10.168 1.51172 9.94531 1.60547 9.75781 1.79297C9.59375 1.95703 9.51172 2.16797 9.51172 2.42578V8.36719L14.0117 12.8672V9.5625ZM6.13672 3.19922C6.13672 2.94141 6.04297 2.71875 5.85547 2.53125C5.66797 2.34375 5.44531 2.25 5.1875 2.25C4.92969 2.25 4.70703 2.34375 4.51953 2.53125C4.35547 2.69531 4.27344 2.89453 4.27344 3.12891L6.13672 4.99219V3.19922ZM14.8906 15.8906L1.10938 2.10938L0.0546875 3.16406L4.27344 7.38281H4.23828V10.582C3.95703 10.4414 3.66406 10.2891 3.35938 10.125C3.07812 9.9375 2.83203 9.78516 2.62109 9.66797C2.41016 9.55078 2.30469 9.49219 2.30469 9.49219C2.16406 9.42188 2.02344 9.38672 1.88281 9.38672C1.69531 9.38672 1.51953 9.44531 1.35547 9.5625C1.35547 9.58594 1.30859 9.64453 1.21484 9.73828C1.14453 9.80859 1.05078 9.90234 0.933594 10.0195C0.816406 10.1133 0.710938 10.207 0.617188 10.3008C0.546875 10.3711 0.511719 10.4062 0.511719 10.4062L5.60938 15.7852C6.05469 16.2539 6.59375 16.4883 7.22656 16.4883H11.7617C12.207 16.4883 12.6172 16.3594 12.9922 16.1016H12.957L13.8359 16.9453L14.8906 15.8906Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function FormDropdownIcon(): JSX.Element {
  return (
    <svg width='24' height='20' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path fillRule='evenodd' clipRule='evenodd' d='M15.043 2.45703C14.7383 2.15234 14.3867 2 13.9883 2H3.51172C3.11328 2 2.76172 2.15234 2.45703 2.45703C2.15234 2.76172 2 3.11328 2 3.51172V13.9883C2 14.3867 2.15234 14.7383 2.45703 15.043C2.76172 15.3477 3.11328 15.5 3.51172 15.5H13.9883C14.3867 15.5 14.7383 15.3477 15.043 15.043C15.3477 14.7383 15.5 14.3867 15.5 13.9883V3.51172C15.5 3.11328 15.3477 2.76172 15.043 2.45703ZM3.51172 3.51172H13.9883V13.9883H3.51172V3.51172ZM12.7 7.9375L11.7625 7L8.7 10.0625L5.6375 7L4.7 7.9375L8.7 11.9375L12.7 7.9375Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function FormRadioIcon(): JSX.Element {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M3.74609 12.2539C4.94141 13.4258 6.35938 14.0117 8 14.0117C9.64062 14.0117 11.0469 13.4258 12.2188 12.2539C13.4141 11.0586 14.0117 9.64062 14.0117 8C14.0117 6.35937 13.4141 4.95312 12.2188 3.78125C11.0469 2.58594 9.64062 1.98828 8 1.98828C6.35938 1.98828 4.94141 2.58594 3.74609 3.78125C2.57422 4.95312 1.98828 6.35937 1.98828 8C1.98828 9.64062 2.57422 11.0586 3.74609 12.2539ZM2.69141 2.72656C4.16797 1.25 5.9375 0.511719 8 0.511719C10.0625 0.511719 11.8203 1.25 13.2734 2.72656C14.75 4.17969 15.4883 5.9375 15.4883 8C15.4883 10.0625 14.75 11.832 13.2734 13.3086C11.8203 14.7617 10.0625 15.4883 8 15.4883C5.9375 15.4883 4.16797 14.7617 2.69141 13.3086C1.23828 11.832 0.511719 10.0625 0.511719 8C0.511719 5.9375 1.23828 4.17969 2.69141 2.72656ZM5.32812 5.36328C6.07812 4.61328 6.96875 4.23828 8 4.23828C9.03125 4.23828 9.91016 4.61328 10.6367 5.36328C11.3867 6.08984 11.7617 6.96875 11.7617 8C11.7617 9.03125 11.3867 9.92188 10.6367 10.6719C9.91016 11.3984 9.03125 11.7617 8 11.7617C6.96875 11.7617 6.07812 11.3984 5.32812 10.6719C4.60156 9.92188 4.23828 9.03125 4.23828 8C4.23828 6.96875 4.60156 6.08984 5.32812 5.36328Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function FormMultichoiceIcon(): JSX.Element {
  return (
    <svg width='24' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.4805 0.265625L14.7344 4.51953L10.4805 8.73828H13.75V14.75H7.73828V8.73828H10.4805L6.26172 4.51953V7.26172H0.25V1.25H6.26172V4.51953L10.4805 0.265625ZM0.25 14.75V8.73828H6.26172V14.75H0.25Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function FormFileUploadIcon(): JSX.Element {
  return (
    <svg width='24' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4.01172 10.25L7 7.26172L9.98828 10.25L8.93359 11.3398L7.73828 10.1445V13.2383H6.26172V10.1445L5.06641 11.3047L4.01172 10.25ZM11.5 14.0117V5.75H7.73828V1.98828H2.5V14.0117H11.5ZM8.51172 0.511719L13.0117 5.01172V14.0117C13.0117 14.4102 12.8594 14.7617 12.5547 15.0664C12.25 15.3477 11.8984 15.4883 11.5 15.4883H2.5C2.10156 15.4883 1.75 15.3477 1.44531 15.0664C1.14062 14.7617 0.988281 14.4102 0.988281 14.0117L1.02344 1.98828C1.02344 1.58984 1.16406 1.25 1.44531 0.96875C1.75 0.664062 2.10156 0.511719 2.5 0.511719H8.51172Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function FormNumberIcon(): JSX.Element {
  return (
    <svg width='24' height='14' viewBox='0 0 16 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14.0117 0.988281H1.98828C1.58984 0.988281 1.23828 1.14062 0.933594 1.44531C0.652344 1.72656 0.511719 2.07812 0.511719 2.5V11.5C0.511719 11.9219 0.652344 12.2852 0.933594 12.5898C1.23828 12.8711 1.58984 13.0117 1.98828 13.0117H14.0117C14.4102 13.0117 14.75 12.8711 15.0312 12.5898C15.3359 12.2852 15.4883 11.9219 15.4883 11.5V2.5C15.4883 2.07812 15.3359 1.72656 15.0312 1.44531C14.75 1.14062 14.4102 0.988281 14.0117 0.988281ZM4.73047 9.25H3.85156V5.875L3.18359 6.36719L2.76172 5.69922L4.0625 4.75H4.73047V9.25ZM9.125 9.25H6.20703V8.47656C6.60547 8.07812 6.93359 7.75 7.19141 7.49219C7.47266 7.21094 7.67188 7 7.78906 6.85938C8.07031 6.57812 8.21094 6.32031 8.21094 6.08594C8.21094 5.92187 8.15234 5.79297 8.03516 5.69922C7.94141 5.58203 7.80078 5.52344 7.61328 5.52344C7.40234 5.52344 7.23828 5.58203 7.12109 5.69922C7.02734 5.81641 6.95703 5.94531 6.91016 6.08594L6.17188 5.76953C6.17188 5.74609 6.21875 5.64062 6.3125 5.45312C6.40625 5.24219 6.60547 5.05469 6.91016 4.89062C7.16797 4.77344 7.42578 4.72656 7.68359 4.75C7.96484 4.77344 8.19922 4.83203 8.38672 4.92578C8.71484 5.08984 8.90234 5.30078 8.94922 5.55859C9.01953 5.79297 9.05469 5.94531 9.05469 6.01562C9.05469 6.50781 8.83203 6.97656 8.38672 7.42188C8.29297 7.51562 8.15234 7.65625 7.96484 7.84375C7.80078 8.00781 7.58984 8.21875 7.33203 8.47656V8.51172H9.125V9.25ZM13.0625 8.61719C13.0391 8.64062 12.9805 8.71094 12.8867 8.82812C12.793 8.92188 12.6523 9.01562 12.4648 9.10938C12.2773 9.20312 12.0312 9.25 11.7266 9.25C11.7266 9.25 11.6562 9.25 11.5156 9.25C11.3984 9.22656 11.2461 9.19141 11.0586 9.14453C10.8945 9.07422 10.7305 8.96875 10.5664 8.82812C10.4023 8.66406 10.2852 8.42969 10.2148 8.125L10.9883 7.80859C10.9883 7.83203 11 7.90234 11.0234 8.01953C11.0703 8.11328 11.1523 8.20703 11.2695 8.30078C11.3867 8.39453 11.5391 8.44141 11.7266 8.44141C11.8906 8.44141 12.043 8.39453 12.1836 8.30078C12.3242 8.20703 12.3945 8.06641 12.3945 7.87891C12.3945 7.66797 12.3125 7.51562 12.1484 7.42188C12.0078 7.32812 11.832 7.28125 11.6211 7.28125H11.2695V6.54297H11.5859C11.7266 6.54297 11.8672 6.50781 12.0078 6.4375C12.1719 6.36719 12.2539 6.21484 12.2539 5.98047C12.2539 5.83984 12.1953 5.73438 12.0781 5.66406C11.9844 5.57031 11.8555 5.52344 11.6914 5.52344C11.5039 5.52344 11.3633 5.57031 11.2695 5.66406C11.1758 5.75781 11.1055 5.86328 11.0586 5.98047L10.3203 5.66406C10.3438 5.59375 10.4023 5.48828 10.4961 5.34766C10.5898 5.18359 10.7305 5.04297 10.918 4.92578C11.1289 4.80859 11.3867 4.75 11.6914 4.75C12.1133 4.75 12.418 4.83203 12.6055 4.99609C12.793 5.16016 12.8984 5.26563 12.9219 5.3125C13.0391 5.5 13.0977 5.71094 13.0977 5.94531C13.0977 6.15625 13.0391 6.33203 12.9219 6.47266C12.8281 6.66016 12.6992 6.78906 12.5352 6.85938V6.89453C12.7461 6.98828 12.9219 7.11719 13.0625 7.28125C13.2031 7.49219 13.2617 7.72656 13.2383 7.98438C13.2383 8.21875 13.1797 8.42969 13.0625 8.61719Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function TaskDetails(props: ITaskDetailsProps): JSX.Element {
  const {
    data, setData, focusedTask, showContent, setShowContent, closeContent, setCloseContent, setAddChanges,
  } = props;
  const classes = useStyles();
  const [assigneePopupAncherEl, setAssigneePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [selectedAssigneeAncherEl, setSelectedAssigneeAncherEl] = useState<HTMLDivElement | null>(null);
  const [dueDatePopupAncherEl, setDueDatePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState<string>('');
  const [assignee, setAssignee] = useState<Iassignee[]>();
  const [closeForm, setCloseForm] = useState<boolean>(false);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  useQuery(
    'property-managers-people',
    async () => axios({
      url: `api/filter/assignee/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<IPeopleResponse>) => res.data.detail,
      onSuccess: (res: Iresult[]) => {
        const newAssignee: Iassignee[] = [];
        res.forEach((user: Iresult) => {
          const userData = {
            id: user.id,
            name: user.name,
            avatar: `${process.env.REACT_APP_IMAGE_URL}${user.avatar}`,
            email: user.email,

          };
          newAssignee.push(userData);
        });
        setAssignee(newAssignee);
      },
      enabled: currentWorkspace.id !== 0,
    },
  );
  function AddAssignee(assigneeItem: Iassignee): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = assigneeItem;
      const index = data.findIndex((task) => task.unique_position_key === focusedTask.unique_position_key);
      const newData = [...data];
      const check = data[index].assignees.find((val) => val.id === assigneeItem.id);
      if (!check) {
        newData[index].assignees.push(obj);
        setData(newData);
        setAddChanges(true);
      }
    }
  }
  function RemoveAssignee(assigneeItem: Iassignee): void {
    if (data !== undefined && focusedTask !== undefined) {
      const index = data.findIndex((task) => task.unique_position_key === focusedTask.unique_position_key);
      const newData = [...data];
      const removeIndex = data[index].assignees.findIndex((val: Iassignee) => val.id === assigneeItem.id);
      newData[index].assignees.splice(removeIndex, 1);
      if (newData[index].assignees.length === 0) {
        setSelectedAssigneeAncherEl(null);
      }
      setData(newData);
      setAddChanges(true);
    }
  }
  function RenderDueValue(): string {
    if (data !== undefined && focusedTask !== undefined) {
      if (focusedTask.due_months !== 0) {
        return `${focusedTask.due_months} months...`;
      }
      if (focusedTask.due_days !== 0) {
        return `${focusedTask.due_days} days...`;
      }
      if (focusedTask.due_hours !== 0) {
        return `${focusedTask.due_hours} hours...`;
      }
      if (focusedTask.due_minutes !== 0) {
        return `${focusedTask.due_minutes} minutes...`;
      }
    }
    return '';
  }
  function handleDueDateInputs(value: number, format: string): void {
    if (data !== undefined && focusedTask !== undefined) {
      const newValue = Number(value.toString().replace(/^0+/, ''));
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          if (format === 'month') {
            if (newValue > 0 && newValue < 12) {
              task.due_months = newValue;
            } else {
              task.due_months = 0;
            }
          } else if (format === 'days') {
            if (newValue > 0 && newValue < 31) {
              task.due_days = newValue;
            } else {
              task.due_days = 0;
            }
          } else if (format === 'hours') {
            if (newValue > 0 && newValue < 24) {
              task.due_hours = newValue;
            } else {
              task.due_hours = 0;
            }
          } else if (format === 'minutes') {
            if (newValue > 0 && newValue < 60) {
              task.due_minutes = newValue;
            } else {
              task.due_minutes = 0;
            }
          }
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleDueDateWeekdaysOnly(weekdaysonly: boolean | undefined): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key && weekdaysonly !== undefined) {
          task.due_is_weekday_only = !weekdaysonly;
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleDueDateAfterBefore(obj: SelectChangeEvent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.due_is_after = JSON.parse(obj.target.value);
          task.due_rule = null;
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleDueDateChooseRule(obj: SelectChangeEvent): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.due_rule = JSON.parse(obj.target.value);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function handleSaveorCloseDueDate(isSave: boolean): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          if (isSave) {
            task.isDueDateSave = true;
          } else {
            task.due_months = 0;
            task.due_days = 0;
            task.due_hours = 0;
            task.due_minutes = 0;
            task.due_is_weekday_only = false;
            task.due_is_after = true;
            task.due_rule = null;
          }
        }
        return task;
      }));
      setAddChanges(true);
      setDueDatePopupAncherEl(null);
    }
  }
  function AddorRemoveStop(stopValue: boolean): void {
    if (data !== undefined && focusedTask !== undefined) {
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.is_stop = stopValue;
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addText(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'text',
        value: '',
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addFile(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'file',
        files: {
          file: '',
          file_name: '',
        },
        description: '',
        is_new: false,
        is_duplicate: false,
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addSendEmail(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'sendEmail',
        sendEmailData: {
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          body: '',
        },
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addSubTask(): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'subTask',
        subTasks: [
          {
            unique_position_key: `${Date.now().toString()}1`,
            isTrue: false,
            value: '',
          },
          {
            unique_position_key: `${Date.now().toString()}2`,
            isTrue: false,
            value: '',
          },
          {
            unique_position_key: `${Date.now().toString()}3`,
            isTrue: false,
            value: '',
          },
        ],
        is_required: false,
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addForm(formType: string): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'form',
        form_type: formType,
        label: '',
        label_key: '',
        is_required: false,
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }
  function addDropdownMulitchoiceForm(formType: string): void {
    if (data !== undefined && focusedTask !== undefined) {
      const obj = {
        unique_position_key: Date.now().toString(),
        type: 'form',
        form_type: formType,
        label: '',
        label_key: '',
        is_required: false,
        options: [
          {
            unique_position_key: `${Date.now().toString()}1`,
            label: '',
          },
          {
            unique_position_key: `${Date.now().toString()}2`,
            label: '',
          },
          {
            unique_position_key: `${Date.now().toString()}3`,
            label: '',
          },
        ],
      };
      setData(data.map((task: ITasks) => {
        if (task.unique_position_key === focusedTask.unique_position_key) {
          task.content.push(obj);
        }
        return task;
      }));
      setAddChanges(true);
    }
  }

  const lowercasedFilter = assigneeSearch.toLowerCase();// || key === 'email'
  const filteredData = assignee !== undefined ? assignee.filter((item: Iassignee) => Object.keys(item).some((key) => (key === 'name') && item[key].toString().toLowerCase().includes(lowercasedFilter))) : null;
  return (
    <>
      <Grid item sm={showContent ? 6 : 7}>
        <div className='middle-grid-wrapper'>
          {!showContent
            ? (
              <div className='side-bar-div cursor-pointer' aria-hidden='true' onClick={(): void => { setShowContent(true); }}>
                <div className='content-wrap-flex-div'>
                  <div><AddIcon /></div>
                  <h6>Content</h6>
                </div>
              </div>
            ) : (
              <div className='side-bar-div-cross cursor-pointer' aria-hidden='true' onClick={(): void => { setShowContent(false); }}>
                <SideMenuClose />
              </div>
            )}
          <div className='task-name-div'>
            <p className={`task-name-${focusedTask !== undefined && focusedTask.name !== undefined && focusedTask.name !== null && focusedTask.name.length > 100 ? 'long-p' : 'p'}`}>{ focusedTask !== undefined && focusedTask.name !== undefined && focusedTask.name}</p>
          </div>
          { focusedTask !== undefined && !focusedTask.is_heading
            && (
              <div className='assign-duedate-div'>
                <div>
                  <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(event: React.MouseEvent<HTMLDivElement>): void => { setAssigneePopupAncherEl(event.currentTarget); }}>
                    <PersonIcon />
                    <p>Assign</p>
                  </div>
                  <Popover
                    open={Boolean(assigneePopupAncherEl)}
                    anchorEl={assigneePopupAncherEl}
                    onClose={(): void => { setAssigneePopupAncherEl(null); }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <div className='assignee-popup-wrapper'>
                      <div style={{ width: '100%' }}>
                        <InputField
                          name='name'
                          type='text'
                          placeholder='Enter name or email'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setAssigneeSearch(e.target.value); }}
                          value={assigneeSearch}
                          error={false}
                        />
                      </div>
                      <div>
                        {filteredData !== null ? filteredData.map((item) => (
                          <div className='assignee-inner-div' aria-hidden='true' onClick={(): void => { AddAssignee(item); }}>
                            <Avatar alt={item.name} src={item.avatar} />
                            <div className='assignee-nameEmail-div'>
                              <span className='name'>{item.name}</span>
                              <span className='email'>{item.email}</span>
                            </div>
                          </div>
                        )) : null}
                      </div>
                    </div>
                  </Popover>
                </div>
                {(focusedTask.assignees.length > 0)
                && (
                  <div>
                    <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(event: React.MouseEvent<HTMLDivElement>): void => { setSelectedAssigneeAncherEl(event.currentTarget); }}>
                      <AvatarGroup max={0}>
                        {focusedTask.assignees.map((item) => (
                          <Avatar alt={item.name} src={item.avatar} />
                        ))}
                      </AvatarGroup>
                    </div>
                    <Popover
                      open={Boolean(selectedAssigneeAncherEl)}
                      anchorEl={selectedAssigneeAncherEl}
                      onClose={(): void => { setSelectedAssigneeAncherEl(null); }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <div className='assignee-popup-wrapper'>
                        <div className='selected-assignee-div'>
                          <span className='heading'>Assignees</span>
                          <div className='cursor-pointer' aria-hidden='true' onClick={(): void => { setSelectedAssigneeAncherEl(null); }}><CloseIcon /></div>
                        </div>
                        <div>
                          {focusedTask.assignees.map((item) => (
                            <div className='assignee-inner-div'>
                              <Avatar alt={item.name} src={item.avatar} />
                              <div className='assignee-nameEmail-div'>
                                <span className='name'>{item.name}</span>
                                <span className='email'>{item.email}</span>
                              </div>
                              <div className='cursor-pointer' style={{ marginLeft: 'auto' }} aria-hidden='true' onClick={(): void => { RemoveAssignee(item); }}><PersonRemoveIcon /></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popover>
                  </div>
                )}
                <div>
                  <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(event: React.MouseEvent<HTMLDivElement>): void => { setDueDatePopupAncherEl(event.currentTarget); }}>
                    <AccessTimeIcon />
                    <p>
                      Due
                      {' '}
                      {RenderDueValue()}
                    </p>
                  </div>
                  <Popover
                    open={Boolean(dueDatePopupAncherEl)}
                    anchorEl={dueDatePopupAncherEl}
                    onClose={(): void => { handleSaveorCloseDueDate(false); }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <div className='duedate-popup-wrapper'>
                      <div className='duedate-heading-div'>
                        <span className='heading'>Dynamic Due Date</span>
                        <div className='cursor-pointer' aria-hidden='true' onClick={(): void => { handleSaveorCloseDueDate(false); }}><CloseIcon /></div>
                      </div>
                      <span className='subheading'>This task will be due:</span>
                      <div className='dates-input-wrapper'>
                        <div className='input-div'>
                          <InputField
                            name='name'
                            type='number'
                            placeholder='0'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleDueDateInputs(Number(e.target.value), 'month'); }}
                            value={focusedTask.due_months !== 0 && focusedTask.due_months}
                            error={false}
                          />
                          <span className='input-label'>months</span>
                        </div>
                        <div className='input-div'>
                          <InputField
                            name='name'
                            type='number'
                            placeholder='0'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleDueDateInputs(Number(e.target.value), 'days'); }}
                            value={focusedTask.due_days !== 0 && focusedTask.due_days}
                            error={false}
                          />
                          <span className='input-label'>days</span>
                        </div>
                        <div className='input-div'>
                          <InputField
                            name='name'
                            type='number'
                            placeholder='0'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleDueDateInputs(Number(e.target.value), 'hours'); }}
                            value={focusedTask.due_hours !== 0 && focusedTask.due_hours}
                            error={false}
                          />
                          <span className='input-label'>hours</span>
                        </div>
                        <div className='input-div'>
                          <InputField
                            name='name'
                            type='number'
                            placeholder='0'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleDueDateInputs(Number(e.target.value), 'minutes'); }}
                            value={focusedTask.due_minutes !== 0 && focusedTask.due_minutes}
                            error={false}
                          />
                          <span className='input-label'>minutes</span>
                        </div>
                      </div>
                      <div className='form-is-required' style={{ paddingLeft: '5px' }}>
                        <Checkbox
                          checked={focusedTask.due_is_weekday_only}
                          color='primary'
                          onChange={(): void => {
                            handleDueDateWeekdaysOnly(focusedTask.due_is_weekday_only);
                          }}
                        />
                        <span className='weeekdayaonly-p'>Weekdays only</span>
                      </div>
                      <div className='duedateSelctDiv'>
                        <div className='leftSelctDiv'>
                          <SelectInput
                            value={JSON.stringify(focusedTask.due_is_after)}
                            name='due_is_after'
                            label='Select...'
                            onChange={(obj): void => { handleDueDateAfterBefore(obj); }}
                            options={[{ name: 'after', value: 'true' }, { name: 'before', value: 'false' }]}
                            defaultValue='true'
                            showPleaseSelect={false}
                            className={classes.select_design}
                          />
                        </div>
                        <div className='rightSelctDiv'>
                          <SelectInput
                            value={focusedTask.due_rule !== null ? JSON.stringify(focusedTask.due_rule) : ''}
                            name='due_is_after'
                            label='Choose rule'
                            onChange={(obj): void => { handleDueDateChooseRule(obj); }}
                            options={focusedTask.due_is_after === true ? [{ name: 'checklist start date', value: 1 }, { name: 'prior to task checked', value: 2 }]
                              : [{ name: 'checklist due date', value: 3 }]}
                            showPleaseSelect={false}
                            className={classes.select_design}
                          />
                        </div>
                      </div>
                      <div className='dueDatebtndiv'>
                        <Button color='primary' onClick={(): void => { handleSaveorCloseDueDate(false); }} startIcon={<DeleteIcon />} style={{ color: '#00CFA1', textTransform: 'inherit' }}>Remove</Button>
                        <Button className='durdate-save-btn' onClick={(): void => { handleSaveorCloseDueDate(true); }} color='primary' startIcon={<SaveIcon />} style={{ color: '#FFFFFF', textTransform: 'inherit' }} variant='contained'>Save</Button>
                      </div>
                    </div>
                  </Popover>
                </div>
                {focusedTask.is_stop
                  ? (
                    <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(): void => { AddorRemoveStop(false); }}>
                      <HandStopIcon />
                      <p>
                        Remove Stop
                      </p>
                    </div>
                  )
                  : (
                    <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(): void => { AddorRemoveStop(true); }}>
                      <HandIcon />
                      <p>
                        Add Stop
                      </p>
                    </div>
                  )}
              </div>
            )}
          <RenderTaskContent data={data} setData={setData} focusedTask={focusedTask} setAddChanges={setAddChanges} />
        </div>
      </Grid>
      {showContent
         && (
           <Grid item sm={1}>
             <div className='right-grid-wrapper'>
               <div className='content-open-div'>
                 <p>Content</p>
                 {closeContent
                   ? <div aria-hidden='true' onClick={(): void => { setCloseContent(false); }}><KeyboardArrowRightIcon /></div>
                   : <div aria-hidden='true' onClick={(): void => { setCloseContent(true); }}><ExpandMoreIcon /></div>}
               </div>
               {!closeContent && (
                 <>
                   <div className='content-item-div' aria-hidden='true' onClick={(): void => { addText(); }}>
                     <TextFieldsIcon />
                     <p>Text</p>
                   </div>
                   <div className='content-item-div' aria-hidden='true' onClick={(): void => { addFile(); }}>
                     <AttachFileIcon />
                     <p>File</p>
                   </div>
                   <div className='content-item-div' aria-hidden='true' onClick={(): void => { addSendEmail(); }}>
                     <EmailIcon />
                     <p style={{ fontSize: '11px' }}>Send Email</p>
                   </div>
                   <div className='content-item-div' aria-hidden='true' onClick={(): void => { addSubTask(); }}>
                     <ListIcon />
                     <p>Subtasks</p>
                   </div>
                 </>
               )}
               {focusedTask !== undefined && !focusedTask.is_heading && (
                 <>
                   <div className='content-open-div'>
                     <p>Forms</p>
                     {closeForm
                       ? <div aria-hidden='true' onClick={(): void => { setCloseForm(false); }}><KeyboardArrowRightIcon /></div>
                       : <div aria-hidden='true' onClick={(): void => { setCloseForm(true); }}><ExpandMoreIcon /></div>}
                   </div>
                   {!closeForm && (
                     <>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('shortText'); }}>
                         <ShortTextIcon />
                         <p>Short text</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('longText'); }}>
                         <SubjectIcon />
                         <p>Long text</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('email'); }}>
                         <EmailIcon />
                         <p>Email</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addDropdownMulitchoiceForm('dropdown'); }}>
                         <FormDropdownIcon />
                         <p>Dropdown</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addDropdownMulitchoiceForm('radio'); }}>
                         <FormRadioIcon />
                         <p>Radio button</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addDropdownMulitchoiceForm('multiChoice'); }}>
                         <FormMultichoiceIcon />
                         <p>Multi choice</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('fileUpload'); }}>
                         <FormFileUploadIcon />
                         <p>File Upload</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('website'); }}>
                         <LanguageIcon />
                         <p>Website</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('date'); }}>
                         <DateRangeIcon />
                         <p>Date</p>
                       </div>
                       <div className='content-item-div' aria-hidden='true' onClick={(): void => { addForm('numbers'); }}>
                         <FormNumberIcon />
                         <p>Numbers</p>
                       </div>
                     </>
                   )}
                 </>
               )}
             </div>
           </Grid>
         )}
    </>
  );
}
