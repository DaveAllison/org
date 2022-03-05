import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgAdminModalComponent } from './org-admin-modal.component';

describe('OrgAdminModalComponent', () => {
  let component: OrgAdminModalComponent;
  let fixture: ComponentFixture<OrgAdminModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgAdminModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgAdminModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
