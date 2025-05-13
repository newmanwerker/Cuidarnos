import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoCallPageRoutingModule } from './video-call-routing.module';

import { VideoCallPage } from './video-call.page';

import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoCallPageRoutingModule
  ],
  declarations: [VideoCallPage,SafeUrlPipe],
  
})
export class VideoCallPageModule {}
