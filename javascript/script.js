class Window {
  constructor(elementSelector, openTriggerSelector, closeTriggerSelector) {
    this.element = document.querySelector(elementSelector);
    this.openTrigger = document.querySelector(openTriggerSelector);
    this.closeTrigger = this.element ? this.element.querySelector(closeTriggerSelector) : null;

    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;

    this.dragHandler = this.drag.bind(this);
    this.stopDragHandler = this.stopDrag.bind(this);

    this.init();
  }

  init() {
    if (!this.element) return;

    if (this.openTrigger) {
      this.openTrigger.addEventListener("click", () => this.open());
    }

    if (this.closeTrigger) {
      this.closeTrigger.addEventListener("click", () => this.close());
    }

    this.makeDraggable();
  }

  open() {
    this.element.style.display = "flex";
  }

  close() {
    this.element.style.display = "none";
  }

  makeDraggable() {
    const handle = this.element.querySelector(".header") || this.element;

    handle.addEventListener("mousedown", (event) => {
      event.preventDefault();

      this.pos3 = event.clientX;
      this.pos4 = event.clientY;

      document.addEventListener("mousemove", this.dragHandler);
      document.addEventListener("mouseup", this.stopDragHandler);
    });
  }

  drag(event) {
    event.preventDefault();

    this.pos1 = this.pos3 - event.clientX;
    this.pos2 = this.pos4 - event.clientY;
    this.pos3 = event.clientX;
    this.pos4 = event.clientY;

    this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
    this.element.style.left = (this.element.offsetLeft - this.pos1) + "px";
  }

  stopDrag() {
    document.removeEventListener("mousemove", this.dragHandler);
    document.removeEventListener("mouseup", this.stopDragHandler);
  }
}

const welcomeWindow = new Window("#welcome", "#welcomeopen", ".close");
const music = new Window("#music","#music", ".close");

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
