import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/usuario.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
  ) {}

  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioService.findOne(email);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaCorreta = bcrypt.compareSync(senha, usuario.password);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = usuario;
    return result;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' }); // Ajustado expiração para 1 hora
    await this.tokenService.save(token, user.email); // Salva o token no banco de dados
    return { access_token: token };
  }

  async loginToken(token: string) {
    const usuario: Usuario = await this.tokenService.getUsuarioByToken(token);
    if (usuario) {
      return this.login(usuario);
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
