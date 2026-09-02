// File: assets/js/site.js

"use strict";

/**
 * HTML内のscriptタグに指定されたdata-baseを取得します。
 *
 * ルート直下のHTML:
 * data-base="."
 *
 * media、eventsディレクトリ内のHTML:
 * data-base=".."
 */
const getBasePath = () => {
  const script = document.querySelector("script[data-base]");

  if (!script) {
    return ".";
  }

  return script.dataset.base || ".";
};

const basePath = getBasePath();

/**
 * viewportメタタグが欠落していた場合の保険です。
 * 各HTMLにも直接記載することを推奨します。
 */
const ensureViewport = () => {
  let viewport = document.querySelector('meta[name="viewport"]');

  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head.append(viewport);
  }

  viewport.content =
    "width=device-width, initial-scale=1, viewport-fit=cover";
};

/**
 * ナビゲーション定義
 */
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

/**
 * 共通ヘッダーを生成します。
 */
const createHeader = () => {
  const target = document.querySelector("[data-site-header]");

  if (!target) {
    return;
  }

  const currentPage = document.body.dataset.page || "";

  const navigationHtml = navigationItems
    .map((item) => {
      const currentAttribute =
        currentPage === item.key
          ? ' aria-current="page"'
          : "";

      return `
        <a href="${item.href}"${currentAttribute}>
          ${item.label}
        </a>
      `;
    })
    .join("");

  target.innerHTML = `
    <header class="site-header">
      <div class="site-container site-header__inner">
        <a
          class="site-logo"
          href="${basePath}/index.html"
          aria-label="放課後アンサンブル トップページ"
        >
          <span class="site-logo__mark" aria-hidden="true">
            放A
          </span>

          <span class="site-logo__text">
            <span class="site-logo__main">
              放課後アンサンブル
            </span>

            <span class="site-logo__sub">
              HOKAGO ENSEMBLE
            </span>
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
          ${navigationHtml}
        </nav>
      </div>
    </header>
  `;
};

/**
 * 共通フッターを生成します。
 */
const createFooter = () => {
  const target = document.querySelector("[data-site-footer]");

  if (!target) {
    return;
  }

  const currentYear = new Date().getFullYear();

  const navigationHtml = navigationItems
    .map((item) => {
      return `
        <a href="${item.href}">
          ${item.label}
        </a>
      `;
    })
    .join("");

  target.innerHTML = `
    <footer class="site-footer">
      <div class="site-container">
        <div class="site-footer__main">
          <div class="site-footer__brand">
            <strong>
              放課後アンサンブル
            </strong>

            <p>
              クラスでは普通、ステージでは主役。<br>
              5人の個性が重なって生まれる、
              放課後発のアイドルグループ。
            </p>
          </div>

          <nav
            class="site-footer__nav"
            aria-label="フッターナビゲーション"
          >
            ${navigationHtml}
          </nav>
        </div>

        <div class="site-footer__bottom">
          <small>
            © ${currentYear} Hokago Ensemble Project
          </small>

          <span>
            当サイトは架空のアイドルグループを題材とした創作サイトです。
          </span>
        </div>
      </div>
    </footer>
  `;
};

/**
 * スマートフォンメニューを制御します。
 */
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
    const link = event.target.closest("a");

    if (link) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      closeMenu();
    }
  });
};

/**
 * トップページのスライダーを制御します。
 */
const initializeSlider = () => {
  const slider = document.querySelector("[data-slider]");

  if (!slider) {
    return;
  }

  const slides = Array.from(
    slider.querySelectorAll("[data-slide]")
  );

  const dotsContainer = slider.querySelector(
    "[data-slider-dots]"
  );

  const pauseButton = slider.querySelector(
    "[data-slider-pause]"
  );

  if (slides.length === 0 || !dotsContainer) {
    return;
  }

  const intervalDuration = 5000;

  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;

  const dots = slides.map((slide, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "hero-slider__dot";

    button.setAttribute(
      "aria-label",
      `${index + 1}枚目のスライドを表示`
    );

    button.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });

    dotsContainer.append(button);

    return button;
  });

  const showSlide = (nextIndex) => {
    slides[currentIndex].classList.remove("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");

    dots[currentIndex].classList.remove("is-active");
    dots[currentIndex].removeAttribute("aria-current");

    currentIndex =
      (nextIndex + slides.length) % slides.length;

    slides[currentIndex].classList.add("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "false");

    dots[currentIndex].classList.add("is-active");
    dots[currentIndex].setAttribute("aria-current", "true");
  };

  const stopTimer = () => {
    if (intervalId !== null) {
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
      showSlide(currentIndex + 1);
    }, intervalDuration);
  };

  const restartTimer = () => {
    startTimer();
  };

  slides.forEach((slide, index) => {
    const isFirst = index === 0;

    slide.classList.toggle("is-active", isFirst);
    slide.setAttribute(
      "aria-hidden",
      String(!isFirst)
    );
  });

  dots[0].classList.add("is-active");
  dots[0].setAttribute("aria-current", "true");

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;

      pauseButton.textContent = isPaused ? "▶" : "Ⅱ";

      pauseButton.setAttribute(
        "aria-label",
        isPaused
          ? "スライドショーを再生"
          : "スライドショーを一時停止"
      );

      if (isPaused) {
        stopTimer();
      } else {
        startTimer();
      }
    });
  }

  slider.addEventListener("mouseenter", stopTimer);

  slider.addEventListener("mouseleave", () => {
    startTimer();
  });

  slider.addEventListener("focusin", stopTimer);

  slider.addEventListener("focusout", () => {
    startTimer();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();
};

/**
 * 画像の読み込み失敗を検知します。
 *
 * 画像パスが間違っている場合、何も表示されない代わりに
 * CSSでエラーメッセージを表示します。
 */
const initializeImageErrorHandling = () => {
  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    const markAsError = () => {
      image.classList.add("image-error");

      console.error(
        "画像を読み込めませんでした:",
        image.getAttribute("src")
      );
    };

    image.addEventListener("error", markAsError);

    if (image.complete && image.naturalWidth === 0) {
      markAsError();
    }
  });
};

/**
 * ページ内アンカー移動時の位置を調整します。
 */
const initializeAnchorNavigation = () => {
  const links = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.history.replaceState(null, "", href);
    });
  });
};

/**
 * 初期化
 */
const initializeSite = () => {
  ensureViewport();
  createHeader();
  createFooter();
  initializeMenu();
  initializeSlider();
  initializeImageErrorHandling();
  initializeAnchorNavigation();
};

initializeSite();
