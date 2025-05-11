import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalFilePage } from './medical-file.page';

describe('MedicalFilePage', () => {
  let component: MedicalFilePage;
  let fixture: ComponentFixture<MedicalFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
