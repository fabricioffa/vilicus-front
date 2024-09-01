import * as zod from "zod";
import { currentLocale } from "./utils.js";
import { errorMsgs } from "./errorMsgs.js";

const sumDays = (date: number | Date, dayNumber: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDay() + dayNumber);
    return newDate;
};

const formatDate = (date: number | Date) =>
    new Intl.DateTimeFormat("pt-BR").format(date);

export const customErrorMap: zod.ZodErrorMap = (error, ctx) => {
    switch (error.code) {
        case zod.ZodIssueCode.invalid_type:
            if (error.received === "undefined" || error.received === "nan") {
                return { message: errorMsgs[currentLocale || "pt"].required };
            }
            if (error.expected === "string") {
                return { message: errorMsgs[currentLocale || "pt"].string };
            }
            break;
        case zod.ZodIssueCode.invalid_union:
            if (error.unionErrors.every(error => error.issues.every(issue => issue.code === zod.ZodIssueCode.invalid_type))) {
                return { message: errorMsgs[currentLocale || "pt"].required };
            }
            break;
        case zod.ZodIssueCode.too_small:
            if (error.type === "string")
                return error.minimum === 1
                    ? { message: errorMsgs[currentLocale || "pt"].required }
                    : {
                          message: `${
                              errorMsgs[currentLocale || "pt"].minLength
                          } ${
                              error.inclusive
                                  ? error.minimum
                                  : Number(error.minimum) - 1
                          }.`,
                      };
            if (error.type === "number")
                return {
                    message: `${errorMsgs[currentLocale || "pt"].min} ${
                        error.inclusive
                            ? error.minimum
                            : Number(error.minimum) + 1
                    }.`,
                };
            if (error.type === "date")
                return {
                    message: `${errorMsgs[currentLocale || "pt"].minDate} ${
                        error.inclusive
                            ? formatDate(Number(error.minimum))
                            : formatDate(sumDays(Number(error.minimum), 1))
                    }.`,
                };

            break;
        case zod.ZodIssueCode.too_big:
            if (error.type === "string")
                return {
                    message: `${errorMsgs[currentLocale || "pt"].maxLength} ${
                        error.inclusive
                            ? error.maximum
                            : Number(error.maximum) - 1
                    }.`,
                };
            if (error.type === "number")
                return {
                    message: `${errorMsgs[currentLocale || "pt"].max} ${
                        error.inclusive
                            ? error.maximum
                            : Number(error.maximum) - 1
                    }.`,
                };
            if (error.type === "date")
                return {
                    message: `${errorMsgs[currentLocale || "pt"].maxDate} ${
                        error.inclusive
                            ? formatDate(Number(error.maximum))
                            : formatDate(sumDays(Number(error.maximum), -1))
                    }.`,
                };
            break;
        case zod.ZodIssueCode.invalid_string:
            if (error.validation === "email")
                return { message: errorMsgs[currentLocale || "pt"].email };
            break;
        case zod.ZodIssueCode.invalid_literal:
            if (error.expected === "on")
                return { message: errorMsgs[currentLocale || "pt"].accepted };
            break;
        case zod.ZodIssueCode.invalid_enum_value:
            if (error.received === "")
                return { message: errorMsgs[currentLocale || "pt"].required };
            return { message: errorMsgs[currentLocale || "pt"].enum };
    }
    return { message: ctx.defaultError };
};

zod.setErrorMap(customErrorMap);
export const z = zod;
