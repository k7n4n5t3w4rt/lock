/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./loggedin.ejs');
var buttonTmpl  = require('../html/button.ejs');
var _ = require('underscore');
var $ = require('../js/bonzo_augmented');

/**
 * Expose LoggedinPanel
 */

module.exports = LoggedinPanel;

/**
 * Create
 */

function LoggedinPanel(widget, options) {
  if (!(this instanceof LoggedinPanel)) {
    return new LoggedinPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for LoggedinPanel');
  }

  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

LoggedinPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

LoggedinPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

LoggedinPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

LoggedinPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget._signinOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

LoggedinPanel.prototype.bindAll = function() {

  var self = this;
  var widget = this.widget;

  var connection = widget._ssoData.connection;
  //this could be ad or auth0-adldap
  var strategy_name = widget._ssoData.strategy;
  var strategy = widget._strategies[strategy_name];

  if (!strategy) return;

  this.query('form').a0_on('submit', function (e) {
    widget._signInEnterprise(e);
  });

  var button = $.create(buttonTmpl({
    use_big_buttons: true,
    name: strategy_name,
    title: widget._dict.t('windowsAuthTitle').replace('{connection}', connection),
    css: strategy.css,
    imageicon: strategy.imageicon,
  }));

  this.query('.a0-last-time').html(widget._dict.t('signin:domainUserLabel'));

  this.query('.a0-strategy div').remove();

  this.query('.a0-strategy')
    .append(button);

  this.query('.a0-strategy .a0-zocial[data-strategy]').a0_on('click', function (e) {
    e.preventDefault();
    widget._signInSocial(strategy_name, connection);
  });

  this.query('.a0-all', loginView).a0_on('click', function (e) {
    e.preventDefault();
    widget._signinPanel();
  });
}

LoggedinPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}