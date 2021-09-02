import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionParticipantsComponent } from './competition-participants.component';

describe('CompetitionParticipantsComponent', () => {
  let component: CompetitionParticipantsComponent;
  let fixture: ComponentFixture<CompetitionParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitionParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
