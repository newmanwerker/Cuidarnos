import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPatientFilePage } from './edit-patient-file.page';

describe('EditPatientFilePage', () => {
  let component: EditPatientFilePage;
  let fixture: ComponentFixture<EditPatientFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
