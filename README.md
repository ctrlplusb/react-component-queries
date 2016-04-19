<p align='center'>
  <h1 align='center'>COMPONENT QUERIES</h1>
  <p align='center'>Provide props to your React Components based on their Width and/or Height.</p>
</p>

[![Travis](https://img.shields.io/travis/ctrlplusb/react-component-queries.svg?style=flat-square)](https://travis-ci.org/ctrlplusb/react-component-queries)
[![npm](https://img.shields.io/npm/v/react-component-queries.svg?style=flat-square)](http://npm.im/react-component-queries)
[![MIT License](https://img.shields.io/npm/l/react-component-queries.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Codecov](https://img.shields.io/codecov/c/github/ctrlplusb/react-component-queries.svg?style=flat-square)](https://codecov.io/github/ctrlplusb/react-component-queries)
[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?style=flat-square)]()

* Responsive Components!
* Easy to use.
* Extensive browser support.
* Supports any Component type, i.e. stateless/class.
* Works with React 0.14.x and 15.x.x.

## Install

There is a peer-dependency on `react-sizeme`, so run the following command to install both libraries:

```
npm install react-sizeme react-component-queries --save
```

## Overview

This is a higher order component library that wraps up [`react-sizeme`](https://github.com/ctrlplusb/react-sizeme) to provide you with the capability to decorate your components with props based on queries against their width and/or height.

`react-sizeme` gives us the capability to know the width/height of your component.  `react-component-queries` allows you to define queries (as little or as many as you like) to operate on the known size of your component.  The queries return props that will be assigned to your components.  Any time the size of your component changes the queries will be run again.

The queries themselves are simply functions that accept named parameters of `width` and `height`. They must return an object that contains any props you wish to assign to your components.

For example:

```javascript
var query = function(size) {
  if (size.width === size.height) {
    return { isSquare: true };
  }
  
  return { isSquare: false};
}
```

If you are using ES6 then you can use object destructuring and anonymous function syntax to write a much more concise implementation:

```javascript
const query = ({ width, height }) => 
  width === height ? { isSquare: true } : { isSquare: false };
``` 

If you don't want a query to assign any props to your component for a specific case then simply return an empty object:

```javascript
const query = ({ width, height }) =>
  width === height ? { isSquare: true } : {};
```

## Examples 

Below are a few super simple examples highlighting the usage and capabilities of the library. They are using the ES6 syntax described above to define the queries.

__Example 1: Queries on your Component's width__

```javascript
import ComponentQueries from 'react-component-queries';

class MyComponent extends Component {
  render() {
    return (
      <div>
        {/* We recieve the following props from our queries */}
        I am at {this.props.scale} scale.
      </div>
    );
  }
}

export default ComponentQueries(
  // Provide as many query functions as you need.
  ({ width }) => width <= 330 ? { scale: 'mobile' } : {},
  ({ width }) => width > 330 && width <=960 ? { scale: 'tablet' } : {},
  ({ width }) => width > 960 ? { scale: 'desktop' } : {}
)(MyComponent);
```

__Example 2: Queries on your Component's width AND height__

By default the `ComponentQueries` higher order component only operates on width. This is a design decision as in most cases we only wish to query against `width`, therefore we ignore height changes to minimize any potential DOM spamming.

If you would like to operate on height also then you must use the extended configuration mode shown below to enable monitoring on the height of your component:

```javascript
import ComponentQueries from 'react-component-queries';

class MyComponent extends Component {
  render() {
    return (
      <div>
        {/* We recieve the following props from our queries */}
        I am at {this.props.scale} scale.<br />
        I am {this.props.short ? 'short' : 'long'}<br />
        I am {this.props.square ? 'square' : 'rectangular'}
      </div>
    );
  }
}

// NOTE: We are passing in a configuration object now.
export default ComponentQueries({
  queries: [
    // Use just the width.
    ({ width }) => width <= 330 ? { scale: 'mobile' } : {}
     // Or use just the height.
    ({ height }) => height > 200 ? { short: false } : { short: true },
    // Or use both.
    ({ width, height }) => width === height ? { square: true } : { square: false },
  ],
  sizeMeConfig: { monitorHeight: true }
})(MyComponent);
```

As you can see we expose a `sizeMeConfig`, please see the [`react-sizeme`](https://github.com/ctrlplusb/react-sizeme) for the full list of options that you can provide.