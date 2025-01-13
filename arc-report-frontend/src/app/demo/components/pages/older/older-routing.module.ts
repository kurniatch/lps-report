import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OlderComponent } from './older.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: OlderComponent }])],
    exports: [RouterModule],
})
export class OlderRoutingModule {}
