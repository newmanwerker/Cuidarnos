import { Component, type OnInit } from "@angular/core"

@Component({
  selector: "app-accessibility",
  templateUrl: "./accessibility.page.html",
  styleUrls: ["./accessibility.page.scss"],
  standalone: false,
})
export class AccessibilityPage implements OnInit {
  fontSize = 100
  highContrast = false
  isChangingSize = false

  constructor() {}

  ngOnInit() {
    // Load saved preferences
    this.loadAccessibilitySettings()
  }

  increaseFontSize() {
    if (this.fontSize < 150) {
      this.fontSize += 10
      this.triggerSizeChangeAnimation()
      this.saveAccessibilitySettings()
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 80) {
      this.fontSize -= 10
      this.triggerSizeChangeAnimation()
      this.saveAccessibilitySettings()
    }
  }

  // FIXED: Use ionChange event instead of ngModel
  onToggleChange(event: any) {
    this.highContrast = event.detail.checked
    this.saveAccessibilitySettings()

    // Apply high contrast to document body
    if (this.highContrast) {
      document.body.classList.add("high-contrast")
    } else {
      document.body.classList.remove("high-contrast")
    }
  }

  private triggerSizeChangeAnimation() {
    this.isChangingSize = true
    setTimeout(() => {
      this.isChangingSize = false
    }, 300)
  }

  private saveAccessibilitySettings() {
    const settings = {
      fontSize: this.fontSize,
      highContrast: this.highContrast,
    }
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
  }

  private loadAccessibilitySettings() {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      this.fontSize = settings.fontSize || 100
      this.highContrast = settings.highContrast || false

      // Apply high contrast if it was previously enabled
      if (this.highContrast) {
        document.body.classList.add("high-contrast")
      }
    }
  }
}

export default AccessibilityPage
