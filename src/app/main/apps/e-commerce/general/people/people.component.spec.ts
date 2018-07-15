import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxEcommercePeopleComponent } from './people.component';

describe('PxEcommercePeopleComponent', () => {
  let component: PxEcommercePeopleComponent;
  let fixture: ComponentFixture<PxEcommercePeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxEcommercePeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxEcommercePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
