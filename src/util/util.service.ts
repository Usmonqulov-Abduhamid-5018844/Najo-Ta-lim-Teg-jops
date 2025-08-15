import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class UtilService implements OnModuleInit {
  constructor(@InjectBot() private readonly Bot: Telegraf) {}

  async onModuleInit() {
    await this.Bot.telegram.setMyCommands([
      { command: '/start', description: 'Boshlash'},
    ]);
  }

  
}
