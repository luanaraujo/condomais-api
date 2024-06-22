import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Servico } from './servico.entity';
import { ServicoCadastrarDto } from './dto/servico.cadastrar.dto';
import { Usuario } from 'src/usuario/usuario.entity';
import { ResultadoDto } from 'src/dto/resultado.dto';

@Injectable()
export class ServicoService {
  constructor(
    @Inject('SERVICO_REPOSITORY')
    private servicoRepository: Repository<Servico>,
  ) {}

  async cadastrar(
    data: ServicoCadastrarDto,
    usuario: Usuario,
  ): Promise<ResultadoDto> {
    const servico = new Servico();
    servico.titulo = data.titulo;
    servico.descricao = data.descricao;
    servico.usuario = usuario;
    return this.servicoRepository
      .save(servico)
      .then(() => {
        return <ResultadoDto>{
          status: true,
          mensagem: 'Lembrete cadastrado com sucesso',
        };
      })
      .catch(() => {
        return <ResultadoDto>{
          status: false,
          mensagem: 'Houve um erro ao cadastrar o lembrete',
        };
      });
  }

  async listar(usuarioId: number): Promise<Servico[]> {
    return this.servicoRepository.find({
      where: { usuario: { id: usuarioId } },
    });
  }
}
