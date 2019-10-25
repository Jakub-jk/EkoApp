import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecinfoPage } from './recinfo.page';

describe('RecinfoPage', () => {
  let component: RecinfoPage;
  let fixture: ComponentFixture<RecinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
