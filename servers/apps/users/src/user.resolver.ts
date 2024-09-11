import { BadRequestException, UseFilters } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from "./users.service";
import { ActivationResponse, LoginResponse, RegisterResponse } from "./types/user.types";
import { ActivationDto, RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { Response } from "express";
@Resolver('User')
export class UsersResolver {
    constructor(
        private readonly userService: UsersService
    ) {}

    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() ctx: { res: Response }
    ): Promise<RegisterResponse> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException("Please fill all the fields")
        }

        const { activationToken } = await this.userService.register(registerDto, ctx.res)
        console.log(activationToken.token)
        return {
            activationToken: activationToken.token,

        }

    }

    @Mutation(() => ActivationResponse)
    async activateUser(
        @Args("activationInput") activationDto: ActivationDto,
        @Context() ctx: { res: Response }
    ): Promise<ActivationResponse> {
        return await this.userService.activateUser(activationDto, ctx.res);


    }

    @Mutation(() => LoginResponse)
    async login(
        @Args("email") email: string,
        @Args("password") password: string
    ): Promise<LoginResponse> {
        return await this.userService.login({
            email,
            password
        })


    }

    @Query(() => [User])
    async getUsers() {
        return this.userService.getUsers();
    }
}