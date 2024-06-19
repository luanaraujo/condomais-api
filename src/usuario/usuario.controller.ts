import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioCadastrarDto } from './dto/usuario.create.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async listar(): Promise<Usuario[]> {
    return this.usuarioService.listar();
  }

  @Post()
  async cadastrar(@Body() data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    try {
      const resultado = await this.usuarioService.cadastrar(data);
      return resultado;
    } catch (error) {
      throw new HttpException(
        'Erro interno ao processar o cadastro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
