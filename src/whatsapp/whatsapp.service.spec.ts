import { Test, TestingModule } from '@nestjs/testing';
import { whatsAppService } from './whatsapp.service';

describe('whatsAppService', () => {
  let service: whatsAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [whatsAppService],
    }).compile();

    service = module.get<whatsAppService>(whatsAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
