import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    gateway:{
      supergraphSdl:new IntrospectAndCompose({
        subgraphs:[]
      })
    }
  }),],
  providers: [AppService],
})
export class AppModule { }
