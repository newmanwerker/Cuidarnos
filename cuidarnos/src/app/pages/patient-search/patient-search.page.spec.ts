import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientSearchPage } from './patient-search.page';

describe('PatientSearchPage', () => {
  let component: PatientSearchPage;
  let fixture: ComponentFixture<PatientSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
