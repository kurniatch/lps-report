import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeracaComponent } from './neraca.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: NeracaComponent }])],
    exports: [RouterModule],
})
export class NeracaRoutingModule {}
