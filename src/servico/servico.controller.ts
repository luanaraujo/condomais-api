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
import { ServicoService } from './servico.service';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { ServicoCadastrarDto } from './dto/servico.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';

@Controller('servico')
export class ServicoController {
  constructor(
    private readonly servicoService: ServicoService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listar(@Req() req): Promise<any> {
    const token = req.headers.authorization;
    if (!token) {
      throw new HttpException('Token não fornecido', HttpStatus.UNAUTHORIZED);
    }
    const trimmedToken = token.replace('Bearer ', '').trim();
    const usuario: Usuario =
      await this.tokenService.getUsuarioByToken(trimmedToken);

    if (!usuario) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    try {
      const servicos = await this.servicoService.listar(usuario.id);
      return servicos;
    } catch (error) {
      throw new HttpException(
        'Erro ao listar serviços',
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
    if (!token) {
      throw new HttpException('Token não fornecido', HttpStatus.UNAUTHORIZED);
    }

    const trimmedToken = token.replace('Bearer ', '').trim();
    const usuario: Usuario =
      await this.tokenService.getUsuarioByToken(trimmedToken);

    if (!usuario) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    return this.servicoService.cadastrar(data, usuario);
  }
}
