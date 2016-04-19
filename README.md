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

## Simple Example 

Below is a super simple example highlighting the use of the library. Read the Usage section in its entirety for a full description on configuration and usage.

```javascript
import ComponentQueries from 'react-component-queries';

class MyComponent extends Component {
  render() {
    return (
      <div>My scale prop value is {this.props.scale}</div>
    );
  }
}

export default ComponentQueries(
  // Provide as many query functions as you need.
  ({ width }) => width <= 330 ? { scale: 'mobile' } : {},
  ({ width }) => width > 330 && width <=960 ? { scale: 'tablet' } : {},
  ({ width }) => width > 960 ? { scale: 'desktop' } : {},
  // Pass in height too
  ({ height }) => height > 200 ? { short: false } : { short: true },
  // Or both
  ({ width, height }) => width === height ? { square: true } : { square: false },
)(MyComponent);
```

## Install

There is a peer-dependency on `react-sizeme`, so run the following command to install both libraries:

```
npm install react-sizeme react-component-queries --save
```