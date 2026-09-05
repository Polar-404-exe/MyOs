class Window {
  constructor(elementSelector, openTriggerSelector, closeTriggerSelector, openEvent = "click") {
    this.element = document.querySelector(elementSelector);
    this.openTrigger = document.querySelector(openTriggerSelector);
    this.closeTrigger = this.element ? this.element.querySelector(closeTriggerSelector) : null;
    this.openEvent = openEvent;

    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isDragging = false;
    this.isMinimized = false;
    this.taskbarButton = null;
    this.minimizeButton = this.element ? this.element.querySelector(".minimize") : null;

    this.dragHandler = this.drag.bind(this);
    this.stopDragHandler = this.stopDrag.bind(this);

    this.init();
  }

  init() {
    if (!this.element) return;

    if (this.openTrigger) {
      this.openTrigger.addEventListener(this.openEvent, () => this.open());
    }

    if (this.closeTrigger) {
      this.closeTrigger.addEventListener("click", () => this.close());
    }

    this.createTaskbarButton();
    if (this.minimizeButton) {
      this.minimizeButton.addEventListener("click", () => this.minimize());
    }
    this.makeDraggable();
  }

  open() {
    this.element.style.display = "flex";
    this.isMinimized = false;
    if (!this.taskbarButton) this.createTaskbarButton();
    this.updateTaskbarButton();

    if (this.element.id === "welcome") {
      this.element.style.left = "50%";
      this.element.style.top = "50%";
      this.element.style.transform = "translate(-50%, -50%)";
      return;
    }

    this.element.style.left = "220px";
    this.element.style.top = "120px";
    this.element.style.transform = "none";
  }

  close() {
    this.element.style.display = "none";
    this.isMinimized = false;
    if (this.taskbarButton) {
      this.taskbarButton.hidden = true;
    }
  }

  minimize() {
    this.element.style.display = "none";
    this.isMinimized = true;
    this.updateTaskbarButton();
  }

  createTaskbarButton() {
    const bottomBar = document.querySelector("#bottomBar");
    if (!bottomBar || !this.openTrigger) return;

    this.taskbarButton = document.createElement("button");
    this.taskbarButton.className = "taskbar-app";
    this.taskbarButton.type = "button";
    this.taskbarButton.hidden = true;
    this.taskbarButton.textContent = this.openTrigger.querySelector(".text")?.textContent.trim() || this.element.id;
    this.taskbarButton.addEventListener("click", () => {
      if (this.isMinimized) {
        this.open();
      } else {
        this.minimize();
      }
    });
    bottomBar.appendChild(this.taskbarButton);
  }

  updateTaskbarButton() {
    if (!this.taskbarButton) return;

    this.taskbarButton.hidden = false;
    this.taskbarButton.classList.toggle("minimized", this.isMinimized);
  }

  makeDraggable() {
    const handle = this.element;

    handle.addEventListener("mousedown", (event) => {
      if (event.target.closest(".close, .minimize")) return;

      event.preventDefault();
      const rect = this.element.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      this.isDragging = true;
      this.element.style.transform = "none";
      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", this.dragHandler);
      document.addEventListener("mouseup", this.stopDragHandler);
    });
  }

  drag(event) {
    if (!this.isDragging) return;

    this.element.style.left = (event.clientX - this.dragOffsetX) + "px";
    this.element.style.top = (event.clientY - this.dragOffsetY) + "px";
  }

  stopDrag() {
    this.isDragging = false;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", this.dragHandler);
    document.removeEventListener("mouseup", this.stopDragHandler);
  }
}

const welcomeWindow = new Window("#welcome", "#welcomeopen", ".close", "click");
const musicWindow = new Window("#musicWindow", "#music-button", ".close", "dblclick");
const imgWindow = new Window("#imgWindow", "#img-button", ".close", "dblclick");
const hobbyWindow = new Window("#hobbyWindow", "#hobby-button", ".close", "dblclick");

welcomeWindow.open();

const creativeButton = document.getElementById("creativeButton");

