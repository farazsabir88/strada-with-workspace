export interface IWorkspaceFilter {
  workspaceFilter: number[];
  setWorkspaceFilter: (moves: number[]) => void;
}
export interface IBuildingFilter {
  buildingFilter: number[];
  setBuildingFilter: (moves: number[]) => void;
}
export interface IFilters extends IWorkspaceFilter, IBuildingFilter {
}
