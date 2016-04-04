import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | input mask');

test('testing {{input-mask}} functionality', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  click('.date');
  andThen(function() {
    assert.equal(find('.date').val(), '__/__/____', 'clicking empty input displays mask definition');
  });
});
