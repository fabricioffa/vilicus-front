import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const toast = {
    success: (text: string) =>
        Toastify({
            text,
            className:
                "!flex !max-w-[70%] gap-2 px-8 font-semibold !bg-green-500 !bg-none text-white [&_.toast-close]:opacity-60 active:[&_.toast-close]:scale-95",
            close: true,
        }),
    error: (text: string) =>
        Toastify({
            text,
            className:
                "!flex !max-w-[70%] gap-2 px-8 font-semibold !bg-red-500 !bg-none text-white [&_.toast-close]:opacity-60 active:[&_.toast-close]:scale-95",
            close: true,
        }),
};

