import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class ReplaceUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'nombre debe contener al menos un carácter no vacío' })
  nombre!: string;

  @IsInt()
  @Min(0)
  edad!: number;
}
