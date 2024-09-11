import { InputType, Field } from "@nestjs/graphql";
import { IsEmail,  IsNotEmpty,IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({
        message:"Name is required."
    })
    @IsString({
        message:"Name must need to be a string"
    })
    name:string;

    @Field()
    @IsNotEmpty({
        message:"Password is required"
    })
    @MinLength(8,{message:"Password must be at least 8 characters"})
    password:string;

    @Field()
    @IsNotEmpty({
        message:"Email is required"
    })  
    @IsEmail({},{ message:"Email is invalid"})
    email: string;

    @Field()
    @IsNotEmpty({
        message:"Phone Number is required"
    })  
    phone_number:string;

    @Field({nullable:true})

    address:string;

}

@InputType()
export class ActivationDto {
    @Field()
    @IsNotEmpty({
        message:"Activation code is required."
    })
    activationCode:string;
    @Field()
    @IsNotEmpty({
        message:"Activation token is required."
    })
    activationToken:string;
}

@InputType()
export class LoginDto {
    @Field()
    @IsNotEmpty({
        message:"Name is required."
    })
    @IsString({
        message:"Name must need to be a string"
    })
    name:string;

    @Field()
    @IsNotEmpty({
        message:"Password is required"
    })
    @MinLength(8,{message:"Password must be at least 8 characters"})
    password:string;

    @Field()
    @IsNotEmpty({
        message:"Email is required"
    })  
    @IsEmail({},{ message:"Email is invalid"})
    email: string;
}
