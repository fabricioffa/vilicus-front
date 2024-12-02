const getTransitionClasses = (trigger: HTMLButtonElement) =>
    trigger.dataset.trasitionClasses?.split(" ");

const closeDropdown = (dropdown: HTMLElement, trigger: HTMLButtonElement) => {
    dropdown.classList.add(...(getTransitionClasses(trigger) ?? []));
    trigger.ariaExpanded = "false";
};

const openDropdown = (dropdown: HTMLElement, trigger: HTMLButtonElement) => {
    const transitionClasses = getTransitionClasses(trigger);
    transitionClasses && dropdown.classList.remove(...transitionClasses);
    document.addEventListener(
        "click",
        (e) => e.target !== dropdown && closeDropdown(dropdown, trigger),
        { once: true }
    );

    dropdown.addEventListener(
        "click",
        () => transitionClasses && dropdown.classList.remove(...transitionClasses),
        { once: true }
    );
    trigger.ariaExpanded = "true";
};

const onTriggerClick: EventListener = (e) => {
    const trigger = e.currentTarget as HTMLButtonElement;
    const dropdown = document.querySelector<HTMLDialogElement>(
        `#${trigger.getAttribute("aria-controls")}`
    );
    if (!dropdown) return;

    e.stopPropagation();
    trigger.ariaExpanded === "false"
        ? openDropdown(dropdown, trigger)
        : closeDropdown(dropdown, trigger);
};

export const initDropdowns = (triggers: NodeListOf<HTMLButtonElement>) =>
    triggers.forEach((trigger) =>
        trigger.addEventListener("click", onTriggerClick)
    );
