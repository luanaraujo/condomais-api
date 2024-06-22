import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.create.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async listar(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async cadastrar(data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    // Verificar se o CPF já está cadastrado
    const cpfExistente = await this.usuarioRepository.findOne({
      where: { cpf: data.cpf },
    });
    if (cpfExistente) {
      this.logger.error(
        `Tentativa de cadastro com CPF já existente: ${data.cpf}`,
      );
      return {
        status: false,
        mensagem: 'CPF já cadastrado',
      };
    }

    // Caso o CPF não esteja cadastrado, procede com o cadastro
    const usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.nome;
    usuario.password = bcrypt.hashSync(data.senha, 8);
    usuario.telefone = data.telefone;
    usuario.cpf = data.cpf;

    try {
      this.logger.log('Tentando salvar o usuário:', usuario);
      await this.usuarioRepository.save(usuario);
      this.logger.log('Usuário salvo com sucesso');
      return {
        status: true,
        mensagem: 'Usuário cadastrado com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao salvar o usuário:', error);
      return {
        status: false,
        mensagem: 'Houve um erro ao cadastrar o usuário',
      };
    }
  }

  async findById(id: number): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { id: id } }); // Aqui passamos apenas o ID como argumento
  }

  async findOne(email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { email: email } });
  }
  async atualizarPerfil(
    userId: number,
    { nome, email },
  ): Promise<ResultadoDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: userId },
      });
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      usuario.nome = nome;
      usuario.email = email;

      await this.usuarioRepository.save(usuario);
      return {
        status: true,
        mensagem: 'Perfil atualizado com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro ao atualizar perfil:', error);
      return {
        status: false,
        mensagem: 'Houve um erro ao atualizar o perfil do usuário',
      };
    }
  }
}
