import { Context } from 'telegraf';

export interface ISessionData {
  formData: {
    fullName?: string | null;
    age?: string | null;
    tel_1?: string | null;
    tel_2?: string | null;
    username?: string | null;
    addres_doyimiy?: string | null;
    addres_hozir?: string | null;
    universitet?: string | null;
    yonalish?: string | null;
    daraja?: string | null;
    portfoly_link?: string | null;
    rezumey_link?: string | null;
    ish_holati: string | null;
    till?: string[] | null;
  };
  IsUpdate:{
    telefon_1: string | null
    telefon_2: string | null
    daraja: string | null
    portfoly: string | null
    rezyumey: string | null
    ish_holati: string | null
  };
  Update:{
    telefon_1: string | null
    telefon_2: string | null
    daraja: string | null
    portfoly: string | null
    rezyumey: string | null
     ish_holati: string | null
  };

  IsData: {
    fullName?: string | null;
    age?: string | null;
    tel_1?: string | null;
    tel_2?: string | null;
    username?: string | null;
    addres_doyimiy?: string | null;
    addres_hozir?: string | null;
    universitet?: string | null;
    yonalish?: string | null;
    daraja?: string | null;
    portfoly_link?: string | null;
    rezumey_link?: string | null;
    ish_holati: string | null;
    till?: string | null;
  };
}

export interface MyContext extends Context {
  session: ISessionData;
}
