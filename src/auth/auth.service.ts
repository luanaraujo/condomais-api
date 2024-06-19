import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usuarioService: UsuarioService) {}

  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioService.findOne(email);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaCorreta = bcrypt.compareSync(senha, usuario.password);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const { password, ...result } = usuario;
    return result;
  }
}
