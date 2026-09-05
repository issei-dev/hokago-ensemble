// File: assets/js/site.js

"use strict";

/**
 * HTML内のscript要素に指定されたdata-baseを取得します。
 *
 * ルート直下のHTML:
 * data-base="."
 *
 * media、eventsディレクトリ内のHTML:
 * data-base=".."
 */
const getBasePath = () => {
  const script = document.querySelector("script[data-base]");

  return script?.dataset.base || ".";
};

const basePath = getBasePath();

/**
 * 共通ナビゲーションの項目を定義します。
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
  },
  {
    key: "hokaan",
    label: "#ほかアン",
    href: `${basePath}/hokaan.html`
  }
];

/**
 * viewportメタタグが存在しない場合に追加します。
 */
const ensureViewport = () => {
  let viewport = document.querySelector(
    'meta[name="viewport"]'
  );

  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head.append(viewport);
  }

  viewport.content =
    "width=device-width, initial-scale=1, viewport-fit=cover";
};

/**
 * 共通ヘッダーを生成します。
 */
const createHeader = () => {
  const target = document.querySelector(
    "[data-site-header]"
  );

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
          aria-label="放課後アンサンブル トップページへ戻る"
        >
          <img
            class="site-logo__image"
            src="${basePath}/assets/images/common/header-logo.png"
            alt="放課後アンサンブル"
            width="80"
            height="60"
          >
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
  const target = document.querySelector(
    "[data-site-footer]"
  );

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
            <a
              class="site-footer__logo"
              href="${basePath}/index.html"
              aria-label="放課後アンサンブル トップページへ戻る"
            >
              <img
                src="${basePath}/assets/images/common/header-logo.png"
                alt="放課後アンサンブル"
                width="160"
                height="120"
                loading="lazy"
              >
            </a>

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
  const button = document.querySelector(
    "[data-menu-button]"
  );

  const navigation = document.querySelector(
    "[data-global-nav]"
  );

  if (!button || !navigation) {
    return;
  }

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute(
      "aria-label",
      "メニューを開く"
    );
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    navigation.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute(
      "aria-label",
      "メニューを閉じる"
    );
    document.body.classList.add("menu-open");
  };

  button.addEventListener("click", () => {
    const isOpen =
      navigation.classList.contains("is-open");

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
    if (window.innerWidth >= 960) {
      closeMenu();
    }
  });
};

/**
 * トップページのスライダーを制御します。
 */
const initializeSlider = () => {
  const slider = document.querySelector(
    "[data-slider]"
  );

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

    dotsContainer.append(button);

    return button;
  });

  const showSlide = (nextIndex) => {
    currentIndex =
      (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;

      slide.classList.toggle(
        "is-active",
        isActive
      );

      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      dots[index].classList.toggle(
        "is-active",
        isActive
      );

      if (isActive) {
        dots[index].setAttribute(
          "aria-current",
          "true"
        );
      } else {
        dots[index].removeAttribute(
          "aria-current"
        );
      }
    });
  };

  const stopTimer = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startTimer = () => {
    stopTimer();

    if (!isPaused && slides.length > 1) {
      intervalId = window.setInterval(() => {
        showSlide(currentIndex + 1);
      }, intervalDuration);
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startTimer();
    });
  });

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseButton.textContent =
        isPaused ? "▶" : "Ⅱ";

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

  slider.addEventListener(
    "mouseenter",
    stopTimer
  );

  slider.addEventListener(
    "mouseleave",
    startTimer
  );

  slider.addEventListener(
    "focusin",
    stopTimer
  );

  slider.addEventListener(
    "focusout",
    startTimer
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    }
  );

  showSlide(0);
  startTimer();
};

/**
 * 画像拡大モーダルを制御します。
 */
