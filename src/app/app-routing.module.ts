import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SamplePageComponent } from './pages/sample-page/sample-page.component';

const routes: Routes = [
  { path: "sample-page", component: SamplePageComponent },
  { path: "", component: SamplePageComponent, pathMatch: "full" },
  { path: "**", component: SamplePageComponent },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
