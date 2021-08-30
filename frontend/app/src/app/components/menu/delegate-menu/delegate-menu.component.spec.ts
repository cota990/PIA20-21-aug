import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateMenuComponent } from './delegate-menu.component';

describe('DelegateMenuComponent', () => {
  let component: DelegateMenuComponent;
  let fixture: ComponentFixture<DelegateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
