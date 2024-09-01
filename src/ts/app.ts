(async () => {
    const anyForm = document.querySelector<HTMLElement>("[id$=form]");

    if (anyForm) import("./forms.js");

    
    const dialogBtns = document.querySelectorAll<HTMLButtonElement>(
        "[aria-controls^=dialog]"
    );
    
    if (dialogBtns.length)
        (await import("./dialogs.js")).initDialogs(dialogBtns);
    
    const dropdownsTriggers = document.querySelectorAll<HTMLButtonElement>(
        "[aria-controls^=dropdown]"
    );
    
    if (dropdownsTriggers.length)
        (await import("./dropdowns.js")).initDropdowns(dropdownsTriggers);
    
    const tabs = document.querySelectorAll<HTMLUListElement>("[role=tablist]");
    
    if (tabs.length) (await import("./tabs.js")).initTabs(tabs);

    const accordionTriggers = document.querySelectorAll<HTMLButtonElement>(
        "[aria-controls^=accordion]"
    );

    if (accordionTriggers.length)
        (await import("./accordions.js")).initAccordions(accordionTriggers);


    document.addEventListener("show-toaster", ((e: CustomEvent) => {
        import('./toasts.js').then(({toast}) => {
            const { type, text } = e.detail;
            toast[type as keyof typeof toast](text).showToast();
        })
    }) as EventListener);
})();
