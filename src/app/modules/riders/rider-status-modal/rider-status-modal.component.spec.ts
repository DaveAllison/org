import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderStatusModalComponent } from './rider-status-modal.component';

describe('RiderStatusModalComponent', () => {
  let component: RiderStatusModalComponent;
  let fixture: ComponentFixture<RiderStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
