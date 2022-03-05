import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersDiyComponent } from './riders-diy.component';

describe('RidersDiyComponent', () => {
  let component: RidersDiyComponent;
  let fixture: ComponentFixture<RidersDiyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidersDiyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersDiyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
