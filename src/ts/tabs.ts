export const togglePanels = (
    prevPanel: HTMLElement,
    nextPanel: HTMLElement
) => {
    prevPanel.classList.add("opacity-0");
    prevPanel.addEventListener(
        "transitionend",
        () => {
            prevPanel.classList.add("hidden");
            nextPanel.classList.remove("hidden");
            setTimeout(() => {
                nextPanel.classList.remove("opacity-0");
            }, 0);
        },
        { once: true }
    );
};

type ChangeTabParams = {
    nextTab: HTMLElement;
    prevTab?: HTMLElement | null;
    tablist: HTMLUListElement;
};

export const changeTab = ({
    nextTab,
    tablist,
    prevTab,
}: ChangeTabParams) => {
    prevTab ??= tablist.querySelector<HTMLElement>('[aria-selected="true"]');

    if (prevTab === nextTab) return;
    const nextPanel = document.querySelector<HTMLElement>(
        `#${nextTab.getAttribute("aria-controls")}`
    );
      const prevPanel = document.querySelector<HTMLElement>(
        `#${prevTab?.getAttribute("aria-controls")}`
    );

    if (!prevTab || !nextPanel || !prevPanel) return;

    prevTab.ariaSelected = "false";
    nextTab.ariaSelected = "true";
    togglePanels(prevPanel, nextPanel);
};

export const onTabListClick: EventListener = (e) => {
    const target = e.target as HTMLElement;

    const nextTab =
        target.getAttribute("role") === "tab"
            ? target
            : target
                  .closest<HTMLLIElement>("li")
                  ?.querySelector<HTMLElement>("[role=tab]");
    if (!nextTab) return;

    changeTab({ nextTab, tablist: e.currentTarget as HTMLUListElement });
};

export const initTabs = (tabsLists: NodeListOf<HTMLUListElement>) =>
    tabsLists.forEach(
        (tabList) =>
            !("manual" in tabList.dataset) &&
            tabList.addEventListener("click", onTabListClick)
    );
