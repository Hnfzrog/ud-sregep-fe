import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPengepulComponent } from './daily-pengepul.component';

describe('DailyPengepulComponent', () => {
  let component: DailyPengepulComponent;
  let fixture: ComponentFixture<DailyPengepulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyPengepulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPengepulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
