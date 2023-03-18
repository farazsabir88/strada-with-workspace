export interface Itasks {
  name: string;
  assignee: number | null;
  description: string;
  id?: number;

}
export interface Ipayload {
  workspace: number;
  template_name: string;
  description: string;
  tasks: Itasks[];
}
