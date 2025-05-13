import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterKendaraanComponent } from './cluster-kendaraan.component';

describe('ClusterKendaraanComponent', () => {
  let component: ClusterKendaraanComponent;
  let fixture: ComponentFixture<ClusterKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusterKendaraanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
