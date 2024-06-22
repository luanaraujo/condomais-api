import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';
import { UsuarioCadastrarDto } from './dto/usuario.create.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPerfil(@Request() req): Promise<any> {
    try {
      const userId = req.user.userId; // Correção aqui
      console.log('ID do usuário autenticado:', userId); // Adicione este log
      const usuario = await this.usuarioService.findById(userId);
      console.log('Dados do usuário encontrados:', usuario); // Adicione este log
      return usuario;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error.message); // Adicione este log
      throw new HttpException(
        {
          errorMessage: 'Erro ao buscar perfil do usuário',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    return this.authService.login(req.user);
  }

  @Post('login-token')
  async loginToken(@Request() req, @Body() data) {
    return this.authService.loginToken(data.token);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async atualizarPerfil(
    @Request() req,
    @Body() body: { nome: string; email: string },
  ): Promise<any> {
    try {
      const userId = req.user.userId; // Correção aqui
      const result = await this.usuarioService.atualizarPerfil(userId, body);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          errorMessage: 'Erro ao atualizar perfil do usuário',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
