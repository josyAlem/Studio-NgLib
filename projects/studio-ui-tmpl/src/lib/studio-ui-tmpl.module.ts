import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudioUiFilterPipe } from './pipes/pipes.index';
import { StudioAngularMaterialModule } from './studio-angular-material.module';
import { TmplDataGridComponent, TmplFormComponent } from './templates/templates.index';

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
        StudioUiFilterPipe
    ],
    exports: [
        TmplFormComponent,
        TmplDataGridComponent,
        StudioUiFilterPipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class StudioUiTmplModule {


}
