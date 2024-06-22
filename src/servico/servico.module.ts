import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ServicoController } from './servico.controller';
import { servicoProviders } from './servico.providers';
import { ServicoService } from './servico.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [ServicoController],
  providers: [...servicoProviders, ServicoService],
  exports: [ServicoService],
})
export class ServicoModule {}
