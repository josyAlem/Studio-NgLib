import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSort,
  MatSortable, Sort
} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'underscore';
import * as interfaces from '../../utils/interfaces';

@Component({
  selector: 'studio-ui-tmpl-grid',
  template: `

  <div >
    <mat-spinner id="dataTableLoadingSpinner" *ngIf="isLoadingResults"></mat-spinner>
    <div *ngIf="showFilter">
      <mat-form-field appearance="standard">
        <mat-label>Filter</mat-label>
          <input matInput (keyup)="applyFilter($event)">
        </mat-form-field>
      </div>
  
    <table class="mat-elevation-z8" mat-table *ngIf="!isLoadingResults" [dataSource]="localDataTable.rows" multiTemplateDataRows
     matSort (matSortChange)="sortData($event)">
     <caption> {{localDataTable.tableCaption}} </caption>
  
     <ng-container matColumnDef="select" sticky>
        <th mat-header-cell *matHeaderCellDef >
          <mat-checkbox (change)="onAllCheckboxChanged($event)" [checked]="selectedRowData.hasValue() && isAllSelected()"
            [indeterminate]="selectedRowData.hasValue() && !isAllSelected()">
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row">
          <mat-checkbox (click)="onRowCheckboxClicked($event)" (change)="onChangeRowSelection($event,row)"
            [checked]="selectedRowData.isSelected(row)">
          </mat-checkbox>
        </td>
        <td mat-footer-cell *matFooterCellDef > </td>
      </ng-container>
  
      <ng-container matColumnDef="expand" sticky>
        <th mat-header-cell *matHeaderCellDef > </th>
  
        <td mat-cell *matCellDef="let row">
          <mat-icon aria-hidden="false"  (click)="onViewExpandedContent(row)">{{row == expandedElement?'keyboard_arrow_up':'keyboard_arrow_down'}}</mat-icon>
        </td>
        <td mat-footer-cell *matFooterCellDef> </td>
      </ng-container>
  
      <ng-container *ngFor="let col of localDataTable.columns" [matColumnDef]="col.header" [sticky]="col.sticky">
        <th mat-header-cell *matHeaderCellDef [mat-sort-header]="col.field" id="{{col.field}}"> {{col.header}} </th>
        <td mat-cell *matCellDef="let row">
  
          <span *ngIf="!col.isViewDetailLink"> {{row[col.field]}}</span>
  
          <a *ngIf="col.isViewDetailLink" (click)="onViewDetail(col.field,row)" style="cursor:pointer">
            {{row[col.field]}}
          </a>
  
        </td>
        <td mat-footer-cell *matFooterCellDef> </td>
      </ng-container>
  
      <ng-container matColumnDef="ctxMenu" stickyEnd >
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let row">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon aria-hidden="false">more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu" xPosition="before" yPosition="below">
            <ng-template matMenuContent>
              <button *ngFor="let bt of localDataTable.contextMenu" mat-menu-item [disabled]="bt.disabled"
              >
              <!-- (click)="bt.command(bt.id,row)" -->
            <mat-icon aria-hidden="false">{{bt.icon}}</mat-icon>
                <span> {{bt.label}}</span>
              </button>
            </ng-template>
          </mat-menu>
        </td>
        <!-- <td mat-footer-cell *matFooterCellDef> </td> -->
      </ng-container>
  
      <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
      <ng-container matColumnDef="expandedContentId">
        <td mat-cell *matCellDef="let row" [attr.colspan]="tableColHeaders.length">
          <div class="grid-element-detail" [@detailExpandTrigger]="row == expandedElement ? 'expanded' : 'collapsed'">
            <div [innerHTML]="localDataTable.expandContent"></div>
          </div>
        </td>
      </ng-container>
  
      <tr mat-header-row *matHeaderRowDef="tableColHeaders; sticky: true"></tr>
      <tr mat-row *matRowDef="let row; columns: tableColHeaders;" class="grid-element-row"
        [class.grid-expanded-row]="expandedElement === row"> </tr>
  
      <tr mat-row *matRowDef="let row; columns: ['expandedContentId']" class="grid-detail-row"></tr>
      <tr mat-footer-row *matFooterRowDef="tableColHeaders; sticky: true"></tr>
  
    </table>
  
    <mat-paginator *ngIf="showPaginator" (page)="onPageChanged($event)" [pageSize]="localDataTable.pageSize" [length]="localDataTable.totalRecords" [pageSizeOptions]="localDataTable.pageSizeOptions|| []" showFirstLastButtons>
  
    </mat-paginator>
  </div>
  `,
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
  @Output() onRowSelected: EventEmitter<any> = new EventEmitter();
  @Output() onRowUnselected: EventEmitter<any> = new EventEmitter();
  @Output() onFieldClicked: EventEmitter<any> = new EventEmitter();
  selectedRowData!: SelectionModel<any>;
  showSearchRow: boolean = false;
  localDataTable: interfaces.IDataTable = {
    tableCaption: 'Sample Data Table',
    rows: new MatTableDataSource<any>(),
    columns: [],
    selectableRows: true,
    expandContent: '',
    contextMenu: [],
    showPaginator: true,
    pageSizeOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    totalRecords: 0,
  };
  @Input() inputDataSource: interfaces.IDataTable = this.localDataTable;

  expandedElement!: null;
  isLoadingResults: boolean = false;
  showFilter?: boolean = false;
  tableColHeaders!: string[];
  showPaginator?: boolean = false;

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
    this.showPaginator = this.inputDataSource.showPaginator;
    this.showFilter = this.inputDataSource.showFilter;

    this.localDataTable.rows.sort = this.sort;
    if (this.localDataTable.showPaginator) {
      if (this.localDataTable.pageSizeOptions == null || [])
        this.localDataTable.pageSizeOptions = [
          5, 10, 20, 50, 100, 500, 1000, 10000,
        ];
      if (this.localDataTable.totalRecords == null)
        this.localDataTable.totalRecords =
          this.localDataTable.rows.data.length;
      if (this.localDataTable.pageSize == null)
        this.localDataTable.pageSize = 5;

      this.localDataTable.rows.paginator = this.paginator;

    }
  }

  sortData(event: Sort) {
    this.localDataTable.rows.sort?.sort({
      id: event.active,
      start: event.direction,
    } as MatSortable);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.localDataTable.rows.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedRowData.selected.length;
    const numRows = this.localDataTable.rows.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selectedRowData.clear()
      : this.localDataTable.rows.data.forEach((row) =>
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
  onPageChanged(event: any) {
    console.log(event);
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
