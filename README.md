<p align='center'>
  <img width='250' src='https://raw.githubusercontent.com/ctrlplusb/react-component-queries/master/assets/logo.png' />
  <p align='center'>Provide props to your React Components based on their Width and/or Height.</p>
</p>

<p align='center'>

[![Travis](https://img.shields.io/travis/ctrlplusb/react-component-queries.svg?style=flat-square)](https://travis-ci.org/ctrlplusb/react-component-queries)
[![npm](https://img.shields.io/npm/v/react-component-queries.svg?style=flat-square)](http://npm.im/react-component-queries)
[![MIT License](https://img.shields.io/npm/l/react-component-queries.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Codecov](https://img.shields.io/codecov/c/github/ctrlplusb/react-component-queries.svg?style=flat-square)](https://codecov.io/github/ctrlplusb/react-component-queries)

```javascript
import componentQueries from 'react-component-queries'

function MyComponent({ mode }) {
  return (
    <div>
      { mode === 'wide'
        ? <WideVariant />
        : <NarrowVariant /> }
    </div>
  )
}

componentQueries(
  ({ width }) => ({ mode: width < 768 ? 'narrow' : 'wide' }),
)(MyComponent);
```

* Responsive Components!
* A useful abstraction on the bare metal `react-sizeme` component.
* Easy to use.
* Extensive browser support.
* Supports any Component type, i.e. stateless/class.
* Works with React 0.14.x and 15.x.x.
* 1.84KB gzipped standalone, even smaller if bundled into your own project.

## TOCS

  - [Overview](https://github.com/ctrlplusb/react-component-queries#overview)
  - [Why use this instead of `react-sizeme`?](https://github.com/ctrlplusb/react-component-queries#why-use-this-instead-of-react-sizeme)
  - [Install](https://github.com/ctrlplusb/react-component-queries#install)
  - [Demo](https://github.com/ctrlplusb/react-component-queries#demo)
  - [API](https://github.com/ctrlplusb/react-component-queries#api)
  - [Examples](https://github.com/ctrlplusb/react-component-queries#examples)
  - [Prop Conflict Handling](https://github.com/ctrlplusb/react-component-queries#prop-conflict-handling)
  - [Custom Prop Conflict Resolution](https://github.com/ctrlplusb/react-component-queries#custom-prop-conflict-resolution)

## Overview

`react-component-queries` is a useful abstraction of the [`react-sizeme`](https://github.com/ctrlplusb/react-sizeme) library.  It allows you to define queries against the dimensions of your Component in order to produce custom props for your Component.

Any time the dimensions of your rendered Component changes the queries will automatically be run again.

The _queries_ themselves are super simple functions that accept a `size` argument. You can implement any logic you like within the _query_ functions but they must return an object containing the props you would like to assign to your Component.

For example:

```javascript
function isSquareQuery(size) {
  return {
    isSquare: size.width === size.height
  };
}
```

It's great to be able to define your _queries_ as functions as this gives you an opportunity to create and share _queries_ across your components.

Once you have configured your _queries_ then pass them to `ComponentQueries` and wrap your component, like so:

```javascript
import componentQueries from 'react-component-queries';
...
componentQueries(query1, query2)(MyComponent)
```

You can provide as many queries as you like, their results will be merged and passed to your component.

Of course you can provide your queries inline too.  Below we are using the ES2015 destructuring and anonymous function syntax:

```javascript
componentQueries(
  // This query emulates a "breakpoint" type of property
  ({ width }) => {
    if (width <= 330) return { breakpoint: 'small' };
    if (width > 330 && width <=960) return { breakpoint: 'medium' };
    return { breakpoint: 'large' };
  },
  // You can have multiple queries, and the props that are returned can
  // be of any type.  Boolean's are often useful.
  ({ width }) => ({ isMassive: width > 1000000 })
)(MyComponent);
```

The above example will result in a `breakpoint` and an `isMassive` prop being passed to your component.

## Why use this instead of `react-sizeme`?

[`react-sizeme`](https://github.com/ctrlplusb/react-sizeme) is great, however, it suffers with a couple of problems in my opinion:

  1. It is raw in that it provides you with the actual dimensions of your component and then requires to execute logic within your component to establish the desired behaviour of your component.  This can be a bit tedious and polute your component with a lot of if-else statements.  
  2. It is possible that your component may gets spammed with updated `size` props. This is because _any_ time your component changes in size `react-sizeme` will kick in.

`react-component-queries` was built to solve these problems. It solves problem 1 by moving the dimension based logic out of your component.  It then solves problem 2 by ensuring that your component will only be called for re-render if any of the prop values change.  That saves you some error prone boilerplate.

This allows you to deal with "simpler" props, for example; a boolean flag indicating if the component is square, an enum representing it's size ('small'|'medium'|'large'), a className, or a style object.  Whatever you feel is most appropriate for your use case.

So, to recap, some of the benefits of using this abstraction are:

  - Simplify your components by moving the dimension logic away from them, which in turn is easier to test in isolation.
  - `shouldComponentUpdate` is implemented on your behalf.
  - The _query functions_ themselves can be formed into a reusable library of queries for all your components.  

I am not trying to take away from `react-sizeme`, but I want to highlight that it's a bit more of a low level HOC, and if you want to use it you should be aware of the problems above and consider using your own abstraction or this one.

## Install

There is a peer-dependency on `react-sizeme`, so run the following command to install both libraries:

```
npm install react-sizeme react-component-queries --save
```

## Demo

[See it in action!](https://react-component-queries-demo-aowygvryob.now.sh)

## API

`react-component-queries` exports a single function to be used as an HOC around your existing components.  This function supports two modes of usage: _simple_ and _configured_.

### _Simple_: `componentQueries(queries)`

Wraps your component with the given component queries using the default configuration options.  You can provide either an array containing queries, or multiple arguments with each argument being a query function.

e.g.

```javascript
componentQueries([
  function (size, props) { return { foo: 'bar' }; },
  function (size, props) { return { bob: true }; }
])(MyComponent)
```

or

```javascript
componentQueries(
  function (size, props) { return { foo: 'bar' }; },
  function (size, props) { return { bob: true }; }
)(MyComponent)
```

#### Arguments

  - `query(size, [ownProps]) : props` (_Function_): A query function which can be provided as a set of arguments, or can be contained within an array containing one or more queries.
    - `size` (_Object_): Contains the current dimensions of your wrapped component. As the default configuration is being used, it will only contain th e `width` dimension.
       - `width` (_Number_): The current width of your component.  
    - [`ownProps`] \(_Object_): The additional props which have been provided to your wrapped component.

### _Configured_: `componentQueries(config)`

Wraps your component with the given component queries and uses the provided configuration customisations.  You must provide an object containing a `queries` property as well as a `config` property.

e.g.

```javascript
componentQueries({
  queries: [
    function (size, props) { return { foo: 'bar' }; },
    function (size, props) { return { bob: true }; }
  ],
  config: {
    monitorWidth: true,
    monitorHeight: false,
    refreshRate: 16,
    pure: true
  }
})(MyComponent)
```

#### Arguments

  - `config` (_Object_): An object containing the queries and configuration.
    - `queries` (_Array_): An array of query functions:
      - `query(size, [ownProps]) : props` (_Function_): A query function which can be provided as a set of arguments, or can be contained within an array containing one or more queries.
        - `size` (_Object_): Contains the current dimensions of your wrapped component.
          - `[width]` (_Number_): Will only be provided if the `monitorWidth` configuration option is set to `true`. The current width of your component.  
          - `[height]` (_Number_): Will only be provided if the `monitorHeight` configuration option is set to `true`. The current height of your component.  
        - [`ownProps`] \(_Object_): The additional props which have been provided to your wrapped component.
    - `[config]` (_Object_): Custom configuration.
      - `[monitorWidth]` (_Boolean_): If `true` then the width of your component will be tracked and provided within the `size` argument to your query functions. Defaults to `true`.
      - `[monitorHeight]` (_Boolean_): If `true` then the height of your component will be tracked and provided within the `size` argument to your query functions. Defaults to `false`.
      - `[refreshRate]` (_Number_): The maximum frequency, in milliseconds, at which size changes should be recalculated when changes in your Component's rendered size are being detected. This must not be set to lower than 16.  Defaults to `16`.
      - `[noPlaceholder]` (_Boolean_): By default we render a "placeholder" component initially so we can try and "prefetch" the expected size for your component. This is to avoid any unnecessary deep tree renders.  If you feel this is not an issue for your component case and you would like to get an eager render of your component then disable the placeholder using this config option. Defaults to `false`.
      - `[pure]` (_Boolean_): Indicates if your component should be considered "pure", i.e. it should only be rerendered if the result of your query functions change, or if new props are provided to the wrapped component. If you set it to false then the wrapped component will render _every_ time the size changes, even if it doesn't result in new query provided props. Defaults to `true`.
      - [`conflictResolver(prev, current, key) : Any`] \(_Function_): A custom function to use in order to resolve prop conflicts when two or more query functions return a prop with the same key.  This gives you an opportunity to do custom resolution for special prop types, e.g. `className` where you could instead concat the conflicted values.  The default implementation will return the value from the _last_ query function provided in the query array.  Please read the respective section further down in the readme for more info and examples of this.
         - `prev` (_Any_): The value of the conflicted prop provided by the previously executed query function.
         - `current` (_Any_): The value of the conflicted prop provided by the most recently executed query function.
         - `key` (_Any_): The name of the prop which is in conflict.

## Examples

Below are a few super simple examples highlighting the usage and capabilities of the library. They are using the ES6 syntax described above to define the queries.

__Example 1: Queries on your Component's width__

By default the ComponentQueries higher order component only operates on width. This is a design decision as in most cases we only wish to query against width, therefore we ignore height changes to minimize any potential DOM spamming.  If you would like to operate on height too then please see Example 2.

```javascript
import componentQueries from 'react-component-queries';

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

export default componentQueries(
  // Provide as many query functions as you need.
  ({ width }) => {
    if (width <= 330) return { breakpoint: 'small' };
    if (width > 330 && width <=960) return { breakpoint: 'medium' };
    return { breakpoint: 'large' };
  }
)(MyComponent);
```

__Example 2: Queries on your Component's width AND height__

If you would like to operate on height also then you must use the extended configuration mode shown below to enable monitoring on the height of your component:

```javascript
import componentQueries from 'react-component-queries';

class MyComponent extends Component {
  render() {
    return (
      <div>
        {/* We recieve the following props from our queries */}
        I am at {this.props.breakpoint} scale.<br />
        I am {this.props.short ? 'short' : 'long'}<br />
        I am {this.props.square ? 'square' : 'rectangular'}
      </div>
    );
  }
}

// NOTE: We are passing in a configuration object now.
export default componentQueries({
  queries: [
    // Use just the width.
    ({ width }) => {
      if (width <= 330) return { breakpoint: 'small' };
      if (width > 330 && width <=960) return { breakpoint: 'medium' };
      return { breakpoint: 'large' };
    },
    // Or use just the height.
    ({ height }) => ({ short: height > 200 }),
    // Or use both.
    ({ width, height }) => ({ square: width === height }),
  ],
  config: { monitorHeight: true }
})(MyComponent);
```

As you can see we expose a `sizeMeConfig`, please see the [`react-sizeme`](https://github.com/ctrlplusb/react-sizeme) for the full list of options that you can provide.

## Prop Conflict Handling

As it is possible for you to provide props from multiple queries there could be cases where prop clashing occurs.  By default we have an order of preference for which prop value should be resolved in the case of conflicts.  

__The rule is:__ Custom passed in props take preference followed by the last item in the query collection.

Let's illustrate this given the following component:

```
const MyComponent = componentQueries(
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
function (prevPropValue: Any, currentPropValue: Any, propName: String) : Any
```

To solve our above described case we could provide the following implementation of the `conflictResolver`:

```javascript
const MyComponent = componentQueries({
  queries: [
    ({ width }) => ({ className: 'foo', poop: 'splash' }),
    ({ width }) => ({ className: 'bar', poop: 'plop' })
  ],
  conflictResolver: (prev, current, key) => {
    // If the prop is "className" we will concat the new value to
    // the current value.
    if (key === 'className') {
      return prev.concat(' ', current);
    }
    // Otherwise we return the current value, overriding the prev value.
    return current;
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
