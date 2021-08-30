import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationLeaderMenuComponent } from './delegation-leader-menu.component';

describe('DelegationLeaderMenuComponent', () => {
  let component: DelegationLeaderMenuComponent;
  let fixture: ComponentFixture<DelegationLeaderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationLeaderMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationLeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
