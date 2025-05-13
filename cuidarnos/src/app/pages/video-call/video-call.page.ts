import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
  standalone: false
})
export class VideoCallPage implements OnInit {
  wherebyRoomUrl: string | null = null;

  async ngOnInit() {
    await this.createWherebyRoom();
  }

  async createWherebyRoom() {
    try {
      const isNative = Capacitor.isNativePlatform();
      const apiBase = isNative ? 'http://192.168.1.86:3000' : ''; // reemplaza con tu IP real local

      const res = await fetch(`${apiBase}/api/create-whereby-room`, {
        method: 'POST'
      });

      const data = await res.json();
      this.wherebyRoomUrl = data.roomUrl;
    } catch (err) {
      console.error('Error al obtener sala desde backend:', err);
    }
  }
}
