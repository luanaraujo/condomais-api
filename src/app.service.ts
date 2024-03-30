import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getObject(): any {
    const objeto = {
      id: 1,
      nome: 'Luan',
    };
    return objeto;
  }
}
