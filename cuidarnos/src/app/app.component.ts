import { Component } from '@angular/core';
import { Camera, CameraPermissionType, PermissionStatus } from '@capacitor/camera';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}
  async requestCameraPermission() {
  // Pide permiso de cámara
  const status: PermissionStatus = await Camera.requestPermissions();
  if (status.camera === 'granted') {
    console.log('Cámara permitida');
  } else {
    console.warn('Permiso de cámara denegado');
  }
}

async requestMicrophonePermission() {
  try {
    // Esto lanzará el prompt de micrófono
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Micrófono permitido');
  } catch (err) {
    console.error('Permiso de micrófono denegado:', err);
  }
}
}
