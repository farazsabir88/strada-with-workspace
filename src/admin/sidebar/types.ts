export interface IMainSidebarProps {
  activeLink?: string;
  variant?: string;
}

export interface INavbarItem {
  id: string;
  name: string;
  heading: string;
  hasChildren: boolean;
  children: INavbarItem[] | null;
  hasIcon: boolean;
  icon?: () => JSX.Element | null;
  route: string;
  parentName: string | null;
}

export interface IMenuItemProps {
  item: INavbarItem;
  isChild?: boolean;
  al?: string;
}
