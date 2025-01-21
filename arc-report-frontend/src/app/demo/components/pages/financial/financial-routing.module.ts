import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FinancialComponent } from './financial.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FinancialComponent }
	])],
	exports: [RouterModule]
})
export class FinancialRoutingModule { }
