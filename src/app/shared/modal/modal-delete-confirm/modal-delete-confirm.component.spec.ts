import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteConfirmComponent } from './modal-delete-confirm.component';

describe('ModalDeleteConfirmComponent', () => {
  let component: ModalDeleteConfirmComponent;
  let fixture: ComponentFixture<ModalDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
