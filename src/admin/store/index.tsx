import { combineReducers } from '@reduxjs/toolkit';
import currentBuildingSlice from './currentBuildingSlice';
import buildingIntegration from './buildingIntegration';
import allBuildingSlice from './allBuildings';
import allWorkspacesSlice from './allWorkspaces';
import currentWorkspaceSlice from './currentWorkspaceSlice';
import SideSheetDataSlice from './SideSheetData';
import userPermissionSlice from './permissions';

const reducer = combineReducers({
  currentBuilding: currentBuildingSlice,
  buildingIntegration,
  buildingsData: allBuildingSlice,
  currentWorkspace: currentWorkspaceSlice,
  workspacesData: allWorkspacesSlice,
  sideSheetData: SideSheetDataSlice,
  userPermission: userPermissionSlice,
});

export default reducer;
