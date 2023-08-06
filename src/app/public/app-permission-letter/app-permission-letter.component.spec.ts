import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPermissionLetterComponent } from './app-permission-letter.component';

describe('AppPermissionLetterComponent', () => {
  let component: AppPermissionLetterComponent;
  let fixture: ComponentFixture<AppPermissionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPermissionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPermissionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
