import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { plainToClass } from 'class-transformer';
import { formSubmitType, IDataModel, IDataTable } from 'studio-ui-tmpl';
import * as _ from 'underscore';
import { AppDataService } from '../../app-data/app-data.service';
import { sampleRequestModel } from '../model/requestModel';
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
    rows: new MatTableDataSource<any>(),
    columns: []
  };
  errMsg: string = '';

  ngOnInit(): void {

    this.initVariables();
    this._dataSvc.loadContactData().subscribe((res: any) => {
      this.generateTableSource(res);

    });
  }
  initVariables() {
    this.submitFormTitle = 'Get';
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
    this.localDataSource.columns = [];
    this.localDataSource.rows = new MatTableDataSource<any>();
    this.dataSource = this.localDataSource;
  }

  generateTableSource(res: any) {
    //let columns: IDataModelColumn[] = generateDataColumnFromModel(res[0], 3);
    this.localDataSource.columns = this.dataModel.columns;
    this.localDataSource.rows = new MatTableDataSource<any>(res);
    this.dataSource = this.localDataSource;
  }

}
