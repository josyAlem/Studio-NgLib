import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'underscore';
import * as interfaces from '../../utils/interfaces';


@Component({
  selector: 'studio-ui-tmpl-grid',
  templateUrl: './tmpl-grid.html',
  styleUrls: ['./tmpl-grid.scss'],
  animations: [
    trigger('detailExpandTrigger', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TmplDataGridComponent implements OnChanges, OnInit {
  @Output() onLoadPage: EventEmitter<interfaces.IDataTablePageChangeEvent> = new EventEmitter();
  @Output() onRowSelected: EventEmitter<any> = new EventEmitter();
  @Output() onRowUnselected: EventEmitter<any> = new EventEmitter();
  @Output() onFieldClicked: EventEmitter<any> = new EventEmitter();

  localDataTable: interfaces.IDataTable = {
    tableCaption: 'Sample Data Table',
    rows: [],
    columns: [],
    selectableRows: true,
    expandContent: '',
    contextMenu: [],
    showPaginator: false,
    showFilter: false,
    pageSizeOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    totalRecords: 0,
  };
  @Input() inputDataSource: interfaces.IDataTable = this.localDataTable;

  selectedRowData!: SelectionModel<any>;
  expandedElement!: null;
  isLoadingResults: boolean = false;
  tableColHeaders!: string[];
  gridRows: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor() { }
  ngOnInit(): void {
    console.log('datatable component init.');
  }
  ngOnChanges() {
    this.initDataTable();
  }

  initDataTable() {
    this.selectedRowData = new SelectionModel<any>(true, []);

    if (!this.inputDataSource)
      return;

    let modifiedColHeaders: interfaces.IDataModelColumn[] = _.map(
      this.inputDataSource.columns,
      function (c: any) {
        return c;
      }
    );
    if (this.inputDataSource.expandContent != null) {
      if (
        !_.findWhere(modifiedColHeaders, {
          header: 'expand',
          field: 'expand',
        })
      )
        modifiedColHeaders.unshift({ header: 'expand', field: 'expand' });
    }

    if (this.inputDataSource.selectableRows == true) {
      if (
        !_.findWhere(modifiedColHeaders, {
          header: 'select',
          field: 'select',
        })
      )
        modifiedColHeaders.unshift({ header: 'select', field: 'select' });
    }

    if (this.inputDataSource.contextMenu != null) {
      if (
        !_.findWhere(modifiedColHeaders, {
          header: 'ctxMenu',
          field: 'ctxMenu',
        })
      )
        modifiedColHeaders.push({ header: 'ctxMenu', field: 'ctxMenu' });
    }

    this.tableColHeaders = _.pluck(modifiedColHeaders, 'header');
    this.localDataTable = this.inputDataSource;
    //this.showPaginator = this.inputDataSource.showPaginator;
    //this.showFilter = this.inputDataSource.showFilter;
    this.inputDataSource.rows.forEach(c => this.gridRows.data.push(c));

    this.gridRows.sort = this.sort;
    if (this.localDataTable.showPaginator) {
      if (this.localDataTable.pageSizeOptions == null || [])
        this.localDataTable.pageSizeOptions = [
          5, 10, 20, 50, 100, 500, 1000, 10000,
        ];
      if (this.localDataTable.totalRecords == null)
        this.localDataTable.totalRecords =
          this.gridRows.data.length;
      if (this.localDataTable.pageSize == null)
        this.localDataTable.pageSize = 5;

      this.gridRows.paginator = this.paginator;

    }
  }

  sortData(event: Sort) {
    this.gridRows.sort?.sort({
      id: event.active,
      start: event.direction,
    } as MatSortable);
  }

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.gridRows.filter = filterValue;
  }

  //#region Selctable Rows
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedRowData.selected.length;
    const numRows = this.gridRows.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selectedRowData.clear()
      : this.gridRows.data.forEach((row) =>
        this.selectedRowData.select(row)
      );
  }
  onAllCheckboxChanged(event: any) {
    if (event) this.masterToggle();
  }

  onRowCheckboxClicked(event: any) {
    event.stopPropagation();
  }
  onChangeRowSelection(event: any, rowData: any) {
    if (event) {
      this.selectedRowData.toggle(rowData);
      if (this.selectedRowData.selected) {
        this.onRowSelected.emit(rowData);
        console.log('selected row: ' + JSON.stringify(rowData));
      } else {
        this.onRowUnselected.emit(rowData);
        console.log('unselected row: ' + JSON.stringify(rowData));
      }
    }
  }
  //#endregion

  onPageChanged(event: any) {
    let pageData: interfaces.IDataTablePageChangeEvent = {
      previousPageIndex: event.previousPageIndex,
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    };
    this.onLoadPage.emit(pageData);
    console.log('onPageChanged from template:' + event);
  }

  onViewDetail(field: string, rowData: any) {
    this.onFieldClicked.emit({ field: field, rowData: rowData });
    console.log(
      'selected field: ' + field + ' rowData: ' + JSON.stringify(rowData)
    );
  }
  onViewExpandedContent(rowData: any) {
    this.expandedElement = this.expandedElement === rowData ? null : rowData;
  }
}
