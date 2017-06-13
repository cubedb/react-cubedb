import React from 'react';


const Overview = ({children}) =>
  <div>
    <h2>Cube DB data structure</h2>
    <p>Single dimension</p>
    <pre>
      <code>
{`[{
  [name|date]: {
    c: <number>
  }
}, ...]`}
      </code>
    </pre>
    <p>Grouped dimension</p>
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
