import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersAaaComponent } from './riders-aaa.component';

describe('RidersAaaComponent', () => {
  let component: RidersAaaComponent;
  let fixture: ComponentFixture<RidersAaaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidersAaaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersAaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
