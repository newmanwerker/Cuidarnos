// src/app/services/api-base.ts
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const isAndroid = Capacitor.getPlatform() === 'android';

export const API_BASE = isNative
  ? 'http://192.168.1.86:3000' // ← tu IP local real
  : '';
