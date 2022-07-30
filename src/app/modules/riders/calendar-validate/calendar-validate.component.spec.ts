import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarValidateComponent } from './calendar-validate.component';

describe('CalendarValidateComponent', () => {
  let component: CalendarValidateComponent;
  let fixture: ComponentFixture<CalendarValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
