class Window {
  constructor(elementSelector, openTriggerSelector, closeTriggerSelector, openEvent = "click") {
    this.element = document.querySelector(elementSelector);
    this.openTrigger = document.querySelector(openTriggerSelector);
    this.closeTrigger = this.element ? this.element.querySelector(closeTriggerSelector) : null;
    this.openEvent = openEvent;

    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isDragging = false;

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

    this.makeDraggable();
  }

  open() {
    this.element.style.display = "flex";

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
  }

  makeDraggable() {
    const handle = this.element;

    handle.addEventListener("mousedown", (event) => {
      if (event.target.closest(".close")) return;

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

welcomeWindow.open();

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

    icon.style.left = (event.clientX - offsetX) + "px";
    icon.style.top = (event.clientY - offsetY) + "px";
  }

  function stopMovingIcon() {
    isDragging = false;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", moveIcon);
    document.removeEventListener("mouseup", stopMovingIcon);
  }
}

makeIconDraggable(document.getElementById("music-button"));

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
