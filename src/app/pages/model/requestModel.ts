import { Validators } from '@angular/forms';
import { FormCtrlType, IDataModel, IDataModelColumn, IDataModelField, IDataModelValidator } from '../../lib/utils/utils.index';
export class sampleRequestModel {
  constructor(
    public name: string = "",
    public email?: string,
    public password?: string,
    // public city?: string,
    // public birthdate?: Date,
    // public children?: number,
    // public isMarried?: boolean,
    // public comment?: string,
  ) { }

  getDataModel(): IDataModel {
    let fields: IDataModelField[] = [];
    let columns: IDataModelColumn[] = [];
    let validators: IDataModelValidator[] = [];

    Object.entries(this).forEach(([key, value]) => {
      let prop: string = key;
      let dataType: any = "string";
      let type: any = "text";
      let controlType: any = FormCtrlType.INPUT;
      if (prop == 'birthdate') {
        dataType = 'date';
        type = 'date'
      }
      if (prop == 'email') {
        type = 'email'
      }
      if (prop == 'password') {
        type = 'password'
      }
      if (prop == 'isMarried') {
        dataType = 'boolean';
        type = 'checkbox'
      }
      if (prop == 'children') {
        dataType = 'number';
        type = 'number'
      }
      if (prop == 'comment') {
        controlType = FormCtrlType.TEXTAREA;
      }

      fields.push({
        name: prop,
        dataType: dataType,
        label: prop.replace(/([A-Z])/g, ' $1')
          .replace(/^./, function (str) {
            return str.toUpperCase();
          }),
        controlType: controlType,
        formView: true,
        type: type,
        placeholder: "Enter a value"
      });

      columns.push({
        field: prop,
        header: prop.replace(/([A-Z])/g, ' $1')
          .replace(/^./, function (str) {
            return str.toUpperCase();
          })
      });
      if (prop == 'name') {

        validators.push({
          name: prop,
          validationRule: [
            Validators.required,
            Validators.minLength(2)
          ]
        });
      }
      if (prop == 'email') {
        validators.push({
          name: prop,
          validationRule: [
            Validators.required,
            Validators.email
          ],
        });
      }
      if (prop == 'password') {
        validators.push({
          name: prop,
          validationRule: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(9)

          ],
        });
      }
    });
    validators.forEach(c => {
      let field = fields[fields.findIndex(f => f.name == c.name)];
      if (field)
        field.isRequired = true;
    });

    return {
      fields: fields,
      columns: columns,
      formSize: "95%",
      isCenteredForm: false,
      validators: validators
    };
  }
}
