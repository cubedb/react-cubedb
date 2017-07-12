# react-cudedb

This package contain a serie of [React][react] components, using [Reat-Bootstrap][react-bootstrap] and [D3][d3] to generate graphs based on [CubeDB][cubedb]'s data.

## Examples

### Trending graphs

![TrendingGraph][screenshot_trendinggraph]

### BarGraph

![BarGraph][screenshot_bargraph]
![BarGraph with comparison][screenshot_bargraph_comparison]

### TimeGraph

![TimeGraph][screenshot_timegraph]
![TimeGraph with comparison][screenshot_timegraph_comparison]


## Local Setup (using [yarn][yarn])

- Install the dependencies with `yarn install`
- Run tests with [Jest][jest] `yarn test`
- Update tests snapshots `yarn test:updateSnapshot`
- Run [Eslint][eslint] `yarn lint`
- Fix linter `yarn lint:fix`
- Run the [storybook][storybook] in development mode with `yarn storybook`
- Build with `yarn build`



[react]: http://facebook.github.io/react/
[react-bootstrap]: https://react-bootstrap.github.io/
[d3]: https://github.com/d3/d3
[yarn]: https://yarnpkg.com/
[cubedb]: https://github.com/sztanko/cubedb
[jest]: https://facebook.github.io/jest/
[eslint]: http://eslint.org/
[storybook]: https://github.com/storybooks/storybook


[screenshot_trendinggraph]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TrendingGraph.png

[screenshot_bargraph]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/BarGraph.png
[screenshot_bargraph_comparison]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/BarGraph_comparison.png

[screenshot_timegraph]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TimeGraph.png
[screenshot_timegraph_comparison]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TimeGraph_comparison.png
