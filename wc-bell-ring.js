class WCBellRing extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({
			mode: "closed",
		});
	}

	connectedCallback() {
		this.createBell();
	}

	createBell() {
		this.shadow.innerHTML = `${this.css}${this.html}`;
		this.bell = this.shadow.querySelector("span");
		if (this.getClickToRing()) {
			this.bell.addEventListener("click", this.clickHandler.bind(this));
		}
		this.bell.addEventListener(
			"animationstart",
			this.animationstartHandler.bind(this),
		);
		this.bell.addEventListener(
			"animationend",
			this.animationendHandler.bind(this),
		);
	}

	clickHandler() {
		this.bell.style.animationName = `bell-keyframes`;
    this.bell.style.animationDuration = this.getDuration();
		this.bell.style.cursor = "default";
		this.bell.addEventListener("animationend", () => {
			this.bell.style.animation = "";
			this.bell.style.cursor = "pointer";
		});
	}
	animationstartHandler() {
		this.ringing = "true";
	}
	animationendHandler() {
		this.ringing = "false";
	}

	get html() {
		return `
      <span>🔔</span>
    `;
	}
	get css() {
		return `
      <style>
        @keyframes bell-keyframes {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        
        span {
          display: inline-block;
          font-size: ${this.getFontSize() || "default"};
          transform-origin: top center;
          user-select: none; 
          cursor: ${this.getClickToRing() ? "pointer" : "default"};
          ${
						this.noShadow
							? ""
							: "filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));"
					}${
						this.initialTimes !== 0
							? `
          animation-duration: ${this.getDuration};
          animation-iteration-count: ${this.initialTimes};
          animation-name: bell-keyframes;
              `
							: ""
					}  
        }
        
      </style>
    `;
	}
	get initialTimes() {
		if (this.hasAttribute("times")) {
			const times = this.getAttribute("times");
			return times === "infinite" ? "infinite" : Number(times);
		} else {
			return 0;
		}
	}
	get noShadow() {
		if (this.hasAttribute("no-shadow")) {
			return this.getAttribute("no-shadow") === "true";
		}
		return false;
	}
	getFontSize() {
		if (this.hasAttribute("font-size")) {
			if (CSS.supports("font-size", this.getAttribute("font-size")))
				return this.getAttribute("font-size");
		}
	}
	getClickToRing() {
		if (this.hasAttribute("click-to-ring")) {
			return this.getAttribute("click-to-ring") === "true";
		}
		return false;
	}
	getDuration() {
		if (
			this.hasAttribute("duration") &&
			CSS.supports("animation-duration", this.getAttribute("duration"))
		) {
			return this.getAttribute("duration");
		} else {
			return "1s";
		}
	}
	set ringing(newValue) {
		if (newValue == "true") {
			this.dispatchEvent(
				new CustomEvent("bell-ringing", {
					bubbles: true,
					cancelable: true,
					detail: "The bell is ringing.",
				}),
			);
			this.setAttribute("ringing", newValue);
		} else {
			this.dispatchEvent(
				new CustomEvent("bell-stopped", {
					bubbles: true,
					cancelable: true,
					detail: "The bell is not ringing.",
				}),
			);
			this.removeAttribute("ringing");
		}
	}
}
window.customElements.define("wc-bell-ring", WCBellRing);
