export interface IHandleSubTask {
  id: number | undefined;
  status: boolean;
}
export interface IHandleTaskEmail {
  id: number | undefined;
  name: string;
  value: string;
}
export interface IFileUpload {
  file: string;
  file_name: string;
}
export interface IHandleTaskForm {
  id: number | undefined;
  value: Date | IFileUpload | ISelectedItem[] | string | null;
}
export interface ISelectedItem {
  id?: number;
  value: string;
  label: string;
}
