import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import * as _ from 'underscore';
import { AppDataService } from '../../app-data/app-data.service';
import { IDataTablePageChangeEvent } from '../../lib/utils/interfaces';
import { formSubmitType, IDataModel, IDataTable } from '../../lib/utils/utils.index';
import { sampleRequestModel } from '../model/requestModel';
import { Contact } from '../model/responseModel';
@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent implements OnInit {
  constructor(private _dataSvc: AppDataService) {
    this.initVariables();
  }

  formData: any;
  formSubmitType!: formSubmitType;
  dataModel!: IDataModel;
  submitFormTitle!: string;
  dataSource!: IDataTable;
  localDataSource: IDataTable = {
    tableCaption: 'Contacts',
    rows: [],
    columns: [],
    selectableRows: true,
    showPaginator: true,
    showFilter: true,
    pageSizeOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    totalRecords: 50,
  };
  errMsg: string = '';

  ngOnInit(): void {

    this.initVariables();
    this._dataSvc.loadContactData().subscribe((res: Contact) => {
      this.generateTableSource(res);

    });
  }
  initVariables() {
    this.submitFormTitle = 'Sign Up';
    this.formData = {};
    this.formSubmitType = formSubmitType.NEW;
    this.dataModel = new sampleRequestModel().getDataModel();
  }

  submitForm(formValue: JSON) {
    this.reset();

    let model: any = plainToClass(sampleRequestModel, formValue);
    model = _.pick(model, (value, key, obj) => {
      return _.isNull(value) == false;
    });
  }
  reset() {
    this.errMsg = '';
    this.formData = {};

  }

  generateTableSource(res: any) {
    //let columns: IDataModelColumn[] = generateDataColumnFromModel(res[0], 3);
    this.localDataSource.columns = this.dataModel.columns;
    this.localDataSource.rows = res;
    this.dataSource = this.localDataSource;
  }
  loadPage(event: IDataTablePageChangeEvent) {

    console.log(event);
  }
}
