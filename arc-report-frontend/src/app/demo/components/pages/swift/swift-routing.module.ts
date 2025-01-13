import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwiftComponent } from './swift.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: SwiftComponent }])],
    exports: [RouterModule],
})
export class SwiftRoutingModule {}
