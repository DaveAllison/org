import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackUploadComponent } from './track-upload.component';

describe('TrackUploadComponent', () => {
  let component: TrackUploadComponent;
  let fixture: ComponentFixture<TrackUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
