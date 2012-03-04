/*
 * Copyright 2012 Sophilabs. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache License, Version 2.0.
 * See the COPYING file for details.
 */
goog.provide('sophilabs.ui.Rule');

goog.require('goog.dom');
goog.require('goog.dom.classes');

sophilabs.ui.Rule = function(elRule, opt_values, opt_domHelper) {
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
  this.elRule_ = this.dom_.getElement(elRule);
  this.values_ = opt_values || [];
};

sophilabs.ui.Rule.Orientation = {
  TOP: 'top',
  BOTTOM: 'bottom'
};

sophilabs.ui.Rule.CSS_CLASS_PREFIX_ = goog.getCssName('sophilabs-rule');

sophilabs.ui.Rule.prototype.orientation_ = sophilabs.ui.Rule.Orientation.BOTTOM;

sophilabs.ui.Rule.prototype.getCssClass_ = function(orient) {
  return sophilabs.ui.Rule.CSS_CLASS_PREFIX_ + '-' + orient;
};

sophilabs.ui.Rule.prototype.setOrientation = function(orient) {
  if (this.orientation_ != orient) {
    var oldCss = this.getCssClass_(this.orientation_);
    var newCss = this.getCssClass_(orient);
    this.orientation_ = orient;

   goog.dom.classes.swap(this.elRule_, oldCss, newCss);
   this.updateUi_();
  }
};

sophilabs.ui.Rule.prototype.setValues = function(opt_values) {
  this.values_ = opt_values || [];
  this.updateUi_();
};

sophilabs.ui.Rule.prototype.render =  function() {
  goog.dom.classes.add(this.elRule_, sophilabs.ui.Rule.CSS_CLASS_PREFIX_, this.getCssClass_(this.orientation_));
  this.updateUi_();
};

sophilabs.ui.Rule.prototype.updateUi_ =  function() {
  goog.dom.setTextContent(this.elRule_, '');
  
  ticks = goog.dom.createDom('div', this.getCssClass_('ticks'));
  values = goog.dom.createDom('div', this.getCssClass_('values'));

  if (this.values_.length > 1)
  {
     total = this.values_.length;
     for(i=0; i<total; i++) {
        style =  'left: ' + ((i * 100) / (total - 1)) + '%;';
        if(i == total - 1)
	   style += 'margin-left: -1px;';
        goog.dom.appendChild(ticks, goog.dom.createDom('div', {'class': this.getCssClass_('tick'), 'style': style}));
        goog.dom.appendChild(values,
           goog.dom.createDom('div', {'class': this.getCssClass_('value'), 'style': style},
              goog.dom.createDom('div', {'class': this.getCssClass_('inner')}, this.values_[i] + '')
        ));
     }
  }

  if (this.orientation_ == sophilabs.ui.Rule.Orientation.BOTTOM) {
    goog.dom.appendChild(this.elRule_, ticks);
    goog.dom.appendChild(this.elRule_, values);
  } else {
    goog.dom.appendChild(this.elRule_, values);
    goog.dom.appendChild(this.elRule_, ticks);
  }
};
