import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsVisualizationComponent } from './medals-visualization.component';

describe('MedalsVisualizationComponent', () => {
  let component: MedalsVisualizationComponent;
  let fixture: ComponentFixture<MedalsVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedalsVisualizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
