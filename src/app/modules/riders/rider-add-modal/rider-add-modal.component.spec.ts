import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderAddModalComponent } from './rider-add-modal.component';

describe('RiderAddModalComponent', () => {
  let component: RiderAddModalComponent;
  let fixture: ComponentFixture<RiderAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
