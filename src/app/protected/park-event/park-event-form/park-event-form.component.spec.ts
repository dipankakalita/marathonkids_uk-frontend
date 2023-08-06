import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkEventFormComponent } from './park-event-form.component';

describe('ParkEventFormComponent', () => {
  let component: ParkEventFormComponent;
  let fixture: ComponentFixture<ParkEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
