import { Test, TestingModule } from '@nestjs/testing';
import { OmdbService } from './omdb.service';

describe('OmdbService', () => {
  let service: OmdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmdbService],
    }).compile();

    service = module.get<OmdbService>(OmdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
