import { InMemoryDbService } from 'angular-in-memory-web-api';
import contactDb from "../../assets/app-data-contacts.json";
import customerDb from "../../assets/app-data-customers.json";
export class AppData implements InMemoryDbService {

  createDb() {
    return {
      contacts: contactDb,
      customers: customerDb
    };
  }

}
