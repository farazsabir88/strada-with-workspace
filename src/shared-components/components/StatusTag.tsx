import React, { useEffect } from 'react';
import type { IBuildingOption } from 'admin/buildingSection/budget-calendar/components/SideSheet/StatusBar';

const optionsList = [
  {
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    value: 2,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
  {
    name: 'Scheduled',
    value: 3,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 4,
    color: 'rgb(76, 175, 80)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'As Needed',
    value: 5,
    color: 'rgb(0, 172, 193)',
    background: 'rgba(0, 172, 193, 0.08)',
  },
  {
    name: 'Contingency',
    value: 6,
    color: 'rgb(216, 27, 96)',
    background: 'rgba(216, 27, 96, 0.08)',
  },
  {
    name: 'Contract',
    value: 7,
    color: 'rgb(94, 53, 177)',
    background: 'rgba(94, 53, 177, 0.08)',
  },
];

export default function StatusTag({ value }: { value: number }): JSX.Element {
  const [selectedTag, setSelectedTag] = React.useState<IBuildingOption>({
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  });

  useEffect(() => {
    const filteredTag = optionsList.filter((tag) => tag.value === value);
    if (filteredTag.length > 0) {
      setSelectedTag(filteredTag[0]);
    }
  }, [value]);

  return (
    <div style={{ background: selectedTag.background, color: selectedTag.color }} className='single-tag'>
      {selectedTag.name}
    </div>
  );
}
