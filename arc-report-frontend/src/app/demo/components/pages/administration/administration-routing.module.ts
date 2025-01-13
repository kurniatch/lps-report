import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AdministrationComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class AdministrationRoutingModule {}
