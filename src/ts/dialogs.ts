import { hasTransitionSet } from "./utils.js";

const closeDialog = (dialog: HTMLDialogElement) => {
  if (dialog.dataset.beforeCloseAdd)
    dialog.classList.add(...dialog.dataset.beforeCloseAdd.split(" "));

  if (dialog.dataset.beforeCloseRemove)
    dialog.classList.remove(...dialog.dataset.beforeCloseRemove.split(" "));

  document.body.classList.remove("overflow-hidden");

  hasTransitionSet(dialog)
    ? dialog.addEventListener("transitionend", () => dialog.close(), {
        once: true,
      })
    : dialog.close();
};

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault();
    closeDialog(e.currentTarget as HTMLDialogElement);
  }
};
const closeOnClickOutSide: EventListener = (e) =>
  e.target === e.currentTarget &&
  closeDialog(e.currentTarget as HTMLDialogElement);

const openDialog = (dialog: HTMLDialogElement) => {
  dialog?.showModal();

  dialog.addEventListener("keydown", closeOnEscape);

  if (dialog.hasAttribute("data-close-on-click-outside"))
    dialog.addEventListener("click", closeOnClickOutSide);

  if (dialog.dataset.afterOpenAdd)
    dialog.classList.add(...dialog.dataset.afterOpenAdd.split(" "));

  if (dialog.dataset.afterOpenRemove)
    dialog.classList.remove(...dialog.dataset.afterOpenRemove.split(" "));

  document.body.classList.add("overflow-hidden");
};

const onDialogBtnClick: EventListener = (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const dialog = document.querySelector<HTMLDialogElement>(
    `#${btn.getAttribute("aria-controls")}`
  );

  if (!dialog) return;
  dialog.open ? closeDialog(dialog) : openDialog(dialog);
};

export const initDialogs = (dialogBtns: NodeListOf<HTMLButtonElement>) =>
  dialogBtns.forEach((btn) => btn.addEventListener("click", onDialogBtnClick));
