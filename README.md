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

## Overview

`react-component-queries` allows you to define queries against the width and/or height of your Component in order to produce custom props to be passed into your Component. Any time the size of your Component changes the queries will automatically be run again.

The queries themselves are super simple functions that accept `width` and/or `height` as parameters. You can implement any logic you like within these query functions but they must return an object holding the props you would like to assign to your Component (or an empty object if none).

For example:

```javascript
var query = function(size) {
  if (size.width === size.height) {
    return { isSquare: true }; // "isSquare" prop set with value of "true".
  }
  
  return {}; // No props provided!
}
```

If you are using ES6 then you can use object destructuring and anonymous function syntax to write a much more concise implementation:

```javascript
const query = ({ width, height }) => 
  width === height ? { isSquare: true } : {};
``` 

## Install

There is a peer-dependency on `react-sizeme`, so run the following command to install both libraries:

```
npm install react-sizeme react-component-queries --save
```

## Demo

Yep, it works:<br />
https://react-component-queries-demo-kroznlrebm.now.sh

## Examples 

Below are a few super simple examples highlighting the usage and capabilities of the library. They are using the ES6 syntax described above to define the queries.

__Example 1: Queries on your Component's width__

By default the ComponentQueries higher order component only operates on width. This is a design decision as in most cases we only wish to query against width, therefore we ignore height changes to minimize any potential DOM spamming.  If you would like to operate on height too then please see Example 2.

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

## Prop Conflict Handling

As it is possible for you to provide props from multiple queries there could be cases where prop clashing occurs.  By default we have an order of preference for which prop value should be resolved in the case of conflicts.  

__The rule is:__ Custom passed in props take preference followed by the last item in the query collection.

Let's illustrate this given the following component:

```
const MyComponent = ComponentQueries(
  ({ width }) => { return { foo: 'bar' }; },
  ({ width }) => { return { foo: 'bob' }; }
)(ComponentToWrap);
```

If we rendered this component the value we would received for `foo` would be "bob".

Then say we rendered our component like so, passing in a custom prop:

```
ReactDOM.render(<MyComponent foo="zip" />, container);
``` 

In this case the value of `foo` would resolve to "zip".

It's important to remember this.

## Custom Prop Conflict Resolution

There may be cases when you want to provide custom rules for how conflicts are resolved.  For example, say you wanted your queries to produce `className` props, but desired that any conflicts simply resolved in the conflicts being concatenated. This can be especially helpful in the case where you want users to be able to pass in custom `className` props into your component.

To support this case we provide an extended configuration item called `conflictResolver`, which is specifically a function of the following structure:

```javascript
function (currentPropValue, nextPropValue, propName) 
```

To solve our above described case we could provide the following implementation of the `conflictResolver`:

```javascript
const MyComponent = ComponentQueries({
  queries: [
    ({ width }) => { return { className: 'foo', poop: 'splash' }; },
    ({ width }) => { return { className: 'bar', poop: 'plop' }; }
  ],
  conflictResolver: (current, next, key) => {
    // If the prop is "className" we will concat the new value to
    // the current value.
    if (key === 'className) {
      return current.concat(' ', next);
    }
    // Otherwise we return the new value, overriding the old value. 
    return next;
  }
})(ComponentToWrap);
```

If we rendered our component like so:

```javascript
ReactDOM.render(<MyComponent className="baz" />, container);
```

Then the props that would be resolved would be:

```javascript
{
  className: 'foo bar baz',
  poop: 'plop'
}
```

--- 

### Credits

Rubix graphic by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>