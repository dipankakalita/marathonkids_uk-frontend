import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkEventComponent } from './park-event.component';

describe('ParkEventComponent', () => {
  let component: ParkEventComponent;
  let fixture: ComponentFixture<ParkEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
