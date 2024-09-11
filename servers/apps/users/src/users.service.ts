import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { Response } from 'express';
import * as bcrpyt from 'bcrypt'
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData {
  phone_number:string;
  name:string;
  password:string;
  email:string;
  address?:string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService:ConfigService,
    private readonly emailService:EmailService
  ) {}

  async register(registerDto:RegisterDto,response:Response) {
    const { email,name,password,phone_number,address } = registerDto;

    const isEmailExist = await this.prisma.user.findUnique({
      where:{
        email
      }
    });
    if(isEmailExist) {
      throw new BadRequestException("User already exist with this email")
    }
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where:{
        phone_number
      }
    });
    if(isPhoneNumberExist) {
      throw new BadRequestException("Phone number's already been used")
    }

    const hashedPassword = await bcrpyt.hash(password,10)
    const user = {
      email,
      name,
      password:hashedPassword,
      phone_number,
      address,

    }

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject:"Activate your account!",
      template:"./activation-mail",
      name,
      activationCode
    })
    // const user = await this.prisma.user.create({
    //   data:userData
    // });
    return {
      activationToken,
      response
    }
  }

  async createActivationToken(user:UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode
      },{
        secret:this.configService.get<string>("JWT_SECRET")
      }
    )

    return { token,activationCode }
  }

  async activateUser(activationDto:ActivationDto,res:Response) {
    const {activationCode,activationToken } = activationDto

    const newUser:{ user:UserData, activationCode:string}  = this.jwtService.verify(activationToken,{secret:this.configService.get<string>("JWT_SECRET")});
    if(newUser.activationCode !== activationCode) {
      throw new BadRequestException("Invalid activation code")
    } 
    const { name,email,password,phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where:{
        email
      }
    });

    if(existUser) {
      throw new BadRequestException("User already exist with this email!")
    }

    const user = await this.prisma.user.create({
      data:{
        name,
        email,
        password,
        phone_number
      }
    })

    return { user }
  }
  async login(loginDto:LoginDto) {
    const { email,password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where:{
        email
      }
    });

    if(user && await bcrpyt.compare(password,user.password)) {
      const tokenSender = new TokenSender(this.configService,this.jwtService);
      return tokenSender.sendToken(user);

    } else {
      throw new BadRequestException("Invalid credentials!")
    }

  }

  async getUsers() {
      return await this.prisma
  }
} 
