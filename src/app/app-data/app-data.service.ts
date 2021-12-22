import { Injectable } from "@angular/core";
import { plainToClass } from "class-transformer";
import { map } from "rxjs/operators";
import { Contact2 } from '../pages/model/responseModel';
import { AppDataResource } from "./app-data.resource";


@Injectable({ providedIn: 'root' })
export class AppDataService {
  private page = 1;
  private isLoading = false;
  public search = "";
  public sorting = 'name';
  public ordering = 'ASC';

  constructor(private _dataSrc: AppDataResource) {
  }

  loadContactData() {
    return this._dataSrc.getAll("api/contacts")
      .pipe(map((res) => {
        return plainToClass(Contact2, res, { excludeExtraneousValues: true });
      }));
  }

  loadCustomerData() {
    return this._dataSrc.getAll("api/customers")
      .pipe(map((res) => {
        return plainToClass(Contact2, res, { excludeExtraneousValues: true });
      }));
  }

}
