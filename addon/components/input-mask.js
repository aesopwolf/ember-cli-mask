import Ember from 'ember';

const MASK_REGEX = {
  '9': /\d/,
  'A': /[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
  '*': /[\dA-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/
};
const MASK_CHARS = Object.keys(MASK_REGEX);
const PTRN_REGEX = new RegExp('[' + MASK_CHARS.join(',') + ']', 'g');
const ALLOWED_TYPES = ['text', 'search', 'url', 'tel', 'password'];

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: [
    'readonly',
    'required',
    'autofocus',
    'value',
    'placeholder',
    'disabled',
    'size',
    'tabindex',
    'maxlength',
    'name',
    'min',
    'max',
    'pattern',
    'accept',
    'autocomplete',
    'autosave',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'inputmode',
    'multiple',
    'step',
    'width',
    'form',
    'selectionDirection',
    'spellcheck',
    'type'
  ],
  _mask: { props: {} },

  didInsertElement() {
    this._super(...arguments);
    if(!this.get('type')) {
      this.element.setAttribute('type', 'text');
    }
  },

  validType() {
    if (this.get('mask') && ALLOWED_TYPES.indexOf(this.get('type') || 'text') > -1) {
      return true;
    }
    else {
      console.log('oh no');
      return false;
    }
  },

  processValue(value, cb) {
    let mask = this.get('mask');
    let pattern = mask.replace(PTRN_REGEX, '_');
    let rexps = {};

    mask.split('').forEach(function(c, i) {
      if (~MASK_CHARS.indexOf(c)) {
        rexps[i+1] = MASK_REGEX[c];
      }
    });

    let cursorMax = 0;
    let cursorMin = 0;
    let newValue = '';
    let newValueMasked;
    let nextChar;

    for (let i = 0; i < mask.length; i++) {
      if (~MASK_CHARS.indexOf(mask[i])) {
        cursorMin = i;
        break;
      }
    }

    for (let i = 0, j = 0; i < mask.length;) {
      if (!~MASK_CHARS.indexOf(mask[i])) {
        newValue += mask[i];
        if (mask[i] === value[j]) {
          j++;
        }
        i++;
      } else {
        if (nextChar = value.substr(j++, 1)) {
          if (rexps[newValue.length+1].test(nextChar)) {
            newValue += nextChar;
            cursorMax = newValue.length;
            i++;
          }
        } else {
          newValue = newValue.substr(0, cursorMax);
          if (this._mask.focusing || this._mask.focused) {
            newValueMasked = newValue + pattern.slice(cursorMax);
          }
          break;
        }
      }
    }

    let cursorCurr = 0;
    cursorMax = Math.max(cursorMax, cursorMin);

    if (this._mask.focused) {
      cursorCurr = this.element.selectionStart;
    } else {
      cursorCurr = cursorMax;
    }

    if (cursorCurr <= cursorMin) {
      cursorCurr = cursorMin;
    } else if (cursorCurr >= cursorMax) {
      cursorCurr = cursorMax;
    } else if (this._mask.cursor > cursorCurr) { //removing
      for (let i = cursorCurr; i >= 0; i--) {
        cursorCurr = i;
        if (rexps[i] && !rexps[i+1]) {
          break;
        }
        if (rexps[i] && rexps[i+1] && rexps[i+1].test(newValue[i])) {
          break;
        }
      }
    } else {
      for (let i = cursorCurr; i <= cursorMax; i++) {
        cursorCurr = i;
        if (!rexps[i+1] && rexps[i]) {
          break;
        }
        if (rexps[i+1] && rexps[i+1].test(newValue[i])) {
          if (!rexps[i]) {
            cursorCurr++;
          }
          break;
        }
      }
    }

    this._mask.value = newValue;
    this._mask.props.value = newValueMasked || newValue;
    this._mask.empty = cursorMax === cursorMin;
    this._mask.cursor = cursorCurr;
    cb(this._mask);
  },

  onChange(event) {
    if (this.validType()) {
      this.processValue(event.target.value, function(mask) {
        event.target.value = mask.props.value;
        event.target.selectionStart = mask.cursor;
        event.target.selectionEnd = mask.cursor;
      });
    }
  },

  input(event) {
    this.onChange(event);
  },

  focusOut(event) {
    if (this.validType()) {
      let value = this._mask.value;

      if (!this._mask.empty) {
        this._mask.props.value = value;
      } else {
        this._mask.props.value = '';
      }

      event.target.value = value;
      this._mask.focused = false;
    }
  },

  keyDown() {
    if (this.validType()) {
      this._mask.cursor = this.element.selectionStart;
    }
  },

  focusIn(event) {
    this._mask.focusing = true;
    this.onChange(event);
    this._mask.focusing = false;
    this._mask.focused = true;
  },

  click(event) {
    this.onChange(event);
  }
});
