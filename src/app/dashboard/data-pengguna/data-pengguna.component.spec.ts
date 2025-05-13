import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPenggunaComponent } from './data-pengguna.component';

describe('DataPenggunaComponent', () => {
  let component: DataPenggunaComponent;
  let fixture: ComponentFixture<DataPenggunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPenggunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPenggunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
