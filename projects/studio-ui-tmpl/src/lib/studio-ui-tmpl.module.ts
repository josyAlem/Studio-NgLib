import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmplDataGridComponent } from './data-grid/tmpl-grid';
import { TmplFormComponent } from './form/tmpl-form';
import { SharedFilterPipe } from "./pipes/shared-filter.pipe";
import { StudioAngularMaterialModule } from './studio-angular-material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StudioAngularMaterialModule
    ],
    declarations: [
        TmplFormComponent,
        TmplDataGridComponent,
        SharedFilterPipe],
    exports: [
        TmplFormComponent,
        TmplDataGridComponent,
        SharedFilterPipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class StudioUiTmplModule {


}
