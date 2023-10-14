import { Test, TestingModule } from '@nestjs/testing';
import { MailResolver } from './mail.resolver';
import { MailService } from './mail.service';

describe('MailResolver', () => {
  let resolver: MailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailResolver, MailService],
    }).compile();

    resolver = module.get<MailResolver>(MailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
