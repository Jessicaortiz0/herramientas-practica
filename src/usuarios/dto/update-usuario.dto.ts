import { IsInt, IsNotEmpty, IsString, Matches, Min, ValidateIf } from 'class-validator';

export class UpdateUsuarioDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'nombre debe contener al menos un carácter no vacío' })
  nombre?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  edad?: number;
}
