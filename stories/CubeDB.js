import React from 'react'  // eslint-disable-line no-unused-vars


const Overview = () =>
  <div>
    <h2>Cube DB data structure</h2>
    <h3>Setup</h3>
    <ul>
      <li>Install the dependencies with <code>yarn install</code></li>
      <li>Run tests with Jest <code>yarn test</code></li>
      <li>Update tests snapshots <code>yarn test:updateSnapshot</code></li>
      <li>Run Eslint <code>yarn lint</code></li>
      <li>Fix linter <code>yarn lint:fix</code></li>
      <li>Run the storybook in development mode with <code>yarn storybook</code></li>
      <li>Build with <code>yarn build</code></li>
    </ul>
    <h3>Data Structure</h3>
    <h4>Single dimension</h4>
    <pre>
      <code>
{`[{
  [name|date]: {
    c: <number>
  }
}, ...]`}
      </code>
    </pre>
    <h4>Grouped dimension</h4>
    <pre>
      <code>
{`[{
  [name|date]: {
    [name]: {
      c: <number>
    },
    ...
  }
}, ...]`}
      </code>
    </pre>
  </div>

export default {
  Overview
}
