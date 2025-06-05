
const View = {
  currentOverlay: null,
  handleFocus(event) {
    if (Model.isActive) {
      event.target.style.borderColor = "red";
    }
  },
  handleBlur(event) {
    if (Model.isActive) {
      event.target.style.borderColor = "";
    }
  },
  updateHighlight() {
    if (
      Model.isActive &&
      document.activeElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable)
    ) {
      document.activeElement.style.borderColor = "red";
    }
  },
  showToggleMessage(message) {
    if (this.currentOverlay) {
      clearTimeout(this.currentOverlay.fadeTimeout);
      document.body.removeChild(this.currentOverlay);
    }
    const overlay = document.createElement("div");
    overlay.textContent = message;
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 24px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.5s;
      z-index: 10000;
    `;
    document.body.appendChild(overlay);
    this.currentOverlay = overlay;
    setTimeout(() => {
      overlay.style.opacity = 1;
    }, 10);
    overlay.fadeTimeout = setTimeout(() => {
      overlay.style.opacity = 0;
      setTimeout(() => {
        if (this.currentOverlay === overlay) {
          document.body.removeChild(overlay);
          this.currentOverlay = null;
        }
      }, 500);
    }, 2500);
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { View };
}
