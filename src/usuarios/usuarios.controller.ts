import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put } from '@nestjs/common';
import { ReplaceUsuarioDto } from './dto/replace-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.interface';

@Controller('Usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(): Usuario[] { return this.usuariosService.findAll(); }

  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @Body() dto: ReplaceUsuarioDto): Usuario {
    return this.usuariosService.replace(id, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto): Usuario {
    return this.usuariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): string {
    return this.usuariosService.remove(id);
  }
}
