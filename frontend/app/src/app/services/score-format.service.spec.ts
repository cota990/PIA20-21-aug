import { TestBed } from '@angular/core/testing';

import { ScoreFormatService } from './score-format.service';

describe('ScoreFormatService', () => {
  let service: ScoreFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
