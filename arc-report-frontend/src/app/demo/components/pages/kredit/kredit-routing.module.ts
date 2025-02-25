import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KreditComponent } from './kredit.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: KreditComponent }])],
    exports: [RouterModule],
})
export class KreditRoutingModule {}
