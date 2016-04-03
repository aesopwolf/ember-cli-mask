import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('input-mask', 'InputMaskComponent', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('is an input element', function(assert) {
  assert.equal('INPUT', this.$().prop('tagName'));
});
