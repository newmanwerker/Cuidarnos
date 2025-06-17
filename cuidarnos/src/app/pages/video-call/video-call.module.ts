import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoCallPageRoutingModule } from './video-call-routing.module';

import { VideoCallPage } from './video-call.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoCallPageRoutingModule
  ],
  declarations: [VideoCallPage],
  providers: [InAppBrowser]
})
export class VideoCallPageModule {}
