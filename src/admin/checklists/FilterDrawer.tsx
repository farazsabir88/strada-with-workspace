/* eslint-disable no-nested-ternary */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Drawer from '@mui/material/Drawer';
import moment from 'moment';
import StatusDrawer from './filters/StatusDrawer';
import CustomDrawer from './filters/CustomDrawer';
import DueDateDrawer from './filters/DueDateDrawer';
import TaskCompletedDrawer from './filters/TaskComplatedDrawer';

interface IOptions {
  name: string;
  value: number;
}
interface IAssigneeOptions {
  name: string;
  value: number;
  avatar: string | null;
}

interface IFilterDrawer {
  openFilterDrawer: boolean;
  setOpenFilterDrawer: (status: boolean) => void;
  templates: IOptions[];
  buildings: IOptions[];
  assignees: IAssigneeOptions[];
  setStatusFilter: (status: number[]) => void;
  setBuildingFilter: (building: number[]) => void;
  setTemplateFilter: (template: number[]) => void;
  setAssignees: (assignees: number[]) => void;
  setStartDate: (startDate: Date | undefined) => void;
  setEndDate: (endDate: Date | undefined) => void;
  setTaskCompletedType: (taskCompletedType: string) => void;
  setTaskCompletedValue: (taskCompletedValue: number | undefined) => void;
}

