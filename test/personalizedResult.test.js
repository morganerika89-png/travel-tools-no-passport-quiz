const assert = require('node:assert/strict');
const { getTopDestinationMatches, createPersonalizedResult } = require('../src/personalizedResult');

{
  const { matches } = getTopDestinationMatches({
    tripStyle: 'road trip',
  });

  assert.equal(matches.length, 2);
  assert.equal(matches[0].destination, 'Pacific Coast Highway');
  assert.equal(matches[1].destination, 'Blue Ridge Parkway');
}

{
  const { matches } = getTopDestinationMatches({
    landscape: 'mountains',
    activity: 'ski',
  });

  assert.equal(matches[0].destination, 'Jackson Hole');
  assert.equal(matches[1].destination, 'Vail');
}

{
  const { matches } = getTopDestinationMatches({
    tripStyle: 'bucket list',
  }, 1);

  assert.equal(matches.length, 1);
  assert.equal(matches[0].destination, 'Alaska');
}

{
  const summary = createPersonalizedResult({
    tripStyle: 'family',
    activity: 'theme parks',
  });

  assert.match(summary, /Orlando and Pigeon Forge are your top matches/);
  assert.match(summary, /family\/theme parks/);
}

console.log('All tests passed.');
