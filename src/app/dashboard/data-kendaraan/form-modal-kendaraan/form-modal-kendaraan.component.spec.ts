import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalKendaraanComponent } from './form-modal-kendaraan.component';

describe('FormModalKendaraanComponent', () => {
  let component: FormModalKendaraanComponent;
  let fixture: ComponentFixture<FormModalKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormModalKendaraanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
