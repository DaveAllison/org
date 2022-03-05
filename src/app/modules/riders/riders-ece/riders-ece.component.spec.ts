import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersEceComponent } from './riders-ece.component';

describe('RidersEceComponent', () => {
  let component: RidersEceComponent;
  let fixture: ComponentFixture<RidersEceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidersEceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersEceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
