import { TestBed } from '@angular/core/testing';

import { ColadosService } from './colados.service';

describe('ColadosService', () => {
  let service: ColadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
