const onTriggerClick: EventListener = (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.ariaExpanded = `${!JSON.parse(btn.ariaExpanded ?? "")}`;
    const accordion = document.querySelector(
        `#${btn.getAttribute("aria-controls")}`
    )?.parentElement;
    accordion?.classList.toggle(
        "grid-rows-[min-content_1fr]",
        btn.ariaExpanded === "true"
    );
    accordion?.classList.toggle(
        "grid-rows-[min-content_0fr]",
        btn.ariaExpanded !== "true"
    );
};

export const initAccordions = (accordions: NodeList) =>
    accordions.forEach((accordion) =>
        accordion.addEventListener("click", onTriggerClick)
    );