function dropLightbulbs() {
  const bulbCount = 12;

  for (let index = 0; index < bulbCount; index += 1) {
    const bulb = document.createElement("span");
    bulb.className = "falling-bulb";
    bulb.textContent = "💡";
    bulb.style.left = `${Math.random() * 100}vw`;
    bulb.style.animationDelay = `${Math.random() * 0.45}s`;
    bulb.style.setProperty("--sway", `${(Math.random() - 0.5) * 180}px`);
    document.body.appendChild(bulb);

    bulb.addEventListener("animationend", () => bulb.remove(), { once: true });
  }
}

if (creativeButton) {
  creativeButton.addEventListener("click", dropLightbulbs);
  creativeButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dropLightbulbs();
    }
  });
}

function makeIconDraggable(icon) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  icon.addEventListener("mousedown", (event) => {
    event.preventDefault();

    const rect = icon.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    isDragging = true;

    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", moveIcon);
    document.addEventListener("mouseup", stopMovingIcon);
  });

  function moveIcon(event) {
    if (!isDragging) return;

    const nextPosition = keepIconInsideDesktop(
      icon,
      event.clientX - offsetX,
      event.clientY - offsetY
    );
    const nextLeft = nextPosition.left;
    const nextTop = nextPosition.top;
    const moveX = nextLeft - icon.offsetLeft;
    const moveY = nextTop - icon.offsetTop;

    icon.style.left = nextLeft + "px";
    icon.style.top = nextTop + "px";
    pushOverlappingIcons(icon, moveX, moveY);
  }

  function stopMovingIcon() {
    isDragging = false;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", moveIcon);
    document.removeEventListener("mouseup", stopMovingIcon);
  }
}

function pushOverlappingIcons(activeIcon, moveX, moveY) {
  const otherIcons = [...document.querySelectorAll(".buttonapp")]
    .filter((icon) => icon !== activeIcon);
  const activeRect = activeIcon.getBoundingClientRect();

  otherIcons.forEach((otherIcon) => {
    const otherRect = otherIcon.getBoundingClientRect();
    const overlapX = Math.min(activeRect.right, otherRect.right) - Math.max(activeRect.left, otherRect.left);
    const overlapY = Math.min(activeRect.bottom, otherRect.bottom) - Math.max(activeRect.top, otherRect.top);

    if (overlapX <= 0 || overlapY <= 0) return;

    if (Math.abs(moveX) >= Math.abs(moveY)) {
      const direction = moveX >= 0 ? 1 : -1;
      const nextPosition = keepIconInsideDesktop(
        otherIcon,
        otherIcon.offsetLeft + direction * overlapX,
        otherIcon.offsetTop
      );
      otherIcon.style.left = nextPosition.left + "px";
      otherIcon.style.top = nextPosition.top + "px";
    } else {
      const direction = moveY >= 0 ? 1 : -1;
      const nextPosition = keepIconInsideDesktop(
        otherIcon,
        otherIcon.offsetLeft,
        otherIcon.offsetTop + direction * overlapY
      );
      otherIcon.style.left = nextPosition.left + "px";
      otherIcon.style.top = nextPosition.top + "px";
    }
  });
}

function keepIconInsideDesktop(icon, left, top) {
  const topbar = document.querySelector(".topbar");
  const minimumTop = (topbar ? topbar.offsetHeight : 0) + 8;
  const maximumLeft = Math.max(0, window.innerWidth - icon.offsetWidth);
  const maximumTop = Math.max(minimumTop, window.innerHeight - icon.offsetHeight);

  return {
    left: Math.min(Math.max(0, left), maximumLeft),
    top: Math.min(Math.max(minimumTop, top), maximumTop)
  };
}

makeIconDraggable(document.getElementById("music-button"));
makeIconDraggable(document.getElementById("img-button"));
makeIconDraggable(document.getElementById("hobby-button"));

var selectedIcon = null;    

function selectIcon(element) {
  if (selectedIcon === element) {
    deselectIcon(selectedIcon);
    return;
  }

  if (selectedIcon) {
    deselectIcon(selectedIcon);
  }

  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (!element) return;
  element.classList.remove("selected");
  selectedIcon = null;
}
