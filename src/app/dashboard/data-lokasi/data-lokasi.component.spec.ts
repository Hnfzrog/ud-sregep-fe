import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLokasiComponent } from './data-lokasi.component';

describe('DataLokasiComponent', () => {
  let component: DataLokasiComponent;
  let fixture: ComponentFixture<DataLokasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataLokasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLokasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
