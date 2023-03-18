/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
// import { components } from 'react-select';
import { withStyles } from '@mui/styles';
import type { MenuProps } from '@mui/material';
import {
  Tab, Tabs, Menu, MenuItem,
} from '@mui/material';

export const StyledTabs = withStyles({
  root: {
    borderBottom: 'solid 1px rgba(31,31,31, 0.12)',
  },
  indicator: {
    backgroundColor: '#00CFA1',
  },
})(Tabs);

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#212121',
    opacity: 0.6,
    fontFamily: 'Roboto-Medium',
    // width: '50px',
    minWidth: 'max-content',
    padding: '0px 16px',
  },
  selected: {
    color: '#00CFA1',
    fontWeight: 'bold',
    opacity: 1,
  },
})(Tab);

// export function CustomValueContainer({ children, ...props }): JSX.Element {
//   const { ValueContainer, Placeholder } = components;
//   return (
//     <ValueContainer {...props}>
//       <Placeholder {...props} isFocused={props.isFocused}>
//         {props.selectProps.placeholder}
//       </Placeholder>
//       {React.Children.map(children, (child) => (child && child.type !== Placeholder ? child : null))}
//     </ValueContainer>
//   );
// }

// export const ccustomStylesVendor = {
//   menu: (base) => ({
//     ...base,
//     zIndex: 100,
//   }),
//   indicatorSeparator: () => ({
//     // display: "none"
//   }),
//   control: (base, state) => ({
//     ...base,
//     'min-height': '58px',
//     'margin-top': '5px',
//     width: '300px',
//     borderColor: state.isSelected ? '#00CFA1' : '#e2e2e1',
//     boxShadow: state.isFocused ? '0 0 0 1px #00CFA1' : '0',
//     '&:hover': {
//       borderColor: state.isFocused ? '#00CFA1' : '#616161',
//     },
//   }),
//   valueContainer: (provided, state) => ({
//     ...provided,
//     overflow: 'visible',
//     padding: '2px 12px',
//   }),
//   placeholder: (provided, state) => ({
//     ...provided,
//     color: state.hasValue || state.selectProps.inputValue ? '#00CFA1' : '#616161',
//     position: 'absolute',
//     top: state.hasValue || state.selectProps.inputValue ? 3 : '50%',
//     transition: 'top 0.1s, font-size 0.1s',
//     fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
//   }),
//   singleValue: (provided, state) => ({
//     ...provided,
//     top: 'calc(50% + 8px)',
//     color: 'rgba(33, 33, 33, 0.6) !important',
//     fontSize: '14px !important',
//   }),
//   input: (provided, state) => ({
//     ...provided,
//     fontSize: '14px',
//     marginTop: '10px',

//   }),
// };
export const StyledMenuItem = withStyles({
  root: {
    fontSize: '14px !important',
    lineHeight: '24px',
    padding: '12px 16px',
  },
})(MenuItem);
export const StyledMenu = withStyles({
  list: {
    padding: '0',
    width: '208px',
  },
})((props: MenuProps) => (
  <Menu {...props} />
));
