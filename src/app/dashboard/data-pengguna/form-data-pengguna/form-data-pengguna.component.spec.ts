import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataPenggunaComponent } from './form-data-pengguna.component';

describe('FormDataPenggunaComponent', () => {
  let component: FormDataPenggunaComponent;
  let fixture: ComponentFixture<FormDataPenggunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDataPenggunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataPenggunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
