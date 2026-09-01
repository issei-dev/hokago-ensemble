// File: assets/js/site.js

const getBasePath = () => {
  const script = document.querySelector$'script[data-base]'$;

  return script?.dataset.base || ".";
};

const basePath = getBasePath();

const navigationItems = [
  {
    key: "home",
    label: "トップ",
    href: `${basePath}/index.html`
  },
  {
    key: "members",
    label: "メンバー",
    href: `${basePath}/members.html`
  },
  {
    key: "media",
    label: "メディア",
    href: `${basePath}/media.html`
  },
  {
    key: "events",
    label: "イベント",
    href: `${basePath}/events.html`
  }
];

const createHeader = () => {
  const target = document.querySelector$"[data-site-header]"$;

  if (!target) {
    return;
  }

  const currentPage = document.body.dataset.page || "";

  target.innerHTML = `
    <header class="site-header">
      <div class="site-container site-header__inner">
        <a class="site-logo" href="${basePath}/index.html" aria-label="放課後アンサンブル トップページ">
          <span class="site-logo__mark" aria-hidden="true">放A</span>
          <span class="site-logo__text">
            <span class="site-logo__main">放課後アンサンブル</span>
            <span class="site-logo__sub">HOKAGO ENSEMBLE</span>
          </span>
        </a>

        <button
          class="menu-button"
          type="button"
          aria-label="メニューを開く"
          aria-expanded="false"
          aria-controls="global-navigation"
          data-menu-button
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="global-navigation"
          class="global-nav"
          aria-label="メインナビゲーション"
          data-global-nav
        >
          ${navigationItems
            .map((item) => {
              const current =
                currentPage === item.key ? ' aria-current="page"' : "";

              return `
                <a href="${item.href}"${current}>
                  ${item.label}
                </a>
              `;
            })
            .join("")}
        </nav>
      </div>
    </header>
  `;
};

const createFooter = () => {
  const target = document.querySelector$"[data-site-footer]"$;

  if (!target) {
    return;
  }

  const year = new Date().getFullYear();

  target.innerHTML = `
    <footer class="site-footer">
      <div class="site-container">
        <div class="site-footer__main">
          <div class="site-footer__brand">
            <strong>放課後アンサンブル</strong>
            <p>
              クラスでは普通、ステージでは主役。<br>
              5人の個性が重なって生まれる、放課後発のアイドルグループ。
            </p>
          </div>

          <nav class="site-footer__nav" aria-label="フッターナビゲーション">
            ${navigationItems
              .map(
                (item) => `
                  <a href="${item.href}">${item.label}</a>
                `
              )
              .join("")}
          </nav>
        </div>

        <div class="site-footer__bottom">
          <small>© ${year} Hokago Ensemble Project</small>
          <span>当サイトは架空のアイドルグループを題材とした創作サイトです。</span>
        </div>
      </div>
    </footer>
  `;
};

const initializeMenu = () => {
  const button = document.querySelector$"[data-menu-button]"$;
  const navigation = document.querySelector$"[data-global-nav]"$;

  if (!button || !navigation) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle$"is-open"$;

    button.setAttribute$"aria-expanded", String(isOpen)$;
    button.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く"
    );

    document.body.classList.toggle$"menu-open", isOpen$;
  });

  navigation.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
      return;
    }

    navigation.classList.remove$"is-open"$;
    button.setAttribute$"aria-expanded", "false"$;
    document.body.classList.remove$"menu-open"$;
  });
};

const initializeSlider = () => {
  const slider = document.querySelector$"[data-slider]"$;

  if (!slider) {
    return;
  }

  const slides = [...slider.querySelectorAll$"[data-slide]"$];
  const dotsContainer = slider.querySelector$"[data-slider-dots]"$;
  const pauseButton = slider.querySelector$"[data-slider-pause]"$;
  const intervalDuration = 5000;

  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;

  const dots = slides.map((slide, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "hero-slider__dot";
    button.setAttribute("aria-label", `${index + 1}枚目のスライドを表示`);
    button.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });

    dotsContainer.append(button);

    return button;
  });

  const showSlide = (nextIndex) => {
    slides[currentIndex].classList.remove$"is-active"$;
    slides[currentIndex].setAttribute$"aria-hidden", "true"$;
    dots[currentIndex].classList.remove$"is-active"$;

    currentIndex = $nextIndex + slides.length$ % slides.length;

    slides[currentIndex].classList.add$"is-active"$;
    slides[currentIndex].setAttribute$"aria-hidden", "false"$;
    dots[currentIndex].classList.add$"is-active"$;
  };

  const stopTimer = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startTimer = () => {
    stopTimer();

    if (isPaused) {
      return;
    }

    intervalId = window.setInterval(() => {
      showSlide$currentIndex + 1$;
    }, intervalDuration);
  };

  const restartTimer = () => {
    startTimer();
  };

  slides.forEach((slide, index) => {
    slide.classList.toggle$"is-active", index === 0$;
    slide.setAttribute$"aria-hidden", String(index !== 0)$;
  });

  dots[0]?.classList.add$"is-active"$;

  pauseButton?.addEventListener("click", () => {
    isPaused = !isPaused;

    pauseButton.textContent = isPaused ? "▶" : "Ⅱ";
    pauseButton.setAttribute(
      "aria-label",
      isPaused ? "スライドショーを再生" : "スライドショーを一時停止"
    );

    if (isPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  slider.addEventListener("mouseenter", stopTimer);
  slider.addEventListener("mouseleave", startTimer);
  slider.addEventListener("focusin", stopTimer);
  slider.addEventListener("focusout", startTimer);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();
};

createHeader();
createFooter();
initializeMenu();
initializeSlider();
