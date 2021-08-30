import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerMenuComponent } from './organizer-menu.component';

describe('OrganizerMenuComponent', () => {
  let component: OrganizerMenuComponent;
  let fixture: ComponentFixture<OrganizerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
