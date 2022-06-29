import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClashModalComponent } from './event-clash-modal.component';

describe('EventClashModalComponent', () => {
  let component: EventClashModalComponent;
  let fixture: ComponentFixture<EventClashModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClashModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
