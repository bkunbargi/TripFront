import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmodalComponent } from './costmodal.component';

describe('CostmodalComponent', () => {
  let component: CostmodalComponent;
  let fixture: ComponentFixture<CostmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
