import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForcompraPageRoutingModule } from './forcompra-routing.module';

import { ForcompraPage } from './forcompra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForcompraPageRoutingModule
  ],
  declarations: [ForcompraPage]
})
export class ForcompraPageModule {}
