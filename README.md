# travel-tools-no-passport-quiz

Interactive quiz logic to find no-passport-needed destinations.

## Intentional destination matching rules

The quiz now maps inputs to destinations with explicit category logic:

- **BEACH** → 30A, Sarasota, Puerto Rico, US Virgin Islands, Hawaii
- **MOUNTAINS / OUTDOORS** → Jackson Hole, Glacier National Park, Rocky Mountain National Park, Sedona, Denver
- **SKI or DUDE RANCH** *(prioritized)* → Jackson Hole, Vail, Park City, Aspen, Big Sky, Dude Ranch experiences
- **CITY** → NYC, Boston, Nashville, Charleston, Newport RI, Portland Maine, Las Vegas
- **FAMILY / THEME PARKS** → Orlando, Pigeon Forge, Chattanooga
- **ROAD TRIP** → Pacific Coast Highway, Blue Ridge Parkway, Florida Keys, Utah National Parks
- **BUCKET LIST** → Alaska, Hawaii

The matcher always returns **1–2 top destination matches** and a personalized explanation of why they fit.

## Usage

```js
const { createPersonalizedResult, getTopDestinationMatches } = require('./src/personalizedResult');

const answers = {
  landscape: 'mountains',
  activity: 'ski',
};

const topMatches = getTopDestinationMatches(answers);
// => { matches: [ { destination: 'Jackson Hole', ... }, { destination: 'Vail', ... } ], ... }

const summary = createPersonalizedResult(answers);
// => "Jackson Hole and Vail are your top matches..."
```

Run tests:

```bash
node test/personalizedResult.test.js
```
