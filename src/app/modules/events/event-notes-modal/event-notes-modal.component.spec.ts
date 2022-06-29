import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNotesModalComponent } from './event-notes-modal.component';

describe('EventNotesModalComponent', () => {
  let component: EventNotesModalComponent;
  let fixture: ComponentFixture<EventNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventNotesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
