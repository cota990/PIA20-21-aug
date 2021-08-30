import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredMenuComponent } from './unregistered-menu.component';

describe('UnregisteredMenuComponent', () => {
  let component: UnregisteredMenuComponent;
  let fixture: ComponentFixture<UnregisteredMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
