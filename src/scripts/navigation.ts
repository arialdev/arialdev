const menu = document.querySelector<HTMLDetailsElement>(".site-menu");
const summary = menu?.querySelector("summary");
const nav = menu?.querySelector("nav");
const main = document.querySelector("main");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const easing = "cubic-bezier(.22, 1, .36, 1)";
let menuExpanded = menu?.open ?? false;
let menuRevision = 0;
let menuAnimations: Animation[] = [];
let viewRevision = 0;
let viewAnimation: Animation | undefined;

// Catch cancellation as well as completion so interrupted transitions settle cleanly.
const finished = (animation: Animation) => animation.finished.catch(() => {});

async function setMenu(open: boolean, animate = true) {
  if (!menu || !nav || !summary) return;
  if (menuExpanded === open && menu.open === open && (animate || menuAnimations.length === 0))
    return;
  const revision = ++menuRevision;
  const previous = getComputedStyle(nav);
  const from = { opacity: previous.opacity, transform: previous.transform };
  const wasOpen = menu.open;
  menuAnimations.forEach((animation) => animation.cancel());
  menuAnimations = [];
  menuExpanded = open;
  menu.classList.toggle("is-closing", !open);
  summary.setAttribute("aria-expanded", String(open));
  nav.inert = !open;
  if (main) main.inert = open;
  document.body.classList.toggle("menu-open", open);

  if (open) menu.open = true;
  if (animate && !motion.matches && (open || wasOpen)) {
    menuAnimations.push(
      nav.animate(
        [
          open && !wasOpen ? { opacity: 0, transform: "translateY(12px)" } : from,
          { opacity: open ? 1 : 0, transform: open ? "none" : "translateY(-8px)" },
        ],
        { duration: open ? 320 : 200, easing, fill: "both" },
      ),
    );
    if (open && !wasOpen) {
      nav.querySelectorAll("a").forEach((link, index) => {
        menuAnimations.push(
          link.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 300, delay: 40 + index * 35, easing, fill: "both" },
          ),
        );
      });
    }
    await Promise.all(menuAnimations.map(finished));
  }
  if (revision !== menuRevision) return;
  menu.open = open;
  menu.classList.remove("is-closing");
  menuAnimations.forEach((animation) => animation.cancel());
  menuAnimations = [];
}

summary?.setAttribute("aria-expanded", String(menuExpanded));
summary?.addEventListener("click", (event) => {
  event.preventDefault();
  // Commit a pending destination before opening its menu.
  if (!menuExpanded && hasViews) void showView(false, false);
  void setMenu(!menuExpanded);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuExpanded) {
    event.preventDefault();
    void setMenu(false);
    summary?.focus({ preventScroll: true });
  }
});

const hasViews = Boolean(document.querySelector("[data-view-panel]"));
const resolveView = () => {
  const hash = location.hash.slice(1);
  return hash === "experience"
    ? "about"
    : ["about", "projects", "contact"].includes(hash)
      ? hash
      : "home";
};

async function showView(focus: boolean, animate = true) {
  const revision = ++viewRevision;
  const view = resolveView();
  const previous = document.documentElement.dataset.view;
  const outgoing = document.getElementById(previous ?? "home");
  const target = document.getElementById(location.hash === "#experience" ? "experience" : view);
  const fromOpacity = outgoing ? getComputedStyle(outgoing).opacity : "1";
  viewAnimation?.cancel();
  viewAnimation = undefined;
  const fromMenu = menu?.open ?? false;
  const close = setMenu(false, animate);
  const transition = animate && !motion.matches && previous !== view && !fromMenu;

  if (transition && outgoing) {
    viewAnimation = outgoing.animate(
      [
        { opacity: fromOpacity, transform: "none" },
        { opacity: 0, transform: "translateY(-8px)" },
      ],
      { duration: 140, easing: "ease-out", fill: "both" },
    );
    await finished(viewAnimation);
    if (revision !== viewRevision) return;
    viewAnimation.cancel();
  }

  document.documentElement.dataset.view = view;
  if (location.hash === "#experience")
    target?.scrollIntoView({ behavior: "instant", block: "start" });
  else window.scrollTo({ top: 0, behavior: "instant" });
  if (fromMenu) await close;
  if (revision !== viewRevision) return;
  if (focus && target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
  const incoming = document.getElementById(view);
  if (transition && incoming) {
    viewAnimation = incoming.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 320, easing, fill: "both" },
    );
    await finished(viewAnimation);
    if (revision !== viewRevision) return;
    viewAnimation.cancel();
    viewAnimation = undefined;
  }
}

document.querySelector(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (hasViews) void showView(false, false);
  else void setMenu(false, false);
  main?.focus({ preventScroll: true });
});

if (hasViews) {
  // Each enhanced view is a page; the static, continuous document keeps its H1/H2 hierarchy.
  document.querySelectorAll("[data-view-heading], [data-view-subheading]").forEach((heading) => {
    const replacement = document.createElement(
      heading.hasAttribute("data-view-heading") ? "h1" : "h2",
    );
    for (const attribute of heading.attributes)
      replacement.setAttribute(attribute.name, attribute.value);
    replacement.append(...heading.childNodes);
    heading.replaceWith(replacement);
  });
  // Handle real anchors before their native scroll, including repeated Home selections.
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href);
    if (
      url.origin !== location.origin ||
      url.pathname !== location.pathname ||
      url.search !== location.search ||
      !["#home", "#about", "#experience", "#projects", "#contact"].includes(url.hash)
    )
      return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, "", url);
    void showView(true);
  });
  void showView(false, false);
  window.addEventListener("hashchange", () => {
    void showView(true);
  });
  window.addEventListener("pageshow", () => {
    void showView(false, false);
  });
}

motion.addEventListener("change", () => {
  if (!motion.matches) return;
  if (viewAnimation) void showView(true, false);
  void setMenu(menuExpanded, false);
});
