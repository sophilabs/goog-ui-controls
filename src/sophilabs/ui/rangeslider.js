/*
 *  * Copyright 2012 Sophilabs. All Rights Reserved.
 *   *
 *    * Use of this source code is governed by the Apache License, Version 2.0.
 *     * See the COPYING file for details.      
 */
goog.provide('sophilabs.ui.RangeSlider');

  goog.require('goog.dom');
  goog.require('goog.dom.a11y');
  goog.require('goog.dom.a11y.Role');
  goog.require('goog.ui.SliderBase');

  sophilabs.ui.RangeSlider = function(opt_domHelper) {
    goog.ui.SliderBase.call(this, opt_domHelper);
    this.rangeModel.setValue(this.getMinimum());
    this.rangeModel.setExtent(this.getMaximum() - this.getMinimum());
  };
  goog.inherits(sophilabs.ui.RangeSlider, goog.ui.SliderBase);

  sophilabs.ui.RangeSlider.CSS_CLASS_PREFIX = goog.getCssName('sophilabs-rangeslider');
  sophilabs.ui.RangeSlider.VALUE_THUMB_CSS_CLASS = goog.getCssName(sophilabs.ui.RangeSlider.CSS_CLASS_PREFIX, 'value-thumb');
  sophilabs.ui.RangeSlider.EXTENT_THUMB_CSS_CLASS = goog.getCssName(sophilabs.ui.RangeSlider.CSS_CLASS_PREFIX, 'extent-thumb');

  sophilabs.ui.RangeSlider.prototype.getCssClass = function(orient) {
    return sophilabs.ui.RangeSlider.CSS_CLASS_PREFIX + '-' + orient;
  };

  sophilabs.ui.RangeSlider.prototype.createThumb_ = function(cs) {
    var thumb = this.getDomHelper().createDom('div', cs);
    goog.dom.a11y.setRole(thumb, goog.dom.a11y.Role.BUTTON);
    return (thumb);
  };

  sophilabs.ui.RangeSlider.prototype.createThumbs = function() {
    var valueThumb = goog.dom.getElementsByTagNameAndClass(null, sophilabs.ui.RangeSlider.VALUE_THUMB_CSS_CLASS, this.getElement())[0];
    var extentThumb = goog.dom.getElementsByTagNameAndClass(null, sophilabs.ui.RangeSlider.EXTENT_THUMB_CSS_CLASS, this.getElement())[0];
    if (!valueThumb) {
      valueThumb = this.createThumb_(sophilabs.ui.RangeSlider.VALUE_THUMB_CSS_CLASS);
      this.getElement().appendChild(valueThumb);
    }
    if (!extentThumb) {
      extentThumb = this.createThumb_(sophilabs.ui.RangeSlider.EXTENT_THUMB_CSS_CLASS);
      this.getElement().appendChild(extentThumb);
    }
    
    this.valueThumb = valueThumb;
    this.extentThumb = extentThumb;
  };

  sophilabs.ui.RangeSlider.prototype.decorateInternal = function(element) {
    sophilabs.ui.RangeSlider.superClass_.decorateInternal.call(this, element);
  };

  sophilabs.ui.RangeSlider.prototype.enterDocument = function() {
    sophilabs.ui.RangeSlider.superClass_.enterDocument.call(this);
    this.getHandler().
          listen(this.valueDragger_, goog.fx.Dragger.EventType.END, this.handleEnd_).
          listen(this.extentDragger_, goog.fx.Dragger.EventType.END, this.handleEnd_);
    this.valueThumb.tabIndex = this.getElement().tabIndex;
    this.extentThumb.tabIndex =  this.getElement().tabIndex;
  };

  sophilabs.ui.RangeSlider.prototype.handleMouseDown_ = function(e) {
    var target = e.target;
    if (goog.dom.contains(this.valueThumb, target) && this.valueThumb.focus) {
      this.valueThumb.focus();
      e.preventDefault();
    } else if (goog.dom.contains(this.extentThumb, target) && this.extentThumb.focus) {
      this.extentThumb.focus();
      e.preventDefault();
    } else {
      sophilabs.ui.RangeSlider.superClass_.handleMouseDown_.call(this, e);
    }
  };

  sophilabs.ui.RangeSlider.prototype.moveThumbsI = function(deltaMin, deltaMax) {
    var newMinPos = this.getThumbPosition_(this.valueThumb) + deltaMin;
    var newMaxPos = this.getThumbPosition_(this.extentThumb) + deltaMax;
    // correct min / max positions to be within bounds
    newMinPos = goog.math.clamp(newMinPos, this.getMinimum(), this.getMaximum() - this.minExtent_);
    newMaxPos = goog.math.clamp(newMaxPos, this.getMinimum() + this.minExtent_, this.getMaximum());
    // Set value and extent atomically
    this.setValueAndExtent(newMinPos, newMaxPos - newMinPos);
  };

  sophilabs.ui.RangeSlider.prototype.handleKeyDown_ = function(e) {
    var handled = true;
    var target = e.target;
    if (goog.dom.contains(this.valueThumb, target)) {
            switch (e.keyCode) {
              case goog.events.KeyCodes.LEFT:
              case goog.events.KeyCodes.DOWN:
                this.moveThumbsI(e.shiftKey ? -this.getBlockIncrement() : -this.getUnitIncrement(), 0);
                break;
              case goog.events.KeyCodes.RIGHT:
              case goog.events.KeyCodes.UP:
                this.moveThumbsI(e.shiftKey ? this.getBlockIncrement() : this.getUnitIncrement(), 0);
                break;
              default:
                handled = false;
            }
            if (handled) {
              e.preventDefault();
            }
    } else if (goog.dom.contains(this.extentThumb, target)) {
            switch (e.keyCode) {
              case goog.events.KeyCodes.LEFT:
              case goog.events.KeyCodes.DOWN:
                this.moveThumbsI(0, e.shiftKey ? -this.getBlockIncrement() : -this.getUnitIncrement());
                break;
              case goog.events.KeyCodes.RIGHT:
              case goog.events.KeyCodes.UP:
                this.moveThumbsI(0, e.shiftKey ? this.getBlockIncrement() : this.getUnitIncrement());
                break;
              default:
                handled = false;
            }
            if (handled) {
              e.preventDefault();
            }
    }
    else
    {
          sophilabs.ui.RangeSlider.superClass_.handleKeyDown_.call(this, e);
    }
  };

  sophilabs.ui.RangeSlider.prototype.handleEnd_ = function(e) {
          this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  };

  sophilabs.ui.RangeSlider.prototype.dispatchEvent = function(e) {
      if( e == goog.ui.Component.EventType.CHANGE)
      {
          e = new goog.events.Event(e, this);
          e.dragging = (this.valueDragger_ && this.valueDragger_.dragging_ == true) || (this.extentDragger_ && this.extentDragger_.dragging_ == true);
          sophilabs.ui.RangeSlider.superClass_.dispatchEvent.call(this, e);
      }
      else {
             sophilabs.ui.RangeSlider.superClass_.dispatchEvent.call(this, e);
	}
};

