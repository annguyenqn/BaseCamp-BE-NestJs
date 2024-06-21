import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
// import { CreateAcquisitionDto } from 'src/modules/acquisition/dtos/create-acquisition.dto';
import { EntityManager } from 'typeorm';
// import { SERVICE_NAME } from './../common/constant/message.constant';
// import { IErrorsMessages } from './../common/interfaces/erorrs-messages.interface';

const JAPAN_UTC = 9;
export const momentJapanUtc = (inp: moment.MomentInput): moment.Moment =>
  moment(inp).utcOffset(JAPAN_UTC);

export class AppHelper {
  static checkRequiredFields(
    checkingObj: Record<string, any>,
    fieldArray: string[],
  ): boolean {
    if (!checkingObj) return false;
    for (const key of fieldArray) {
      if (!checkingObj[key]) return false;
    }
    return true;
  }

  static changeItems = <T extends { id?: number }>(
    currentItem: T[],
    update: Partial<T>[],
  ): {
    newItems: Partial<T>[];
    updateItems: Partial<T>[];
    removeItems: number[];
  } => {
    const newItems = update.filter((item) => !item.id);
    const updateItems = update.filter((item) => !!item.id);
    const removeItems = currentItem
      .map((item) => item.id)
      .filter((itemId) => !updateItems.map((item) => item.id).includes(itemId));
    return { newItems, updateItems, removeItems };
  };

  static countTime(
    startTime,
    endTime = new Date(),
    unit = 'ms' as moment.unitOfTime.Diff,
  ) {
    return momentJapanUtc(endTime).diff(startTime, unit) + unit;
  }
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // static formatExcetionErrorsToMessage(errors: IErrorsMessages[]) {
  //   return [
  //     ...errors.map((err) => {
  //       return `${err.fieldName}: ${err.message}`;
  //     }),
  //     new Date().toString(),
  //   ].join('\n');
  // }
  // static constantExceptionErrors(
  //   errMessage: string,
  //   i18n: I18nService,
  //   lang: string,
  // ): IErrorsMessages[] {
  static constantExceptionErrors(
    errMessage: string,
    i18n: I18nService,
    lang: string,
  ) {
    /**
     *https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/is_not_
     **/
    // const propertiesOfUndefinedCode =
    //   'messages.errors.cannot_read_properties_of_undefined';
    // const propertiesOfNullCode =
    //   'messages.errors.cannot_read_properties_of_null';
    const message = errMessage;
    // if (errMessage.includes('Cannot read properties of undefined'))
    //   message = i18n?.translate(propertiesOfUndefinedCode) || errMessage;
    // if (errMessage.includes('Cannot read properties of null'))
    // message = i18n?.translate(propertiesOfNullCode) || errMessage;

    return [
      {
        // fieldName: SERVICE_NAME,
        message: i18n?.translate(message, { lang }) || message,
      },
    ];
  }
  static isSameDayInJapan(d1: Date, d2: Date) {
    return momentJapanUtc(d1).isSame(momentJapanUtc(d2), 'day');
  }
  static runInTrx = <T>(
    {
      newTrx,
      existedTrx,
    }: { newTrx: EntityManager; existedTrx: EntityManager },
    func: (trx: EntityManager) => Promise<T>,
  ): Promise<T> => (existedTrx ? func(existedTrx) : newTrx.transaction(func));
  static indexOfEnumElement(
    enumObj: Record<string, any>,
    enumElement: string,
  ): number {
    return Object.values(enumObj).indexOf(enumElement);
  }
}
