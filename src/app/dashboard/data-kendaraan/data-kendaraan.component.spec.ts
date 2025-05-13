import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataKendaraanComponent } from './data-kendaraan.component';

describe('DataKendaraanComponent', () => {
  let component: DataKendaraanComponent;
  let fixture: ComponentFixture<DataKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataKendaraanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
