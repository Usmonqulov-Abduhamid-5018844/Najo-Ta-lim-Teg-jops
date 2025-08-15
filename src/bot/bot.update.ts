import {
  Update,
  Start,
  Ctx,
  Hears,
  On,
  Command,
  Message,
} from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotService } from './bot.service';
import { MyContext } from 'src/helpers/sesion';
import { PrismaService } from 'src/prisma/prisma.service';

@Update()
export class BotUpdate {
  private readonly ADMIN_CHAT_ID = (process.env.ADMIN_ID || '')
    .split(',')
    .map((id) => Number(id));
  constructor(
    private readonly botService: BotService,
    private readonly prisma: PrismaService,
  ) {}
  @Start()
  async start(@Ctx() ctx: Context) {
    if (ctx.from?.id && this.ADMIN_CHAT_ID.includes(ctx.from.id)) {
      ctx.reply(
        `Assalomu alaykum xurmatliy ${ctx.from.first_name || 'Admin'} bo'tga xush kelibsiz`,
        Markup.keyboard([
          ["Foydalanuvchilarni ko'rish"],
          ['File import'],
        ]).resize(),
      );
    } else {
      ctx.reply(
        `Asssalamu alaykum hurmatli foydalanuvchi`,
        Markup.keyboard([['Register', 'Setings'], ['Mydata']]).resize(),
      );
    }
  }
  @Hears('File import')
  onAdminAlldata(@Ctx() ctx: MyContext) {
    return this.botService.allUsers(ctx);
  }
  @Hears("Foydalanuvchilarni ko'rish")
  onFoydalanuvchilar(@Ctx() ctx: MyContext) {
    return this.botService.AllUsers(ctx);
  }

  @On('callback_query')
  async onCallbackQuery(ctx: MyContext) {
    if (!(ctx.callbackQuery && 'data' in ctx.callbackQuery)) return;

    const data = ctx.callbackQuery.data;

    if (data.startsWith('users_page_')) {
      const page = Number(data.split('_').pop());
      await this.botService.AllUsers(ctx, page);
      await ctx.answerCbQuery();
    }
  }

