import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LabaComponent } from './laba.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: LabaComponent }])],
    exports: [RouterModule],
})
export class LabaRoutingModule {}
