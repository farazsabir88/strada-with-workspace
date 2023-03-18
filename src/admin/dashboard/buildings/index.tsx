/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { KeyboardEvent } from 'react';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Grid, Typography, InputBase, Paper, IconButton,
} from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllBuildings } from 'admin/store/allBuildings';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { Ibuilding } from 'types';
import type { AxiosResponse } from 'axios';
import { useLocation } from 'react-router-dom';
import type { BuildingsResponse } from './types';
import Card from './Card';
import './_buildings.scss';

function Buildings(): JSX.Element {
  const dispatch = useDispatch();
  const workspaceId = useLocation().state;
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(
    ['get/buildings', search, workspaceId],
    async () => axios({
      url: `api/building/?workspace=${workspaceId}`,
      method: 'get',
      params: {
        search,
      },
    }),
    {
      select: (res: AxiosResponse<BuildingsResponse>) => res.data.detail,
      onSuccess: (res) => dispatch(setAllBuildings(res)),
    },
  );

  const handleSearch: (e: KeyboardEvent<HTMLImageElement>) => void = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Enter') {
      setSearch(inputText);
    }
  };

  return (
    <div className='container' style={{ marginTop: '72px' }}>
      <StradaLoader open={isLoading} />
      <Grid container mt={2} spacing={3} className='search-field-wrapper'>
        <Grid item sm={6}>
          <Typography className='search-field-typo'>Buildings</Typography>
        </Grid>
        <Grid item sm={6} className='search-field'>
          <Paper elevation={0} className='search-paper'>
            <InputBase
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setInputText(e.target.value); }}
              onBlur={(): void => { setSearch(inputText); }}
              onKeyPress={handleSearch}
              placeholder='Search Building'
              endAdornment={(
                <IconButton style={{ padding: 0 }} onClick={(): void => { setSearch(inputText); }}>
                  {' '}
                  <SearchIcon className='search-icon' />
                  {' '}
                </IconButton>
              )}
            />

            {' '}
          </Paper>
        </Grid>
      </Grid>

      <Grid container mt={1} spacing={3}>
        {data !== undefined && data.length > 0
          ? Array.isArray(data) && data.map((building: Ibuilding) => <Grid key={`building-key-${building.id}`} item md={4} sm={6} xs={12}><Card building={building} /></Grid>)
          : (
            <div className='empty-array-wrapper-2'>
              <p>No Buildings Avaliable</p>
            </div>
          )}
      </Grid>
    </div>
  );
}

export default Buildings;
