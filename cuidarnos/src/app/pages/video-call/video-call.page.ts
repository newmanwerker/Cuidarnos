import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
  standalone: false
})
export class VideoCallPage implements OnInit {
  loading: boolean = true;
  error: boolean = false;
  videoUrl: SafeResourceUrl = '';
  isMobile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private iab: InAppBrowser,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const url = params['url'];
      this.isMobile = this.platform.is('capacitor');

      console.log('🔗 URL recibida:', url);
      console.log('📱 Es móvil:', this.isMobile);

      if (url) {
        if (this.isMobile) {
          this.videoUrl = url;
          this.openInApp(); // Abre en navegador del sistema (no WebView)
        } else {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.loading = false;
        }
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  openInApp() {
    const browser = this.iab.create(this.videoUrl as string, '_system', {
      location: 'no',
      zoom: 'no'
    });
    browser.show();
  }
}
