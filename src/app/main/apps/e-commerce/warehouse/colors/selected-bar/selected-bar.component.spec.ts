import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectedBarComponent } from './selected-bar.component';

describe('ColorSelectedBarComponent', () => {
  let component: ColorSelectedBarComponent;
  let fixture: ComponentFixture<ColorSelectedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSelectedBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSelectedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
