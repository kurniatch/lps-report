import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScvComponent } from './scv.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ScvComponent }])],
    exports: [RouterModule],
})
export class ScvRoutingModule {}
