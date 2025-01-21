import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LctComponent } from './lct.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: LctComponent }]),
    ],
    exports: [RouterModule],
})
export class LctRoutingModule {}
