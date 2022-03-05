import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AukloginComponent } from './auklogin.component';

describe('AukloginComponent', () => {
  let component: AukloginComponent;
  let fixture: ComponentFixture<AukloginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AukloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AukloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
