import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalPenentuanRuteComponent } from './form-modal-penentuan-rute.component';

describe('FormModalPenentuanRuteComponent', () => {
  let component: FormModalPenentuanRuteComponent;
  let fixture: ComponentFixture<FormModalPenentuanRuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormModalPenentuanRuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalPenentuanRuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