const initializeImageModal = () => {
  const modalImages = document.querySelectorAll(
    "[data-modal-image]"
  );

  if (modalImages.length === 0) {
    return;
  }

  const modal = document.createElement("div");

  modal.className = "image-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute(
    "aria-label",
    "画像の拡大表示"
  );

  modal.innerHTML = `
    <button
      class="image-modal__backdrop"
      type="button"
      aria-label="拡大画像を閉じる"
      data-modal-close
    ></button>

    <div class="image-modal__panel">
      <button
        class="image-modal__close"
        type="button"
        aria-label="拡大画像を閉じる"
        data-modal-close
      >
        ×
      </button>

      <img
        class="image-modal__image"
        src=""
        alt=""
      >

      <p class="image-modal__caption"></p>
    </div>
  `;

  document.body.append(modal);

  const enlargedImage = modal.querySelector(
    ".image-modal__image"
  );

  const caption = modal.querySelector(
    ".image-modal__caption"
  );

  const closeButton = modal.querySelector(
    ".image-modal__close"
  );

  let previouslyFocusedElement = null;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");

    enlargedImage.removeAttribute("src");
    enlargedImage.alt = "";
    caption.textContent = "";

    if (
      previouslyFocusedElement instanceof HTMLElement
    ) {
      previouslyFocusedElement.focus();
    }
  };

  const openModal = (image) => {
    previouslyFocusedElement =
      document.activeElement;

    enlargedImage.src =
      image.currentSrc || image.src;

    enlargedImage.alt = image.alt;

    caption.textContent =
      image.dataset.modalCaption ||
      image.alt;

    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeButton.focus();
  };

  modalImages.forEach((image) => {
    const button = image.closest("button");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      openModal(image);
    });
  });

  modal
    .querySelectorAll("[data-modal-close]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeModal
      );
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        !modal.hidden
      ) {
        closeModal();
      }
    }
  );
};

/**
 * 読み込めなかった画像へエラー用クラスを付与します。
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

    image.addEventListener(
      "error",
      markAsError
    );

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      markAsError();
    }
  });
};

/**
 * ページ内リンクを滑らかにスクロールさせます。
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

      let target = null;

      try {
        target = document.querySelector(href);
      } catch (error) {
        console.error(
          "無効なアンカーリンクです:",
          href,
          error
        );

        return;
      }

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.history.replaceState(
        null,
        "",
        href
      );
    });
  });
};

/**
 * 「#ほかアン」のメンバー別フィルターを制御します。
 */
const initializeHokaanFilter = () => {
  const filterContainer = document.querySelector(
    "[data-hokaan-filter]"
  );

  const gallery = document.querySelector(
    "[data-hokaan-grid]"
  );

  if (!filterContainer || !gallery) {
    return;
  }

  const buttons = Array.from(
    filterContainer.querySelectorAll(
      "[data-filter]"
    )
  );

  const cards = Array.from(
    gallery.querySelectorAll("[data-member]")
  );

  const result = document.querySelector(
    "[data-filter-result]"
  );

  const memberNames = {
    all: "すべて",
    hiyori: "桜庭ひより",
    tsumugi: "水瀬つむぎ",
    koharu: "日向こはる",
    reina: "白石れいな",
    madoka: "橘まどか"
  };

  const updateResult = (
    filter,
    visibleCount
  ) => {
    if (!result) {
      return;
    }

    if (filter === "all") {
      result.textContent =
        `${visibleCount}枚の写真を表示しています`;

      return;
    }

    const memberName =
      memberNames[filter] ||
      "選択したメンバー";

    result.textContent =
      `${memberName}の写真を` +
      `${visibleCount}枚表示しています`;
  };

  const applyFilter = (filter) => {
    let visibleCount = 0;

    buttons.forEach((button) => {
      const isActive =
        button.dataset.filter === filter;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    cards.forEach((card) => {
      const shouldShow =
        filter === "all" ||
        card.dataset.member === filter;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    updateResult(filter, visibleCount);
  };

  filterContainer.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        "[data-filter]"
      );

      if (!button) {
        return;
      }

      const filter =
        button.dataset.filter || "all";

      applyFilter(filter);
    }
  );

  applyFilter("all");
};

/**
 * サイト全体を初期化します。
 */
const initializeSite = () => {
  ensureViewport();
  createHeader();
  createFooter();
  initializeMenu();
  initializeSlider();
  initializeImageModal();
  initializeImageErrorHandling();
  initializeAnchorNavigation();
  initializeHokaanFilter();
};

initializeSite();
