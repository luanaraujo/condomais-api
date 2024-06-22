import { DataSource } from 'typeorm';
import { Servico } from './servico.entity';

export const servicoProviders = [
  {
    provide: 'SERVICO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Servico),
    inject: ['DATA_SOURCE'],
  },
];
