import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingletripComponent } from './singletrip.component';

describe('SingletripComponent', () => {
  let component: SingletripComponent;
  let fixture: ComponentFixture<SingletripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingletripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingletripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