function ArrowForwardIcon(): JSX.Element {
  return (
    <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1.98438 0L7.98438 6L1.98438 12L0.578125 10.5938L5.17188 6L0.578125 1.40625L1.98438 0Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

function FilterDrawer(props: IFilterDrawer, ref: React.Ref<unknown> | undefined): JSX.Element {
  const {
    openFilterDrawer, setOpenFilterDrawer, templates, buildings, assignees, setStatusFilter, setBuildingFilter, setTemplateFilter, setAssignees, setStartDate, setEndDate, setTaskCompletedType, setTaskCompletedValue,
  } = props;

  const [openStatusDrawer, setOpenStatusDrawer] = useState<boolean>(false);
  const [openCustomDrawer, setOpenCustomDrawer] = useState<boolean>(false);
  const [openDueDateDrawer, setOpenDueDateDrawer] = useState<boolean>(false);
  const [openTaskCompletedDrawer, setOpenTaskCompletedDrawer] = useState<boolean>(false);
  const [statusList, setStatusList] = useState<number[]>([]);
  const [buildingList, setBuildingList] = useState<number[]>([]);
  const [templateList, setTemplateList] = useState<number[]>([]);
  const [assigneeList, setAssigneeList] = useState<number[]>([]);
  const [customDrawerName, setCustomDrawerName] = useState<string>('');
  const [drawerStartDate, setDrawerStartDate] = useState<Date | undefined>(undefined);
  const [drawerEndDate, setDrawerEndDate] = useState<Date | undefined>(undefined);
  const [drawerTaskCompletedType, setDrawerTaskCompletedType] = useState<string>('');
  const [drawerTaskCompletedValue, setDrawerTaskCompletedValue] = useState<number | undefined>();

  useImperativeHandle(ref, () => ({
    resetDrawerFilters: (): void => {
      setStatusList([]);
      setBuildingList([]);
      setTemplateList([]);
      setAssigneeList([]);
      setDrawerStartDate(undefined);
      setDrawerEndDate(undefined);
      setDrawerTaskCompletedType('');
      setDrawerTaskCompletedValue(undefined);
    },
  }));

  const renderStatus = (status: number): string => {
    if (status === 1) {
      return 'Not Started';
    }
    if (status === 2) {
      return 'In Process';
    }
    if (status === 3) {
      return 'Completed';
    }
    return 'Archive';
  };
  const renderBuilding = (building: number): string => {
    const item = buildings.filter((singleBuilding) => singleBuilding.value === building);
    if (item[0].name.length > 15) {
      return `${item[0].name.slice(0, 15)}...`;
    }
    return item[0].name;
  };
  const renderTemplate = (template: number): string => {
    const item = templates.filter((singleTemplate) => singleTemplate.value === template);
    if (item[0].name.length > 15) {
      return `${item[0].name.slice(0, 15)}...`;
    }
    return item[0].name;
  };
  const renderAssignee = (assignee: number): string => {
    const item = assignees.filter((singleAssignee) => singleAssignee.value === assignee);
    if (item[0].name.length > 15) {
      return `${item[0].name.slice(0, 15)}...`;
    }
    return item[0].name;
  };
  const renderTaskCompleted = (): string => {
    if (Number(drawerTaskCompletedType) === 0) {
      return `= ${drawerTaskCompletedValue}`;
    }
    if (Number(drawerTaskCompletedType) === 1) {
      return `< ${drawerTaskCompletedValue}`;
    }
    if (Number(drawerTaskCompletedType) === 2) {
      return `> ${drawerTaskCompletedValue}`;
    }
    if (Number(drawerTaskCompletedType) === 3) {
      return `<= ${drawerTaskCompletedValue}`;
    }
    return `>= ${drawerTaskCompletedValue}`;
  };

  const applyFilters = (): void => {
    setStatusFilter(statusList);
    setBuildingFilter(buildingList);
    setTemplateFilter(templateList);
    setAssignees(assigneeList);
    setStartDate(drawerStartDate);
    setEndDate(drawerEndDate);
    setTaskCompletedType(drawerTaskCompletedType);
    setTaskCompletedValue(drawerTaskCompletedValue);
    setOpenFilterDrawer(false);
  };
  const clearFilters = (): void => {
    setStatusList([]);
    setStatusFilter([]);
    setBuildingList([]);
    setBuildingFilter([]);
    setTemplateList([]);
    setTemplateFilter([]);
    setAssigneeList([]);
    setAssignees([]);
    setStartDate(undefined);
    setDrawerStartDate(undefined);
    setEndDate(undefined);
    setDrawerEndDate(undefined);
    setTaskCompletedType('');
    setDrawerTaskCompletedType('');
    setTaskCompletedValue(undefined);
    setDrawerTaskCompletedValue(undefined);
    setOpenFilterDrawer(false);
  };

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openFilterDrawer}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div className='d-flex justify-space-between align-items-center px-4'>
            <p className='btn-txt cursor-pointer' aria-hidden='true' onClick={(): void => { clearFilters(); }}>Delete all</p>
            <p className='heading'>Filter</p>
            <p className='btn-txt cursor-pointer' aria-hidden='true' onClick={(): void => { applyFilters(); }}>Done</p>
          </div>
          <div className='mt-4'>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenStatusDrawer(true); }}>
              <p>Status</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{statusList.length > 0 ? renderStatus(statusList[0]) : null}</span>
                  <span className='filter-status ms-2'>{statusList.length > 1 ? ` + ${statusList.length - 1}` : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenCustomDrawer(true); setCustomDrawerName('Property'); }}>
              <p>Property</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{buildingList.length > 0 ? renderBuilding(buildingList[0]) : null}</span>
                  <span className='filter-status ms-2'>{buildingList.length > 1 ? ` + ${buildingList.length - 1}` : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenCustomDrawer(true); setCustomDrawerName('Template'); }}>
              <p>Template</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{templateList.length > 0 ? renderTemplate(templateList[0]) : null}</span>
                  <span className='filter-status ms-2'>{templateList.length > 1 ? ` + ${templateList.length - 1}` : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenCustomDrawer(true); setCustomDrawerName('Assignee'); }}>
              <p>Assignee</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{assigneeList.length > 0 ? renderAssignee(assigneeList[0]) : null}</span>
                  <span className='filter-status ms-2'>{assigneeList.length > 1 ? ` + ${assigneeList.length - 1}` : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenDueDateDrawer(true); }}>
              <p>Due</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{drawerStartDate !== undefined ? `${moment(drawerStartDate).format('MMM DD,YYYY')} - ${moment(drawerEndDate).format('MMM DD,YYYY')}` : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
            <div className='filter-item' aria-hidden='true' onClick={(): void => { setOpenTaskCompletedDrawer(true); }}>
              <p>Task Completed</p>
              <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center me-3'>
                  <span className='filter-status'>{drawerTaskCompletedType !== '' && drawerTaskCompletedValue !== undefined ? renderTaskCompleted() : null}</span>
                </div>
                <ArrowForwardIcon />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <StatusDrawer openStatusDrawer={openStatusDrawer} setOpenStatusDrawer={setOpenStatusDrawer} statusList={statusList} setStatusList={setStatusList} />
      {customDrawerName === 'Property'
        ? <CustomDrawer openCustomDrawer={openCustomDrawer} setOpenCustomDrawer={setOpenCustomDrawer} selectedList={buildingList} setSelectedList={setBuildingList} optionsList={buildings} customDrawerName={customDrawerName} />
        : customDrawerName === 'Template' ? <CustomDrawer openCustomDrawer={openCustomDrawer} setOpenCustomDrawer={setOpenCustomDrawer} selectedList={templateList} setSelectedList={setTemplateList} optionsList={templates} customDrawerName={customDrawerName} />
          : customDrawerName === 'Assignee' ? <CustomDrawer openCustomDrawer={openCustomDrawer} setOpenCustomDrawer={setOpenCustomDrawer} selectedList={assigneeList} setSelectedList={setAssigneeList} optionsList={assignees} customDrawerName={customDrawerName} /> : null}
      <DueDateDrawer
        openDueDateDrawer={openDueDateDrawer}
        setOpenDueDateDrawer={setOpenDueDateDrawer}
        drawerStartDate={drawerStartDate}
        setDrawerStartDate={setDrawerStartDate}
        drawerEndDate={drawerEndDate}
        setDrawerEndDate={setDrawerEndDate}
      />
      <TaskCompletedDrawer
        openTaskCompletedDrawer={openTaskCompletedDrawer}
        setOpenTaskCompletedDrawer={setOpenTaskCompletedDrawer}
        drawerTaskCompletedType={drawerTaskCompletedType}
        setDrawerTaskCompletedType={setDrawerTaskCompletedType}
        drawerTaskCompletedValue={drawerTaskCompletedValue}
        setDrawerTaskCompletedValue={setDrawerTaskCompletedValue}
      />
    </div>
  );
}
export default forwardRef(FilterDrawer);
