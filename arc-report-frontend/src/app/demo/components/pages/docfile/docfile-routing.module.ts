import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocfileComponent } from './docfile.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: DocfileComponent }]),
    ],
    exports: [RouterModule],
})
export class DocfileRoutingModule {}
