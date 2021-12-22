import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StudioUiTmplModule } from "../../../projects/studio-ui-tmpl/src/public-api";
import { AngularMaterialModule } from "../angular-material.module";
import { SamplePageComponent } from './sample-page/sample-page.component';

@NgModule({
  declarations: [

    SamplePageComponent
  ],
  imports: [
    StudioUiTmplModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class PagesModule { }
