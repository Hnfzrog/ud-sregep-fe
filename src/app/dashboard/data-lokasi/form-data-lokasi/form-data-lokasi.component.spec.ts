import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataLokasiComponent } from './form-data-lokasi.component';

describe('FormDataLokasiComponent', () => {
  let component: FormDataLokasiComponent;
  let fixture: ComponentFixture<FormDataLokasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDataLokasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataLokasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
