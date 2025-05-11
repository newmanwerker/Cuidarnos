import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.page.html',
  styleUrls: ['./accessibility.page.scss'],
  standalone: false
})
export class AccessibilityPage implements OnInit {
  fontSize: number = 100;
  highContrast: boolean = false;
  
  constructor() { }

  ngOnInit() { }
  
  increaseFontSize() {
    if (this.fontSize < 150) {
      this.fontSize += 10;
    }
  }
  
  decreaseFontSize() {
    if (this.fontSize > 80) {
      this.fontSize -= 10;
    }
  }
  
  toggleHighContrast() {
    this.highContrast = !this.highContrast;
  }
}