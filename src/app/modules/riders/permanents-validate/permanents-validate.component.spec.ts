import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentsValidateComponent } from './permanents-validate.component';

describe('PermanentsValidateComponent', () => {
  let component: PermanentsValidateComponent;
  let fixture: ComponentFixture<PermanentsValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermanentsValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermanentsValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
