# react-cudedb

This package contain a serie of [React][react] components, using [Reat-Bootstrap][react-bootstrap] and [D3][d3] to generate graphs based on [CubeDB][cubedb]'s data.


## Local Setup (using [yarn][yarn])

- Install the dependencies with `yarn install`
- Run tests with [Jest][jest] `yarn test`
- Update tests snapshots `yarn test:updateSnapshot`
- Run [Eslint][eslint] `yarn lint`
- Fix linter `yarn lint:fix`
- Run the [storybook][storybook] in development mode with `yarn storybook`
- Build with `yarn build`

----

## Examples

### TimeGraph

#### Simple TimeGraph
![Simple TimeGraph][screenshot_timegraph]
#### TimeGraph stacked
![TimeGraph stacked][screenshot_timegraph_stacks]

### BarGraph

#### BarGraph
![BarGraph][screenshot_bargraph]
#### BarGraph filters
![BarGraph filters][screenshot_bargraph_filter]
#### BarGraph with comparison
![BarGraph with comparison][screenshot_bargraph_comparison]


### BarGraph and TimeGraph comparing data

#### BarGraph with comparison
![BarGraph with comparison][screenshot_bargraph_comparison]
#### TimeGraph with comparison
![TimeGraph with comparison][screenshot_timegraph_comparison]

### Trending graphs

![TrendingGraph][screenshot_trendinggraph]




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
[screenshot_bargraph_filter]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/BarGraph_filter.png
[screenshot_bargraph_comparison]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/BarGraph_comparison.png

[screenshot_timegraph]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TimeGraph.png
[screenshot_timegraph_stacks]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TimeGraph_stacks.png
[screenshot_timegraph_comparison]: https://raw.githubusercontent.com/jrfferreira/react-cubedb/master/screenshots/TimeGraph_comparison.png
