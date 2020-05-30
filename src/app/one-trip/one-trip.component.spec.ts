import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTripComponent } from './one-trip.component';

describe('OneTripComponent', () => {
  let component: OneTripComponent;
  let fixture: ComponentFixture<OneTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
