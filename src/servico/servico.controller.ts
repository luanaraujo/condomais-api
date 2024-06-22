import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { ServicoCadastrarDto } from './dto/servico.cadastrar.dto';
import { ServicoService } from './servico.service';

@Controller('servico')
export class ServicoController {
  constructor(
    private readonly servicoService: ServicoService,
    private readonly tokenService: TokenService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async listar(): Promise<any> {
    try {
      const servicos = await this.servicoService.listar();
      return servicos;
    } catch (error) {
      throw new HttpException(
        {
          errorMessage: 'Erro ao listar serviços',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  async cadastrar(
    @Body() data: ServicoCadastrarDto,
    @Req() req,
  ): Promise<ResultadoDto> {
    const token = req.headers.authorization;
    console.log('Token recebido:', token);

    if (!token) {
      throw new HttpException(
        {
          errorMessage: 'Token não fornecido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const trimmedToken = token.replace('Bearer ', '').trim();
    console.log('Token após trim:', trimmedToken);

    const usuario: Usuario =
      await this.tokenService.getUsuarioByToken(trimmedToken);
    if (usuario) {
      return this.servicoService.cadastrar(data, usuario);
    } else {
      throw new HttpException(
        {
          errorMessage: 'Token inválido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
