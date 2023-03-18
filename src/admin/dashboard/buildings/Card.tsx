import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import './_buildings.scss';
import { CardHeader } from '@mui/material';
import type { Ibuilding } from 'types';
import { useDispatch } from 'react-redux';
import { encrypt } from 'shared-components/hooks/useEncryption';
import { setCurrentBuilding } from 'admin/store/currentBuildingSlice';
import DeleteBuildingDialog from './DeleteBuildingDialog';
import type { DeleteActionBuilding } from './types';

interface Iprops {
  building: Ibuilding;
}

export default function OutlinedCard(props: Iprops): JSX.Element {
  const { building } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteAction, setDeleteAction] = useState<DeleteActionBuilding>({
    open: false,
    data: null,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onBuildingClick = (buildingData: Ibuilding): void => {
    if (!open) {
      dispatch(setCurrentBuilding(buildingData));
      navigate(`/workspace/budget-calendar/${encrypt(building.id)}`);
    }
  };

  const handleCloseDeleteDialog = (): void => {
    setDeleteAction({
      open: false,
      data: null,
    });
    handleClose();
  };

  const card = (
    <div key={`building-card-${building.id}`} style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={(e): void => { onBuildingClick(building); e.stopPropagation(); }} aria-hidden='true'>
      <DeleteBuildingDialog open={deleteAction.open} handleClose={handleCloseDeleteDialog} dataToDelete={deleteAction.data} />
      <CardContent className='card-wrapper'>
        <CardHeader
          sx={{ padding: 0 }}
          title={(
            <Typography sx={{ padding: 0 }} className='card-heading' gutterBottom>
              {building.address}
            </Typography>
          )}

        />

        <Typography className='card-sub-heading'>
          Address
        </Typography>
        <Typography className='address-parts'>
          {building.address}
          {' '}
          <br />
          {' '}
          { building.city}
          {' '}
          {building.state}
          {' '}
          {building.zip}

          <br />
          {' '}
          {building.country}

        </Typography>
        <Typography className='card-sub-heading'>
          Company
        </Typography>
        <Typography className='card-desc'>
          {building.company}
        </Typography>
        <Typography className='card-sub-heading'>
          Contact Person
        </Typography>
        <Typography className='card-desc'>
          {building.contact_first_name}
          {' '}
          {building.contact_last_name}
        </Typography>
        <Typography className='card-desc'>
          {building.contact_email}
        </Typography>
      </CardContent>
    </div>
  );
  return (
    <Box>
      <Card variant='outlined'>{card}</Card>
    </Box>
  );
}
