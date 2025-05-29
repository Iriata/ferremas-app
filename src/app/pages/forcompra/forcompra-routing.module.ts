import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForcompraPage } from './forcompra.page';

const routes: Routes = [
  {
    path: '',
    component: ForcompraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForcompraPageRoutingModule {}
