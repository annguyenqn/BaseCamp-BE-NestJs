import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
// import { SERVICE_NAME } from './../common/constant/message.constant';
// export function formatI18nErrors(
//   validationError: ValidationError[],
//   i18n: I18nService,
//   lang: string,
// ) {
//   const formattedErrors = [];
//   const errorFormatter = (
//     errors: ValidationError[],
//     errMessage?: any,
//     parentField?: string,
//   ) => {
//     const message = errMessage || {};
//     errors.map((error) => {
//       const fieldName = parentField
//         ? `${parentField}.${error.property}`
//         : error?.property;
//       if (
//         !Object.entries(error?.constraints)?.length &&
//         error?.children?.length
//       ) {
//         errorFormatter(error.children, message, fieldName);
//       } else {
//         const formatedMessage = Object.keys(error.constraints)
//           .map((key) => {
//             const [translationKey] = error.constraints[key].split('|');
//             return i18n?.translate(translationKey, { lang }) || translationKey;
//           })
//           .join(', ');
//         formattedErrors.push({
//           fieldName,
//           message: formatedMessage,
//         });
//       }
//     });
//   };
//   errorFormatter(validationError);
//   if (!formattedErrors.length)
//     return [
//       {
//         fieldName: SERVICE_NAME,
//         message: i18n.translate('messages.errors.something_went_wrong', {
//           lang,
//         }),
//       },
//     ] as any;

//   return formattedErrors;
// }
