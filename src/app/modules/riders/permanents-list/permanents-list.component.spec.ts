import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentsListComponent } from './permanents-list.component';

describe('PermanentsListComponent', () => {
  let component: PermanentsListComponent;
  let fixture: ComponentFixture<PermanentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermanentsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermanentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