  @Hears('Mydata')
  onMydata(@Ctx() ctx: MyContext) {
    return this.botService.mydata(ctx);
  }
  @Hears('Register')
  async onRegister(@Ctx() ctx: MyContext) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { chat_id: String(ctx.from?.id) },
      });
      if (user) {
        ctx.reply("Siz avval fo'rmani to'ldirgansiz");
        return;
      }
      ctx.reply(
        'Ism Familyangizni kriting.',
        Markup.keyboard([['Ortga']]).resize(),
      );
      ctx.session.IsData.fullName = 'name';
    } catch (error) {
      console.log(error);
    }
  }
  @Hears('Setings')
  onSeting(@Ctx() ctx: MyContext) {
    ctx.reply(
      "Assalomu alaykum bu bo'limda siz malumotlaringizni o'zgaritiishingiz munkin",
      Markup.keyboard([
        ['Telefon', 'daraja'],
        ['Portfoli', 'Rezyumey'],
        ['status', 'universitet'],

        ['ism familiya', "yo'nalish"],
        ['doyimiy yashash manzil', 'hozirgi yashash manzil'],
        ['till', 'yosh'],
        ['ortga'],
      ]).resize(),
    );
    ctx.session.IsUpdate.AA = 'AAA';
  }
  @Hears('ortga')
  onOrtga(@Ctx() ctx: MyContext) {
    ctx.reply(
      'Asosiy menyu',
      Markup.keyboard([['Register', 'Setings'], ['Mydata']]).resize(),
    );
  }
  @Hears('Telefon')
  onTelefon(@Ctx() ctx: MyContext) {
    ctx.session.IsUpdate.telefon_1 = 'telefon_1';
    ctx.reply('📞 Yangi Telefon raqamingizni kriting', {
      reply_markup: {
        keyboard: [[{ text: '📲 Raqamni ulashish', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
  @Hears('status')
  onStatus(@Ctx() ctx: MyContext) {
    ctx.reply(
      'Hozirda ishlayapsizmi yoki ish qidiryapsizmi?',
      Markup.keyboard([
        ['Xa, ishlayapman', 'Aktiv ish qidiryapman'],
        ["Yo'q ishlamayabman"],
      ])
        .resize()
        .oneTime(),
    );
    ctx.session.IsUpdate.ish_holati = 'ish_holati';
  }

  @Hears('daraja')
  onDaraja(@Ctx() ctx: MyContext) {
    ctx.reply(
      'Darajangizni tanlayng',
      Markup.keyboard([
        ['Strong Junior', 'Middle', 'Senior'],
        ['Lead', 'Expert', 'Intern'],
        ['Boshqa'],
      ])
        .resize()
        .oneTime(),
    );
    ctx.session.IsUpdate.daraja = 'daraja';
  }
  @Hears('Portfoli')
  onPortfoly(@Ctx() ctx: MyContext) {
    ctx.reply('Yangi portfoliya fayl shaklida kriting...');
    ctx.session.IsUpdate.portfoly = 'portfoly';
  }
  @Hears('Rezyumey')
  onRezyume(@Ctx() ctx: MyContext) {
    ctx.reply('Yangi Rezyume fayl shaklida kriting...');
    ctx.session.IsUpdate.rezyumey = 'rezyumey';
  }

  @Hears('Home')
  onHome(@Ctx() ctx: MyContext) {
    ctx.reply(
      'Asosiy menyu',
      Markup.keyboard([['Register', 'Setings'], ['Mydata']])
        .resize()
        .oneTime(),
    );
  }
  @On('contact')
  onContakt(@Ctx() ctx: MyContext) {
    if (ctx.session.IsUpdate.telefon_1 == 'telefon_1') {
      if (ctx.message && 'contact' in ctx.message) {
        ctx.session.Update.telefon_1 = ctx.message.contact.phone_number;
        ctx.session.IsUpdate.telefon_1 = null;
        ctx.session.IsUpdate.telefon_2 = 'telefon_2';
        ctx.reply('📞 2 - Yangi Telefon raqamingizni kriting', {
          reply_markup: {
            keyboard: [
              [{ text: '📲 Raqamni ulashish', request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      }
      return;
    }
    if (ctx.session.IsUpdate.telefon_2 == 'telefon_2') {
      if (ctx.message && 'contact' in ctx.message) {
        if (ctx.session.IsUpdate.telefon_2 == 'telefon_2') {
          ctx.session.Update.telefon_2 = ctx.message.contact.phone_number;
          ctx.session.IsUpdate.telefon_2 = null;
          return this.botService.update(ctx);
        }
      }
    }
    if (ctx.session.IsData.tel_1 == 'tel_1') {
      if (ctx.message && 'contact' in ctx.message) {
        ctx.session.formData.tel_1 = ctx.message.contact.phone_number;
        ctx.session.IsData.tel_1 = null;
        ctx.session.IsData.tel_2 = 'tel_2';
        ctx.reply(`📞 2 - Telefon raqamingizni kriting`, {
          reply_markup: {
            keyboard: [
              [{ text: `📲 Raqamni ulashish`, request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      }
      return;
    }
    if (ctx.session.IsData.tel_2 == 'tel_2') {
      if (ctx.message && 'contact' in ctx.message) {
        ctx.session.formData.tel_2 = ctx.message.contact.phone_number;
        ctx.session.IsData.tel_2 = null;
        ctx.session.IsData.age = 'age';
        ctx.reply('Yoshingizni kriting...');
      }
      return;
    }
  }

  @On('document')
  async onDocument(@Ctx() ctx: MyContext) {
    if (ctx.session.IsData.rezumey_link === 'rezumey_link') {
      if (ctx.message && 'document' in ctx.message) {
        ctx.session.formData.rezumey_link = ctx.message.document.file_id;
        ctx.session.IsData.rezumey_link = null;
        ctx.session.IsData.portfoly_link = 'portfoly_link';
        ctx.reply('Portfoliyangizni fayl shaklida tashlayng...');
        return;
      }
    }
    if (ctx.session.IsData.portfoly_link === 'portfoly_link') {
      if (ctx.message && 'document' in ctx.message) {
        ctx.session.formData.portfoly_link = ctx.message.document.file_id;
        ctx.session.IsData.portfoly_link = null;
        ctx.session.IsData.tel_1 = 'tel_1';
        ctx.reply('📞 Telefon raqamingizni ulashing', {
          reply_markup: {
            keyboard: [
              [{ text: '📲 Raqamni ulashish', request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
        return;
      }
    }
    if (ctx.message && 'document' in ctx.message) {
      if (ctx.session.IsUpdate.portfoly === 'portfoly') {
        ctx.session.Update.portfoly = ctx.message.document.file_id;
        ctx.session.IsUpdate.portfoly = null;
        return this.botService.update(ctx);
      }
      if (ctx.session.IsUpdate.rezyumey === 'rezyumey') {
        ctx.session.Update.rezyumey = ctx.message.document.file_id;
        ctx.session.IsUpdate.rezyumey = null;
        return this.botService.update(ctx);
      }
    }
  }

  @On('text')
  async onTest(@Ctx() ctx: MyContext) {
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text;

      if (ctx.session.IsUpdate.daraja === 'daraja') {
        if (text === 'Boshqa') {
          ctx.reply("Darajangizni qo'lda kriting...");
        } else {
          ctx.session.Update.daraja = text;
          ctx.session.IsUpdate.daraja = null;
          return this.botService.update(ctx);
        }
      }
      if (ctx.session.IsUpdate.ish_holati === 'ish_holati') {
        ctx.session.Update.ish_holati = text;
        ctx.session.IsUpdate.ish_holati = null;
        return this.botService.update(ctx);
      }
    }

    if (ctx.session.IsUpdate.AA == 'AAA') {
      if (ctx.message && 'text' in ctx.message) {
        const text = ctx.message.text;

        if (text === 'universitet') {
          ctx.reply(
            "O'qigan talim dargohingizni tanlayng",
            Markup.keyboard([
              ['Najot Taʼlim', 'Mohirdev'],
              ['PDP', 'Boshqa'],
            ])
              .oneTime()
              .resize(),
          );
          ctx.session.IsUpdate.universitet = 'universitet';
          return;
        }
        if (ctx.session.IsUpdate.universitet === 'universitet') {
          if (text == 'Boshqa') {
            ctx.reply("Universitet nomini qo'lda kiriting...");
            return;
          }
          ctx.session.Update.universitet = text;
          ctx.session.IsUpdate.universitet = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }
        if (text === 'ism familiya') {
          ctx.reply('Ism familyangizni kriting...');
          ctx.session.IsUpdate.ism = 'ism';
          return;
        }
        if (ctx.session.IsUpdate.ism === 'ism') {
          ctx.session.Update.ism = text;
          ctx.session.IsUpdate.ism = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }
        if (text === "yo'nalish") {
          ctx.reply(
            "Yo'nalishingiz qaysi Categoriyaga to'g'ri keladi",
            Markup.keyboard([
              ['Dasturlash (Frontend, Backend, Full Stack, AI)'],
              ['IT va Dizayn (UI/UX, QA, Data, Security)'],
              ['Marketing va Media'],
              ['Grafik Dizayn va Sotuv'],
              ['Boshqa'],
            ])
              .resize()
              .oneTime(),
          );
          ctx.session.IsUpdate.yonalish = 'yonalish';
          return;
        }
        if (ctx.session.IsUpdate.yonalish === 'yonalish') {
          if (text === 'Boshqa') {
            ctx.reply("Yo'nalishingizni qo'lda kiriting...");
            return;
          }
          ctx.session.Update.yonalish = text;
          ctx.session.IsUpdate.yonalish = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }
        if (text == 'doyimiy yashash manzil') {
          ctx.reply('Doyimiy yashash manzilingizni kriting...');
          ctx.session.IsUpdate.home_1 = 'Doyimiy';
          return;
        }
        if (ctx.session.IsUpdate.home_1 === 'Doyimiy') {
          ctx.session.Update.home_1 = text;
          ctx.session.IsUpdate.home_1 = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }

        if (text == 'hozirgi yashash manzil') {
          ctx.reply('Hozirgi yashash manzilingizni kriting...');
          ctx.session.IsUpdate.home_2 = 'Hozirgi';
          return;
        }
        if (ctx.session.IsUpdate.home_2 === 'Hozirgi') {
          ctx.session.Update.home_2 = text;
          ctx.session.IsUpdate.home_2 = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }
        if (text === 'yosh') {
          ctx.reply('Yoshingisni kriting...');
          ctx.session.IsUpdate.age = 'Yosh';
          return;
        }
        if (ctx.session.IsUpdate.age === 'Yosh') {
          ctx.session.Update.age = text;
          ctx.session.IsUpdate.age = null;
          ctx.session.IsUpdate.AA = null;
          return this.botService.update(ctx);
        }
        if (text === 'till') {
          ctx.reply(
            'Muloqot darajasida qaysi tillarni bilasiz',
            Markup.keyboard([
              ['Ingliz tili', 'Rus tili'],
              ['Nemis tili', 'Yapon tili'],
              ['Kareys tili', 'Xitoy tili'],
              ['Boshqa', 'keyingi'],
            ]).resize(),
          );
          ctx.session.IsUpdate.til = 'Till';
          return;
        }
        if (ctx.session.IsUpdate.til === 'Till') {
          if (!ctx.session.Update.til) {
            ctx.session.Update.til = [];
          }
          if (text === 'Boshqa') {
            ctx.reply(
              "Muloqot darajasida qaysi tillarni bilasiz qo'lda kiriting...",
            );
            return;
          }
          if (text === 'keyingi') {
            ctx.session.IsUpdate.til = null;
            ctx.session.IsUpdate.AA = null;
            return this.botService.update(ctx);
          } else if (!ctx.session.Update.til?.includes(text)) {
            ctx.session.Update.til?.push(text);
            ctx.reply(
              `✅ ${text} qo'shildi. Yana til tanlashingiz mumkin yoki "keyingi" tugmasini bosing.`,
              Markup.keyboard([
                ['Ingliz tili', 'Rus tili'],
                ['Nemis tili', 'Yapon tili'],
                ['Kareys tili', 'Xitoy tili'],
                ['Boshqa', 'keyingi'],
              ]).resize(),
            );
            return;
          } else {
            ctx.reply(`⚠️ ${text} allaqachon tanlangan.`);
            return;
          }
        }
      }
    }

    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message?.text;

      if (ctx.session.IsData.fullName === 'name') {
        ctx.session.formData.fullName = text;
        ctx.session.formData.username = '@' + ctx.from?.username;
        ctx.session.IsData.fullName = null;
        if (text === 'Ortga') {
          ctx.reply(
            'Asosiy sahifa',
            Markup.keyboard([['Register', 'Setings']])
              .resize()
              .oneTime(),
          );
          return;
        }
        ctx.session.IsData.till = 'till';
        ctx.reply(
          'Muloqot darajasida qaysi tillarni bilasiz',
          Markup.keyboard([
            ['Ingliz tili', 'Rus tili'],
            ['Nemis tili', 'Yapon tili'],
            ['Kareys tili', 'Xitoy tili'],
            ['Boshqa', 'keyingi'],
            ['Ortga'],
          ]).resize(),
        );
        return;
      }
      if (ctx.session.IsData.till === 'till') {
        if (text === 'Ortga') {
          ctx.session.IsData.till = null;
          ctx.session.IsData.fullName = 'name';
          ctx.reply(
            'Muloqot darajasida qaysi tillarni bilasiz',
            Markup.keyboard([
              ['Ingliz tili', 'Rus tili'],
              ['Nemis tili', 'Yapon tili'],
              ['Kareys tili', 'Xitoy tili'],
              ['Boshqa', 'keyingi'],
              ['Ortga'],
            ]).resize(),
          );
          return;
        }
        if (!ctx.session.formData.till) {
          ctx.session.formData.till = [];
        }

        if (text === 'keyingi') {
          ctx.session.IsData.till = null;
          ctx.reply(
            'Doimiy yashash manzilingizni kriting',
            Markup.keyboard([['Ortga']]).resize(),
          );
          ctx.session.IsData.addres_doyimiy = 'doyimiy';
          return;
        }
        if (text === 'Boshqa') {
          ctx.reply(
            "Qaysi tilni bilasiz qo'lda kriting",
            Markup.keyboard([['Ortga']]).resize(),
          );
          return;
        }

        if (!ctx.session.formData.till.includes(text)) {
          ctx.session.formData.till.push(text);
          ctx.reply(
            `✅ ${text} qo'shildi. Yana til tanlashingiz mumkin yoki "keyingi" tugmasini bosing.`,
            Markup.keyboard([
              ['Ingliz tili', 'Rus tili'],
              ['Nemis tili', 'Yapon tili'],
              ['Kareys tili', 'Xitoy tili'],
              ['Boshqa', 'keyingi'],
              ['Ortga'],
            ]).resize(),
          );
          return;
        } else {
          ctx.reply(`⚠️ ${text} allaqachon tanlangan.`);
          return;
        }
      }
      if (ctx.session.IsData.addres_doyimiy === 'doyimiy') {
        ctx.session.formData.addres_doyimiy = text;
        ctx.session.IsData.addres_doyimiy = null;
        if (text === 'Ortga') {
          ctx.session.IsData.till = 'till';
          ctx.reply(
            'Muloqot darajasida qaysi tillarni bilasiz',
            Markup.keyboard([
              ['Ingliz tili', 'Rus tili'],
              ['Nemis tili', 'Yapon tili'],
              ['Kareys tili', 'Xitoy tili'],
              ['Boshqa', 'keyingi'],
              ['Ortga'],
            ]).resize(),
          );
          return;
        }
        ctx.reply(
          'Hozirgi yashash manzilingizni kriting.',
          Markup.keyboard([['Ortga']]).resize(),
        );
        ctx.session.IsData.addres_hozir = 'hozirgi';
        return;
      }
      if (ctx.session.IsData.addres_hozir === 'hozirgi') {
        ctx.session.formData.addres_hozir = text;
        ctx.session.IsData.addres_hozir = null;
        if (text === 'Ortga') {
          ctx.session.IsData.addres_hozir = null;
          ctx.session.IsData.addres_doyimiy = 'doyimiy';
          ctx.reply(
            'Doimiy yashash manzilingizni kriting',
            Markup.keyboard([['Ortga']]).resize(),
          );
          return;
        }
        ctx.session.IsData.universitet = 'universitet';
        ctx.reply(
          "O'qigan talim dargohingizni tanlayng",
          Markup.keyboard([
            ['Najot Taʼlim', 'Mohirdev'],
            ['PDP', 'Boshqa'],
            ['Ortga'],
          ])
            .oneTime()
            .resize(),
        );
        return;
      }
      if (ctx.session.IsData.rezumey_link === 'rezumey_link') {
        if (ctx.message && 'text' in ctx.message) {
          if (ctx.message.text === 'Ortga') {
            ctx.session.IsData.rezumey_link = null;
            ctx.session.IsData.ish_holati = 'ish_holati';
            ctx.reply(
              'Hozirda ishlayapsizmi yoki ish qidiryapsizmi?',
              Markup.keyboard([
                ['Xa, ishlayapman', 'Aktiv ish qidiryapman'],
                ["Yo'q ishlamayabman", 'Ortga'],
              ])
                .resize()
                .oneTime(),
            );
            return;
          }
        }
      }
      if (ctx.session.IsData.portfoly_link === 'portfoly_link') {
        if (ctx.message && 'text' in ctx.message) {
          if (ctx.message.text === 'Ortga') {
            ctx.session.IsData.rezumey_link = 'rezumey_link';
            ctx.session.IsData.portfoly_link = null;
            ctx.reply('Reziumeyingizni fayl shaklida tashlayng...');
            return;
          }
        }
      }

      if (ctx.session.IsData.universitet === 'universitet') {
        if (text === 'Ortga') {
          ctx.session.IsData.universitet = null;
          ctx.session.IsData.addres_hozir = 'hozirgi';
          ctx.reply(
            'Hozirgi yashash manzilingizni kriting.',
            Markup.keyboard([['Ortga']]).resize(),
          );
        } else if (text === 'Boshqa') {
          ctx.reply("O'qigan talim dargohingizni qo'lda kriting...");
        } else {
          ctx.session.formData.universitet = text;
          ctx.session.IsData.universitet = null;
          ctx.session.IsData.yonalish = 'yonalish';
          ctx.reply(
            "Yo'nalishingiz qaysi Categoriyaga to'g'ri keladi",
            Markup.keyboard([
              ['Dasturlash (Frontend, Backend, Full Stack, AI)'],
              ['IT va Dizayn (UI/UX, QA, Data, Security)'],
              ['Marketing va Media'],
              ['Grafik Dizayn va Sotuv'],
              ['Boshqa', 'Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        }
        return;
      }
      if (ctx.session.IsData.yonalish === 'yonalish') {
        if (text === 'Ortga') {
          ctx.session.IsData.yonalish = null;
          ctx.session.IsData.universitet = 'universitet';
          ctx.reply(
            "O'qigan talim dargohingizni tanlayng",
            Markup.keyboard([
              ['Najot Taʼlim', 'Mohirdev'],
              ['PDP', 'Boshqa'],
              ['Ortga'],
            ])
              .oneTime()
              .resize(),
          );
          return;
        }
        if (text === 'Dasturlash (Frontend, Backend, Full Stack, AI)') {
          ctx.reply(
            "Yo'nalishingizni tanlayng",
            Markup.keyboard([
              ['Frontend React', 'Frontend Vuejs', 'Frontend Angular'],
              ['Backend NodeJS', 'Backend Java', 'Backend Python'],
              ['Backend Golang', 'Backend.Net', 'Full stack'],
              ['AI', 'Computer vision', 'NLP'],
              ['Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        } else if (text === 'IT va Dizayn (UI/UX, QA, Data, Security)') {
          ctx.reply(
            "Yo'nalishingizni tanlayng",
            Markup.keyboard([
              ['No Coding', 'UI/UX', 'Project management (IT)'],
              ['Product management', 'Business analytics', 'QA manual'],
              ['QA automation', 'Flutter', 'IOS'],
              ['Kotlin', 'Java Mobile', 'Data science'],
              ['Data analytics', 'Cyber security'],
              ['Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        } else if (text === 'Marketing va Media') {
          ctx.reply(
            "Yo'nalishingizni tanlayng",
            Markup.keyboard([
              ['Marketing', 'Digital Marketing', 'SMM'],
              ['Targeting', 'Copywriting', 'Mobilography'],
              ['Videography', 'Montage (video)', 'Motion design'],
              ['Motion graphics', 'Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        } else if (text === 'Grafik Dizayn va Sotuv') {
          ctx.reply(
            "Yo'nalishingizni tanlayng",
            Markup.keyboard([
              ['Graphic design', 'Motion dizayn', '3D modellashtirish'],
              ['Sotuv manager', 'E-commerce sotuv'],
              ['Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        } else if (text === 'Boshqa') {
          ctx.reply("Yo'nalishingizni qo'lda kiriting...");
        } else if (text !== 'Ortga') {
          ctx.session.formData.yonalish = text;
          ctx.session.IsData.yonalish = null;
          ctx.session.IsData.daraja = 'daraja';
          ctx.reply(
            'Darajangizni tanlayng',
            Markup.keyboard([
              ['Strong Junior', 'Middle', 'Senior'],
              ['Lead', 'Expert', 'Intern'],
              ['Boshqa', 'Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        }
        return;
      }

      if (ctx.session.IsData.daraja === 'daraja') {
        if (text === 'Ortga') {
          ctx.session.IsData.daraja = null;
          ctx.session.IsData.yonalish = 'yonalish';
          ctx.reply(
            "Yo'nalishingiz qaysi kategoriyaga to'g'ri keladi",
            Markup.keyboard([
              ['Dasturlash (Frontend, Backend, Full Stack, AI)'],
              ['IT va Dizayn (UI/UX, QA, Data, Security)'],
              ['Marketing va Media'],
              ['Grafik Dizayn va Sotuv'],
              ['Boshqa', 'Ortga'],
            ])
              .resize()
              .oneTime(),
          );
        } else {
          if (text === 'Boshqa') {
            ctx.reply("Darajangizni qo'lda kriting...");
            return;
          } else {
            ctx.session.formData.daraja = text;
            ctx.session.IsData.daraja = null;
            ctx.session.IsData.ish_holati = 'ish_holati';
            ctx.reply(
              'Hozirda ishlayapsizmi yoki ish qidiryapsizmi?',
              Markup.keyboard([
                ['Xa, ishlayapman', 'Aktiv ish qidiryapman'],
                ["Yo'q ishlamayabman", 'Ortga'],
              ])
                .resize()
                .oneTime(),
            );
          }
          return;
        }
      }
      if (
        ctx.session.IsUpdate.portfoly === 'portfoly' ||
        ctx.session.IsUpdate.rezyumey === 'rezyumey'
      ) {
        ctx.reply(
          "❌ portfoliy yoki reziume noto'g'ri formadda kritildi",
          Markup.keyboard([
            ['Telefon', 'daraja'],
            ['Portfoli', 'Rezyumey'],
            ['status'],
          ]).resize(),
        );
        return;
      }
      if (ctx.session.IsData.rezumey_link == 'rezumey_link') {
        ctx.reply(
          "❌ Reziume noto'g'ri formadda kiritildi iltimos reziumingisni faly shaklida kiriting",
        );
        return;
      }
      if (ctx.session.IsData.portfoly_link == 'portfoly_link') {
        ctx.reply(
          "❌ partfoly noto'g'ri formadda kiritildi iltimos partfolyingizni faly shaklida kiriting",
        );
        return;
      }
      if (ctx.session.IsData.ish_holati === 'ish_holati') {
        if (text === 'Ortga') {
          ctx.reply(
            'Darajangizni tanlayng',
            Markup.keyboard([
              ['Strong Junior', 'Middle', 'Senior'],
              ['Lead', 'Expert', 'Intern'],
              ['Boshqa', 'Ortga'],
            ])
              .resize()
              .oneTime(),
          );
          ctx.session.IsData.ish_holati = null;
          ctx.session.IsData.daraja = 'daraja';
        } else {
          ctx.session.formData.ish_holati = text;
          ctx.session.IsData.ish_holati = null;
          ctx.session.IsData.rezumey_link = 'rezumey_link';
          ctx.reply('Reziumeyingizni fayl shaklida tashlayng...');
        }
        return;
      }
      if (ctx.session.IsData.age === 'age') {
        ctx.session.formData.age = text;
        ctx.session.IsData.age = null;
        await this.botService.create(ctx);

        const data = ctx.session.formData;
        let message = `<b>✅ Sizning ma'lumotlar muvofiyaqatliy saqlandi:</b>\n\n`;

        if (data.fullName)
          message += `👤 <b>Ism Familya:</b> ${data.fullName}\n\n`;
        if (data.age) message += `🎂 <b>Yosh:</b> ${data.age}\n\n`;
        if (data.tel_1) message += `📞 <b>Telefon 1:</b> ${data.tel_1}\n\n`;
        if (data.tel_2) message += `📱 <b>Telefon 2:</b> ${data.tel_2}\n\n`;
        if (data.username) message += `🔖 <b>Username:</b>${data.username}\n\n`;
        if (data.addres_doyimiy)
          message += `🏠 <b>Doimiy manzil:</b> ${data.addres_doyimiy}\n\n`;
        if (data.addres_hozir)
          message += `🏡 <b>Hozirgi manzil:</b> ${data.addres_hozir}\n\n`;
        if (data.universitet)
          message += `🎓 <b>Universitet:</b> ${data.universitet}\n\n`;
        if (data.yonalish)
          message += `🛠 <b>Yo'nalish:</b> ${data.yonalish}\n\n`;
        if (data.daraja) message += `🚀 <b>Daraja:</b> ${data.daraja}\n\n`;
        if (data.ish_holati)
          message += `💼 <b>Ish holati:</b> ${data.ish_holati}\n\n`;
        if (data.till && data.till.length)
          message += `🌐 <b>Bilgan tillar:</b> ${data.till.join(', ')}\n\n`;

        await ctx.reply(message, {
          parse_mode: 'HTML',
        });
        if (data.rezumey_link) {
          await ctx.replyWithDocument(data.rezumey_link, {
            caption: '📎 Rezume',
          });
        }

        if (data.portfoly_link) {
          await ctx.replyWithDocument(data.portfoly_link, {
            caption: '🔗 Portfolio',
          });
        }
        ctx.reply(
          'Home',
          Markup.keyboard([['Home']])
            .resize()
            .oneTime(),
        );
        return;
      }
    }
  }
}
