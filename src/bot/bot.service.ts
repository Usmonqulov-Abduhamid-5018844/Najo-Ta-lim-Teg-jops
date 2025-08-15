import { Injectable } from '@nestjs/common';
import { MyContext } from 'src/helpers/sesion';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendUsersCSV } from './CVS';
import type { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
  constructor(private readonly prisma: PrismaService) {}
  async create(ctx: MyContext) {
    const {
      tel_1,
      tel_2,
      addres_doyimiy,
      addres_hozir,
      username,
      fullName,
      age,
      yonalish,
      daraja,
      rezumey_link,
      portfoly_link,
      ish_holati,
      till,
      universitet,
    } = ctx.session.formData;
    const chat_id = String(ctx.from?.id);

    if (
      tel_1 &&
      tel_2 &&
      addres_doyimiy &&
      addres_hozir &&
      username &&
      fullName &&
      age &&
      yonalish &&
      daraja &&
      rezumey_link &&
      portfoly_link &&
      ish_holati &&
      till &&
      universitet &&
      chat_id
    ) {
      try {
        await this.prisma.users.create({
          data: {
            tel_1,
            tel_2,
            addres_doyimiy,
            addres_hozir,
            username,
            fullName,
            age,
            yonalish,
            daraja,
            rezumey_link,
            portfoly_link,
            ish_holati,
            till,
            universitet,
            chat_id
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  async update(ctx: MyContext) {
    const { telefon_1, telefon_2, daraja, portfoly, rezyumey, ish_holati } =
      ctx.session.Update;
    const chat_id = String(ctx.from?.id);

    if (telefon_1 || telefon_2 || daraja || portfoly || rezyumey || ish_holati) {
      try {
        const user = await this.prisma.users.findUnique({ where: { chat_id } });
        if (!user) {
          ctx.reply('Siz hali registratsiya qilmagansiz');
          return;
        }
        const data = await this.prisma.users.update({
          where: { chat_id: chat_id },
          data: {
            ...(telefon_1 && { tel_1: telefon_1 }),
            ...(telefon_2 && { tel_2: telefon_2 }),
            ...(daraja && { daraja }),
            ...(portfoly && { portfoly_link: portfoly }),
            ...(rezyumey && { rezyumey_link: rezyumey }),
            ...(ish_holati && { ish_holati: ish_holati }),
          },
        });
        ctx.reply('✅ Malumotlar muvifuyaqatliy yangilandi.');
      } catch (error) {
        console.log(error);
      }
    }
  }

  async mydata(ctx: MyContext) {
    const chat_id = String(ctx.from?.id);
    try {
      const mydata = await this.prisma.users.findUnique({ where: { chat_id } });
      if (!mydata) {
        await ctx.reply("Sizning ma'lumotlaringiz topilmadi");
        return;
      }

      const info = `
👤 Ism: ${mydata.fullName || "Noma'lum"}\n
🎓 Universitet: ${mydata.universitet || "Ko'rsatilmagan"}\n
📚 Yo'nalish: ${mydata.yonalish || "Ko'rsatilmagan"}\n
💼 Daraja: ${mydata.daraja || "Ko'rsatilmagan"}\n
📞 Telefon 1: ${mydata.tel_1 || "Ko'rsatilmagan"}\n
📞 Telefon 2: ${mydata.tel_2 || "Ko'rsatilmagan"}\n
🌐 Til bilish: ${Array.isArray(mydata.till) ? mydata.till.join(', ') : "Ko'rsatilmagan"}\n
🏠 Doimiy manzil: ${mydata.addres_doyimiy || "Ko'rsatilmagan"}\n
🏢 Hozirgi manzil: ${mydata.addres_hozir || "Ko'rsatilmagan"}\n
📎 Rezume: ${mydata.rezumey_link || "Ko'rsatilmagan"}\n
🌐 Portfolio: ${mydata.portfoly_link || "Ko'rsatilmagan"}\n
⚙️ Ish holati: ${mydata.ish_holati || "Ko'rsatilmagan"}\n
🎂 Yosh: ${mydata.age || "Ko'rsatilmagan"}\n
`;

      await ctx.reply(info);
    } catch (error) {
      console.error(error);
    }
  }

  async allUsers(ctx:MyContext){
    try {
      const data = await this.prisma.users.findMany()
      if(!data.length){
        ctx.reply("Malumotlar topilmadi.")
        return 
      }
      sendUsersCSV(ctx, data)
    } catch (error) {
      
    }
  }
async AllUsers(ctx: MyContext, page = 1) {
  try {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const users = await this.prisma.users.findMany({
      skip,
      take: pageSize,
    });

    if (!users.length) {
      ctx.reply("Malumotlar topilmadi.");
      return
    }

    let message = `📋 Foydalanuvchilar ro'yxati (Sahifa ${page}):\n\n`;

    users.forEach((mydata, idx) => {
      message += `👤 Ism: ${mydata.fullName || "Noma'lum"}\n`;
      message += `🎓 Universitet: ${mydata.universitet || "Ko'rsatilmagan"}\n`;
      message += `📚 Yo'nalish: ${mydata.yonalish || "Ko'rsatilmagan"}\n`;
      message += `💼 Daraja: ${mydata.daraja || "Ko'rsatilmagan"}\n`;
      message += `📞 Telefon 1: ${mydata.tel_1 || "Ko'rsatilmagan"}\n`;
      message += `📞 Telefon 2: ${mydata.tel_2 || "Ko'rsatilmagan"}\n`;
      message += `🌐 Til bilish: ${Array.isArray(mydata.till) ? mydata.till.join(', ') : "Ko'rsatilmagan"}\n`;
      message += `🏠 Doimiy manzil: ${mydata.addres_doyimiy || "Ko'rsatilmagan"}\n`;
      message += `🏢 Hozirgi manzil: ${mydata.addres_hozir || "Ko'rsatilmagan"}\n`;
      message += `📎 Rezume: ${mydata.rezumey_link || "Ko'rsatilmagan"}\n`;
      message += `🌐 Portfolio: ${mydata.portfoly_link || "Ko'rsatilmagan"}\n`;
      message += `⚙️ Ish holati: ${mydata.ish_holati || "Ko'rsatilmagan"}\n`;
      message += `🎂 Yosh: ${mydata.age || "Ko'rsatilmagan"}\n`;
      message += `-----------------------------\n\n`;
    });

    const keyboard: InlineKeyboardButton[] = []

    if (page > 1) {
      keyboard.push({ text: "⬅️ Oldingi", callback_data: `users_page_${page - 1}` });
    }
    if (users.length === pageSize) {
      keyboard.push({ text: "Keyingi ➡️", callback_data: `users_page_${page + 1}` });
    }

    await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [keyboard],
      },
    });

  } catch (error) {
    console.error(error);
    ctx.reply("Xatolik yuz berdi.");
  }
}

}
