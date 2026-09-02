// File: assets/js/site.js

const initializeMenu = () => {
  const button = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-global-nav]");

  if (!button || !navigation) {
    return;
  }

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "メニューを開く");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    navigation.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "メニューを閉じる");
    document.body.classList.add("menu-open");
  };

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
};
