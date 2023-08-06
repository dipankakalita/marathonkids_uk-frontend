import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPrivacyPolicyComponent } from './app-privacy-policy.component';

describe('AppPrivacyPolicyComponent', () => {
  let component: AppPrivacyPolicyComponent;
  let fixture: ComponentFixture<AppPrivacyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPrivacyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
