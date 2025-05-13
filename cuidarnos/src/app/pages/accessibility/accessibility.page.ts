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

 ngOnInit() {
    const savedContrast = localStorage.getItem('highContrast');
    this.highContrast = savedContrast === 'true';
    this.applyContrast();

  
  const savedFontSize = localStorage.getItem('appFontSize');
  if (savedFontSize) {
    this.fontSize = parseInt(savedFontSize, 10);
    document.documentElement.style.setProperty('--app-font-size', `${this.fontSize}%`);
  }
  
}

increaseFontSize() {
  if (this.fontSize < 150) {
    this.fontSize += 10;
    this.applyFontSize();
  }
}

decreaseFontSize() {
  if (this.fontSize > 80) {
    this.fontSize -= 10;
    this.applyFontSize();
  }
}

applyFontSize() {
  localStorage.setItem('appFontSize', this.fontSize.toString());
  document.documentElement.style.setProperty('--app-font-size', `${this.fontSize}%`);
}
  
  toggleHighContrast() {

    localStorage.setItem('highContrast', this.highContrast.toString());
    this.applyContrast();


  }

    private applyContrast() {
    if (this.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }
}