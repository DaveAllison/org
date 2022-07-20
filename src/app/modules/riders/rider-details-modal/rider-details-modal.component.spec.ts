import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderDetailsModalComponent } from './rider-details-modal.component';

describe('RiderDetailsModalComponent', () => {
  let component: RiderDetailsModalComponent;
  let fixture: ComponentFixture<RiderDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
