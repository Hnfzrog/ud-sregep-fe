import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalRuteComponent } from './final-rute.component';

describe('FinalRuteComponent', () => {
  let component: FinalRuteComponent;
  let fixture: ComponentFixture<FinalRuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalRuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalRuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
