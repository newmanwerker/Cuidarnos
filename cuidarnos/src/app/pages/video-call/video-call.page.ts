import { Component, OnInit } from '@angular/core';

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
    const res = await fetch('/api/create-whereby-room', {
      method: 'POST'
    });

    const data = await res.json();
    this.wherebyRoomUrl = data.roomUrl;
  } catch (err) {
    console.error('Error al obtener sala desde backend:', err);
  }
}
}
