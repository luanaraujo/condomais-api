import { Usuario } from 'src/usuario/usuario.entity';
import { Token } from './token.entity';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenRepository: Repository<Token>,
    private usuarioService: UsuarioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async save(hash: string, username: string) {
    try {
      const objToken = await this.tokenRepository.findOne({
        where: { username: username },
      });

      if (objToken) {
        await this.tokenRepository.update(objToken.id, { hash: hash });
        this.logger.log(`Token atualizado para o usuário ${username}`);
      } else {
        await this.tokenRepository.insert({ hash: hash, username: username });
        this.logger.log(`Token criado para o usuário ${username}`);
      }
    } catch (error) {
      this.logger.error(
        `Erro ao salvar o token para o usuário ${username}`,
        error.stack,
      );
      throw new HttpException(
        'Erro ao salvar o token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(oldToken: string) {
    try {
      const objToken = await this.tokenRepository.findOne({
        where: { hash: oldToken },
      });

      if (objToken) {
        const usuario = await this.usuarioService.findOne(objToken.username);
        return this.authService.login(usuario);
      } else {
        throw new HttpException(
          { errorMessage: 'Token inválido' },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar o token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsuarioByToken(token: string): Promise<Usuario> {
    console.log('Token recebido:', token);
    const objToken: Token = await this.tokenRepository.findOne({
      where: { hash: token },
    });
    if (objToken) {
      const usuario = await this.usuarioService.findOne(objToken.username);
      return usuario;
    } else {
      console.log('Token não encontrado na base de dados');
      return null;
    }
  }
}
