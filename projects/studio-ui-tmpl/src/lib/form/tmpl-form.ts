import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output
} from '@angular/core';
import {
  FormControl, FormGroup, ValidationErrors
} from '@angular/forms';
import { distinct } from 'rxjs/operators';
import * as _ from 'underscore';
import * as sharedEnums from '../enums';
import { shared } from '../globals';
import * as sharedStatics from '../statics';

@Component({
  selector: 'tmpl-form',
  template: `<form novalidate="novalidate" [formGroup]="_localDataForm" class="tmpl-form-container">
  <div *ngFor="let field of _localDataModel.fields| sharedFilterPipe:filterFormField" >
      <div *ngIf="field.controlType==sharedFormCtrlType.INPUT">
          <mat-form-field appearance="outline"  class="tmpl-form-item">
              <mat-label>{{field.label}}</mat-label>
              <input matInput type="{{field.type}}"  formControlName="{{field.name}}" autocomplete="off"/>
          </mat-form-field>
      </div>
      <div *ngIf="field.controlType==sharedFormCtrlType.DATEPICKER" >
          <mat-form-field appearance="outline" class="tmpl-form-item">
              <mat-label>{{field.label}}</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="{{field.name}}"autocomplete="off"/>
              <mat-datepicker-toggle matSuffix="matSuffix" [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
      </div>
      <div *ngIf="field.controlType==sharedFormCtrlType.CHECKBOX" >
          <mat-form-field appearance="outline" class="tmpl-form-item">
              <mat-checkbox class="example-margin" [(ngModel)]="field.name"formControlName="{{field.name}}">{{field.label}}</mat-checkbox>
          </mat-form-field>
      </div>
      <div *ngIf="field.controlType==sharedFormCtrlType.TEXTAREA" >
          <mat-form-field appearance="outline" class="tmpl-form-item">
              <mat-label>{{field.label}}</mat-label>
              <textarea matInput clearInput="true" formControlName="{{field.name}}"autocomplete="off"></textarea>
          </mat-form-field>
      </div>
      <div >
          <span class="tmpl-form-validation-help-block"  *ngIf="validateForm(field.name)">
              {{_errMessage}}
          </span>
      </div>
  </div>
</form>
<div>
<button mat-raised-button="mat-raised-button" class="tmpl-form-submit" color="primary" (click)="formSubmit()" [disabled]="!_localDataForm.valid">
   {{_submitFormTitle}}
  </button>
</div>
`,
  styleUrls: ['./tmpl-form.scss'],
})
export class TmplFormComponent implements OnChanges, OnInit {
  constructor() { }
  @Output() submitForm: EventEmitter<JSON> = new EventEmitter<JSON>();
  @Input() formData: any;
  @Input() formSubmitType!: sharedEnums.formSubmitType;
  @Input() dataModel!: shared.IDataModel;
  @Input() submitFormTitle!: string;

  _submitFormTitle: string = 'SAVE';
  _errMessage: string = '';
  _localDataForm!: FormGroup;
  _localDataModel!: shared.IDataModel;

  sharedFormCtrlType: any;
  ngOnInit(): void {
    this.sharedFormCtrlType = sharedStatics.FormCtrlType;

    if (!_.isNull(this.submitFormTitle) && !_.isEmpty(this.submitFormTitle))
      this._submitFormTitle = this.submitFormTitle;

    this._localDataModel = this.dataModel;
    this._localDataModel.fields = _.where(this.dataModel.fields, {
      formView: true,
    });

    this.initSampleForm();
  }

  ngOnChanges(): void {
    if (this.formData != null && this._localDataForm != null) {
      this._localDataForm.patchValue(this.formData);
    }
  }

  initSampleForm(): void {
    this._localDataForm = new FormGroup({});
    this._localDataModel.fields.forEach((fld) => {
      var frmCtrl = new FormControl(this.setFormCtrlDefaultValue(fld));
      this.updateControlValueByType(fld, frmCtrl);
      let fieldModel = _.findWhere(this._localDataModel.validators || [], {
        name: fld.name,
      });
      if (fieldModel != null) {
        frmCtrl.setValidators(fieldModel.validationRule || []);
        frmCtrl.updateValueAndValidity();
      }
      this._localDataForm.addControl(fld.name, frmCtrl);
    });
    if (this.formData != null) this._localDataForm.patchValue(this.formData);
    else this._localDataForm.updateValueAndValidity();
  }
  updateControlValueByType(fld: shared.IDataModelField, frmCtrl: FormControl) {
    frmCtrl.valueChanges.pipe(distinct()).subscribe((value) => {
      switch (fld.dataType) {
        case 'number': {
          if (!_.isNull(value) && !_.isEmpty(value)) frmCtrl.setValue(+value);
          else if (value == '') frmCtrl.setValue(null);
          break;
        }
        default:
          break;
      }
    });
  }
  setFormCtrlDefaultValue(fld: shared.IDataModelField): any {
    switch (fld.dataType) {
      case 'bool':
        return true;
      case 'select':
        return null;
      default:
        return null;
    }
  }

  formSubmit(): void {
    var formValue = this._localDataForm.value;

    console.log('Saved in template: ' + JSON.stringify(formValue));
    if (!this._localDataForm.valid) return;

    this.submitForm.emit(formValue);
  }

  filterFormField(field: shared.IDataModelField) {
    return field.formView == true;
  }

  validateForm(fieldName: string): boolean {
    var INVALID = false;
    if (
      this._localDataForm.get(fieldName) &&
      (this._localDataForm.get(fieldName)?.touched ||
        this._localDataForm.get(fieldName)?.dirty) &&
      this._localDataForm.get(fieldName)?.errors
    ) {
      var error: ValidationErrors | null | undefined =
        this._localDataForm.get(fieldName)?.errors;
      if (error) INVALID = this.getErrorMessage(error);
    }
    return INVALID;
  }

  getErrorMessage(error: ValidationErrors | null | undefined): boolean {
    this._errMessage = "";
    if (error == null)
      return true;

    if (error['required']) {
      this._errMessage = "*Required!";
    }
    else if (error['pattern'])
      this._errMessage = "*Invalid format!";

    else if (error['email']) {
      this._errMessage = "*Invalid format!(Sample: john@gmail.com)";
    }
    else if (error['minlength']) {
      this._errMessage = "*Minimum length allowed is " + error['minlength'].requiredLength + " !";
    }
    else if (error['numRange']) {
      this._errMessage = error['numRange'].message;
    }
    else
      return false;

    return true;
  }
}
