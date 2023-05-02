import { IsNotEmpty, ValidateNested, IsNumber, IsString, MinLength, MaxLength, IsPositive, ArrayMinSize, IsObject, IsNotEmptyObject } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    readonly name : string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    readonly job : string;

}