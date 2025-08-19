import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { session } from 'telegraf';
import { ISessionData } from './helpers/sesion';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    BotModule,
    TelegrafModule.forRoot({
      token: String(process.env.BOT_TOKEN),
      middlewares: [
        session({
          defaultSession: (): ISessionData => ({
            formData: {
              fullName: null,
              age: null,
              tel_1: null,
              tel_2: null,
              username: null,
              addres_doyimiy: null,
              addres_hozir: null,
              universitet: null,
              yonalish: null,
              daraja: null,
              portfoly_link: null,
              rezumey_link: null,
              ish_holati: null,
              till: null,
            },
            IsUpdate: {
              telefon_1: null,
              telefon_2: null,
              daraja: null,
              portfoly: null,
              rezyumey: null,
              ish_holati: null,
              universitet: null,
              home_1: null,
              home_2: null,
              age: null,
              ism: null,
              yonalish: null,
              til: null,
              AA: null,
            },
            Update: {
              telefon_1: null,
              telefon_2: null,
              daraja: null,
              portfoly: null,
              rezyumey: null,
              ish_holati: null,
              universitet: null,
              home_1: null,
              home_2: null,
              age: null,
              ism: null,
              yonalish: null,
              til: null,
            },
            IsData: {
              fullName: null,
              age: null,
              tel_1: null,
              tel_2: null,
              username: null,
              addres_doyimiy: null,
              addres_hozir: null,
              universitet: null,
              yonalish: null,
              daraja: null,
              portfoly_link: null,
              rezumey_link: null,
              ish_holati: null,
              till: null,
            },
          }),
        }),
      ],
    }),
    PrismaModule,
    UtilModule,
    UsersModule,
  ],
})
export class AppModule {}
