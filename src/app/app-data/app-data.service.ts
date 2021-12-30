import { Injectable } from "@angular/core";
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
    return this._dataSrc.getAll("api/contacts");
    // .pipe(map((res) => {
    //   return plainToClass(Contact, res, { excludeExtraneousValues: true });
    // }));
  }

  loadCustomerData() {
    return this._dataSrc.getAll("api/customers");
    // .pipe(map((res) => {
    //   return plainToClass(Customer, res, { excludeExtraneousValues: true });
    // }));
  }

}
