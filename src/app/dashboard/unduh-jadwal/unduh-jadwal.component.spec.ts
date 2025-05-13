import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnduhJadwalComponent } from './unduh-jadwal.component';

describe('UnduhJadwalComponent', () => {
  let component: UnduhJadwalComponent;
  let fixture: ComponentFixture<UnduhJadwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnduhJadwalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnduhJadwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
