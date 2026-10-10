import { Injectable, NotFoundException } from '@nestjs/common';
import { ReplaceUsuarioDto } from './dto/replace-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.interface';

@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'Jessica', edad: 19 },
    { id: 2, nombre: 'Diego', edad: 20 },
  ];

  findAll(): Usuario[] {
    return this.usuarios.map((usuario) => ({ ...usuario }));
  }

  private findIndex(id: number): number {
    const index = this.usuarios.findIndex((usuario) => usuario.id === id);
    if (index === -1) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return index;
  }

  replace(id: number, dto: ReplaceUsuarioDto): Usuario {
    const index = this.findIndex(id);
    this.usuarios[index] = { id, nombre: dto.nombre, edad: dto.edad };
    return { ...this.usuarios[index] };
  }

  update(id: number, dto: UpdateUsuarioDto): Usuario {
    const index = this.findIndex(id);
    if (dto.nombre !== undefined) this.usuarios[index].nombre = dto.nombre;
    if (dto.edad !== undefined) this.usuarios[index].edad = dto.edad;
    return { ...this.usuarios[index] };
  }

  remove(id: number): string {
    this.usuarios.splice(this.findIndex(id), 1);
    return `Usuario #${id} eliminado`;
  }
}
