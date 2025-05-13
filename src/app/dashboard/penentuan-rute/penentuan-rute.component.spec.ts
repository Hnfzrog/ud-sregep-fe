import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenentuanRuteComponent } from './penentuan-rute.component';

describe('PenentuanRuteComponent', () => {
  let component: PenentuanRuteComponent;
  let fixture: ComponentFixture<PenentuanRuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenentuanRuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenentuanRuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
