import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsCountComponent } from './medals-count.component';

describe('MedalsCountComponent', () => {
  let component: MedalsCountComponent;
  let fixture: ComponentFixture<MedalsCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedalsCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
