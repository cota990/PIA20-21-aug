import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationLeaderComponent } from './delegation-leader.component';

describe('DelegationLeaderComponent', () => {
  let component: DelegationLeaderComponent;
  let fixture: ComponentFixture<DelegationLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationLeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
