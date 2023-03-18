import { combineReducers } from '@reduxjs/toolkit';
import currentBuildingSlice from 'admin/store/currentBuildingSlice';
import buildingIntegration from 'admin/store/buildingIntegration';
import allBuildingSlice from 'admin/store/allBuildings';
import currentWorkspaceSlice from 'admin/store/currentWorkspaceSlice';
import allWorkspacesSlice from 'admin/store/allWorkspaces';
import SideSheetDataSlice from 'admin/store/SideSheetData';

const reducer = combineReducers({
  currentBuilding: currentBuildingSlice,
  buildingIntegration,
  buildingsData: allBuildingSlice,
  currentWorkspace: currentWorkspaceSlice,
  workspacesData: allWorkspacesSlice,
  sideSheetData: SideSheetDataSlice,
});

export default reducer;
