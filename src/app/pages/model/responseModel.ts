import { Expose, Type } from "class-transformer";

export class Contact {
  @Expose()
  public id: number = 0;
  @Expose()
  public name: string = "";
  @Expose()
  public email: string = "";
  @Expose()
  public sex: string = "";
  @Expose()
  @Type(() => Date)
  public birthdate: Date = new Date();
  @Expose()
  public phoneNumber: string = "";
  @Expose()
  public address: string = "";
  @Expose()
  public city: string = "";
  @Expose()
  public country: string = "";
  @Expose()
  public favorite: boolean = false;
}
export class Customer {
  @Expose()
  public id: number = 0;
  @Expose()
  public name: string = "";
  @Expose()
  public email: string = "";
  @Expose()
  public sex: string = "";
  @Expose()
  @Type(() => Date)
  public birthdate: Date = new Date();
  @Expose()
  public phoneNumber: string = "";
  @Expose()
  public address: string = "";
  @Expose()
  public city: string = "";
  @Expose()
  public country: string = "";
  @Expose()
  public favorite: boolean = false;
}


