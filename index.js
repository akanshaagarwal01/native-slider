(function () {
  function Slider(container, particulars) {
    this._particulars = JSON.parse(JSON.stringify(particulars));
    this._min = +(this._particulars.min || 0);
    this._max = +(this._particulars.max || 100);
    this._id = this._particulars.id || "";
    this._steps = +(this._particulars.steps || 0);
    this._curr = +(this._particulars.curr || this._particulars.min);
    this._DOMElements = {};
    Slider.prototype.renderSlider.call(this, container);
  }

  Slider.prototype.renderSlider = function (container) {
    let sliderBody = document.createElement("div");
    sliderBody.id = `sliderBody_${this._id}`;
    sliderBody.className = "sliderBody";
    let maxLeft = `${parseInt(container.style.width) - 20}px`;
    let sHtml = `<div id = "horz_${this._id}" class = "horz">
        <div id = "seeker_${this._id}" class = "seeker"></div>
        <div id = "traversed_${this._id}" class = "traversed"></div>
	</div>
        <div id = "min_${this._id}" class = "min"></div>
        <div id = "max_${
      this._id
      }" class = "max" style = "left:${maxLeft}"></div>`;
    sliderBody.innerHTML = sHtml;
    container.append(sliderBody);
    if (this._particulars.steps > 0) {
      this.makeSliderSteps();
    }
    this.initializeDOMElements();
  };

  Slider.prototype.makeSliderSteps = function () {
    let horz = document.getElementById(`horz_${this._id}`);
    let horzWidth = parseInt(getComputedStyle(horz).width);
    this.stepWidth = horzWidth / this._steps;
    this.stepsArr = [];
    for (let i = 0; i <= this._steps; i++) {
      horz.append(renderStep.call(this, i));
    }
    function renderStep(i) {
      let step = document.createElement("div");
      step.className = "step";
      step.id = `step_${this._id}_${i}`;
      step.style.left =
        i === 0
          ? 0
          : i === this._steps ? horzWidth - 14 : this.stepWidth * i - 7;
      this.stepsArr.push(step);
      return step;
    }
  };

  Slider.prototype.initializeDOMElements = function () {
    this._DOMElements = {
      seeker: document.getElementById(`seeker_${this._id}`),
      horz: document.getElementById(`horz_${this._id}`),
      min: document.getElementById(`min_${this._id}`),
      max: document.getElementById(`max_${this._id}`),
      traversed: document.getElementById(`traversed_${this._id}`)
    };
    this._DOMElements.min.innerHTML = this._min;
    this._DOMElements.max.innerHTML = this._max;
    this.dragSeekerBind = this.dragSeeker.bind(this);
    this.dropSeekerBind = this.dropSeeker.bind(this);
    this.clickSliderBind = this.clickSlider.bind(this);
    this._DOMElements.seeker.addEventListener(
      "mousedown",
      this.grabSeeker.bind(this)
    );
    this._DOMElements.horz.addEventListener(
      "click",
      this.clickSliderBind
    );
    this._DOMElements.seeker.ondragstart = function () {
      return false;
    };
  };

  Slider.prototype.grabSeeker = function () {
    document.addEventListener("mousemove", this.dragSeekerBind);
    document.addEventListener("mouseup", this.dropSeekerBind);
  };

  Slider.prototype.clickSlider = function (event) {
    this.moveSeeker(event);
    if (this._steps > 0) {
      this.adjustSteps();
    }
    onSliderMove(this._particulars);
  }

  Slider.prototype.dragSeeker = function (event) {
    this.moveSeeker(event);
  }

  Slider.prototype.moveSeeker = function (event) {
    let currValue = this._min;
    let { left, right } = this._DOMElements.horz.getBoundingClientRect();
    const { offsetWidth } = this._DOMElements.seeker;
    let horzWidth = right - left - offsetWidth;
    let currLeft = event.pageX - left - offsetWidth / 2;
    if (currLeft > horzWidth) {
      currLeft = horzWidth;
    } else if (currLeft < 0) {
      currLeft = 0;
    }
    this._DOMElements.seekerLeft = currLeft;
    this._DOMElements.seeker.style.transform = `translateX(${currLeft}px)`;
    this._DOMElements.traversed.style.width = currLeft + offsetWidth / 2;
    currValue = Math.round(
      this._min + (this._max - this._min) / horzWidth * currLeft
    );
    this._particulars.curr = currValue;
  };

  Slider.prototype.adjustSteps = function () {
    let distance;
    let seekerLeft = this._DOMElements.seekerLeft;
    let closest;
    let adjacent = this.stepsArr.filter(
      step =>
        Math.abs(parseInt(getComputedStyle(step).left) - this._DOMElements.seekerLeft) <= this.stepWidth
    );
    prevAdjDist = Math.abs(parseInt(getComputedStyle(adjacent[0]).left) - this._DOMElements.seekerLeft);
    nextAdjDist = Math.abs(parseInt(getComputedStyle(adjacent[1]).left) - this._DOMElements.seekerLeft);
    if (prevAdjDist < nextAdjDist) {
      closest = adjacent[0];
    }
    else {
      closest = adjacent[1];
    }
    let index = this.stepsArr.indexOf(closest);
    this._DOMElements.seekerLeft = parseInt(getComputedStyle(closest).left);
    this._DOMElements.seeker.style.transform = `translateX(${
      this._DOMElements.seekerLeft
      }px)`;
    this._DOMElements.traversed.style.width = `${this._DOMElements.seekerLeft + parseInt(this._DOMElements.seeker.offsetWidth) / 2}px`;
    let horzWidth = parseInt(getComputedStyle(this._DOMElements.horz).width);
    this._particulars.curr = Math.round(
      this._min + ((this._max - this._min) / this._steps) * index);
  }

  Slider.prototype.dropSeeker = function () {
    if (this._steps > 0) {
      this.adjustSteps();
    }
    onSliderMove(this._particulars);
    document.removeEventListener("mousemove", this.dragSeekerBind);
    document.removeEventListener("mouseup", this.dropSeekerBind);
  };

  window.Slider = Slider;
})();
