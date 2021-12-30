
export interface INavigationObject {
  id: string,
  title: string,
  route: string,
  icon: string,
  order: number,
  isDefaultPath: boolean
}

export interface IDataModelField {
  name: string,
  label: string,
  controlType: string,
  dataType: string,
  type: string,
  isRequired?: boolean
  formView: boolean,
  disabled?: boolean,
  width?: string,
  placeholder?: string
}
export interface IDataModelColumn {
  field: string,
  header: string,
  isViewDetailLink?: boolean,
  styleClass?: string,
  sticky?: boolean
}
export interface IDataModelValidator {
  name: string,
  validationRule?: any[]
}
export interface IDataModel {
  fields: IDataModelField[],
  columns: IDataModelColumn[],
  validators?: IDataModelValidator[],
  formSize: string,
  isCenteredForm: boolean
}
export interface IContextMenu {
  id?: string,
  label?: string;
  icon?: string;
  disabled?: boolean,
  command?: (ctxMenuId?: string, data?: any) => void
}
export interface IDataTable {
  tableCaption?: string,
  rows: any[],
  columns: IDataModelColumn[],
  selectableRows?: boolean,
  expandContent?: string,
  contextMenu?: IContextMenu[],
  showFilter?: boolean,
  showPaginator?: boolean,
  pageSizeOptions?: number[],
  pageSize?: number,
  totalRecords?: number

}

export interface IDataTablePageChangeEvent {
  previousPageIndex: number,
  pageIndex: number,
  pageSize: number,
  length: number
}
