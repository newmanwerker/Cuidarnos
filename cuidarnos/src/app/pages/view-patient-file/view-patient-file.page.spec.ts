import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPatientFilePage } from './view-patient-file.page';

describe('ViewPatientFilePage', () => {
  let component: ViewPatientFilePage;
  let fixture: ComponentFixture<ViewPatientFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
