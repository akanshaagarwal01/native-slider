(function () {

  function Slider(container, particulars) {
    this._particulars = JSON.parse(JSON.stringify(particulars));
    this._min = +(this._particulars.min || 0);
    this._max = +(this._particulars.max || 100);
    this._id = this._particulars.id || '';
    this._steps = +(this._particulars.steps || 0);
    this._curr = +(this._particulars.curr || this._particulars.min);
    this._DOMElements = {};
    Slider.prototype.renderSlider.call(this, container);
  }

  Slider.prototype.renderSlider = function (container) {
    let sliderBody = document.createElement('div');
    sliderBody.id = `sliderBody_${this._id}`;
    sliderBody.className = "sliderBody";
    let sHtml =
      `<div id = "horz_${this._id}" class = "horz">
        <div id = "seeker_${this._id}" class = "seeker"></div>
        <div id = "traversed_${this._id}" class = "traversed"></div>
        <div id = "min_${this._id}" class = "min"></div>
        <div id = "max_${this._id}" class = "max"></div>
      </div>`
    sliderBody.innerHTML = sHtml;
    container.append(sliderBody);
    this.initializeDOMElements();
  };

  Slider.prototype.initializeDOMElements = function () {
    this._DOMElements = {
      seeker: document.getElementById(`seeker${this._id}`),
      horz: document.getElementById(`horz${this._id}`),
      min: document.getElementById(`min${this._id}`),
      max: document.getElementById(`max${this._id}`),
      traversed: document.getElementById(`traversed${this._id}`)
    };
    console.log(this._DOMElements);
    this._DOMElements.min.innerHTML = this._min;
    this._DOMElements.max.innerHTML = this._max;
    this._DOMElements.seeker.addEventListener("mousedown", grabSeeker);
    this._DOMElements.horz.addEventListener("click", moveSeeker);
    this._DOMElements.seeker.ondragstart = function () {
      return false;
    };
  };

  Slider.prototype.grabSeeker = function (grabEvent) {
    document.addEventListener("mousemove", moveSeeker);
    document.addEventListener("mouseup", dropSeeker);
  };

  Slider.prototype.moveSeeker = function (moveEvent) {
    moveEvent.preventDefault();
    let currValue = this._min;
    let {
      left,
      right
    } = this._DOMElements.horz.getBoundingClientRect();
    const { offsetWidth } = this._DOMElements.seeker;
    let horzWidth = right - left - offsetWidth;
    let currLeft = moveEvent.pageX - left - offsetWidth / 2;
    const t = right - left - offsetWidth;
    if (currLeft > t) {
      currLeft = t;
    }
    if (currLeft < 0) {
      currLeft = 0;
    }
    this._DOMElements.seeker.style.transform = `translateX(${currLeft}px)`;
    this._DOMElements.traversed.style.width = currLeft + offsetWidth / 2;
    currValue = Math.round(
      this._min +
      (this._max - this._min) / horzWidth * currLeft
    );
    return currValue;
  };

  Slider.prototype.dropSeeker = function () {
    document.removeEventListener("mousemove", this.moveSeeker);
    document.removeEventListener("mouseup", this.dropSeeker);
  };

  window.Slider = Slider;

})();
