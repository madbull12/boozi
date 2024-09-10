import { BadRequestException, UseFilters } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from "./users.service";
import { RegisterResponse } from "./types/user.types";
import { RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { Response } from "express";
@Resolver('User')
export class UsersResolver {
    constructor(
        private readonly userService: UsersService
    ) {}

    @Mutation(()=>RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() ctx: { res:Response }
    ) : Promise<RegisterResponse> {
        if(!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException("Please fill all the fields")
        }

       return await this.userService.register(registerDto,ctx.res)
      
    }

    @Query(()=>[User])
    async getUsers() {
        return this.userService.getUsers();
    }
}