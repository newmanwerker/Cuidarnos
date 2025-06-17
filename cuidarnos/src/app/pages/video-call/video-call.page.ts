import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
  standalone: false
})
export class VideoCallPage implements OnInit {
  videoUrl: SafeResourceUrl | null = null;
  loading = true;
  error = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // 1️⃣ Primero intentamos obtener desde localStorage
    const storedLink = localStorage.getItem('videocallLink');

    if (storedLink) {
      this.setVideoUrl(storedLink);
      return;
    }

    // 2️⃣ Si no hay en localStorage, obtenemos desde ficha
    const stored = localStorage.getItem('userData');
    const id = stored ? JSON.parse(stored).paciente?.id : null;

    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.http.get<any>(`https://cuidarnos.up.railway.app/api/pacientes/${id}/ficha-completa`)
      .subscribe({
        next: (res) => {
          const link = res.consulta_pendiente?.link_sala_paciente;
          if (link) {
            this.setVideoUrl(link);
          } else {
            this.error = true;
          }
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  setVideoUrl(link: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    this.loading = false;
  }
}
