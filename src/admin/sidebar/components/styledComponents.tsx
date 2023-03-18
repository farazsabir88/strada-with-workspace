/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import styled from 'styled-components';

interface NavButtonProps {
  active: boolean | undefined;
  isChild?: boolean;
}

export const StyledMainNavButton = styled.div<NavButtonProps>`
width: 100%;
border-radius: 4px;
display: flex;
align-items: center;
justify-content:space-between ;
background: ${(props): string => (props.active ? 'rgba(0, 207, 161, 0.12)' : 'white')};
padding: ${(props): string => (props.isChild ? '12px 12px' : '12px 24px')} ;
cursor: pointer;
margin-bottom: 0.5rem;
&:hover{
    background: rgba(0, 207, 161, 0.12);
    .left-side h6{
        color: #00CFA1;
    }
    svg path{
        fill: #00CFA1;
        fill-opacity: 1 ;
    }
}
svg path{
    fill: ${(props): string => (props.active ? '#00CFA1' : '#212121')};
    fill-opacity: ${(props): number => (props.active ? 1 : 0.6)} ;
}
.left-side{
    display: flex;
align-items: center;


    h6{
    font-weight: 500;
font-size: 14px;
line-height: 24px;
letter-spacing: 0.1px;
margin-top: 3px;
margin-left: 16px;
font-family: 'Roboto-Medium';
color: ${(props): string => (props.active ? '#00CFA1' : 'rgba(33, 33, 33, 0.6)')} ;
}
}
.right-side{
    i{
        font-size: 12px;
        color: ${(props): string => (props.active ? '#00CFA1' : 'rgba(33, 33, 33, 0.6)')} ;
    }
}


`;
