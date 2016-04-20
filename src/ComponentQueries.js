// Libraries and Utils.
import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import SizeMe from 'react-sizeme';

const defaultSizeMeConfig = {
  monitorHeight: false,
  monitorWidth: true,
  refreshRate: 16
};

const mergeWith = (x, y, fn) => {
  const result = Object.assign({}, x);

  Object.keys(y).forEach(key => {
    if (x[key] && y[key]) {
      result[key] = fn(x[key], y[key], key);
    } else if (y[key]) {
      result[key] = y[key];
    }
  });

  return result;
};

const defaultConflictResolver = (x, y) => y;

/**
 * :: Queries -> Component -> Component
 *
 * This is a HOC that provides you with the mechanism to specify Component
 * queries. A Component query is a similar concept to media queries except it
 * operates on the Component's width/height rather than the entire viewport
 * width/height.
 */
function ComponentQueries(...params) {
  let queries;
  let sizeMeConfig;
  let conflictResolver;

  if (params.length === 1 && params[0].queries) {
    queries = params[0].queries || [];
    sizeMeConfig = params[0].sizeMeConfig || defaultSizeMeConfig;
    conflictResolver = params[0].conflictResolver || defaultConflictResolver;

    invariant(
      typeof conflictResolver === `function`,
      `The conflict resolver you provide to ComponentQueries should be a function.`
    );
    invariant(
      Array.isArray(queries),
      `"queries" must be provided as an array when using the complex configuration.`);
  } else {
    queries = params;
  }

  sizeMeConfig = sizeMeConfig || defaultSizeMeConfig;
  conflictResolver = conflictResolver || defaultConflictResolver;
  const mergeWithCustomizer = (x, y, key) => {
    if (x === undefined) return undefined;
    return conflictResolver(x, y, key);
  };

  invariant(
    queries.length > 0,
    `You must provide at least one query to ComponentQueries.`);
  invariant(
    queries.filter(q => typeof q !== `function`).length === 0,
    `All provided queries for ComponentQueries should be functions.`
  );

  return function WrapComponent(WrappedComponent) {
    class ComponentWithComponentQueries extends Component {
      state = {
        queryResult: {}
      }

      componentWillMount() {
        this.runQueries(this.props.size);
      }

      shouldComponentUpdate(nextProps) {
        const { size: currentSize } = this.props;
        const { size: nextSize } = nextProps;

        if (this.hasSizeChanged(currentSize, nextSize)) {
          this.runQueries(nextSize);
        }

        return true;
      }

      hasSizeChanged(current, next) {
        const { height: cHeight, width: cWidth } = current;
        const { height: nHeight, width: nWidth } = next;

        return (cHeight !== nHeight) || (cWidth !== nWidth);
      }

      runQueries({ width, height }) {
        const queryResult = queries.reduce((acc, cur) =>
          mergeWith(
            acc,
            cur({
              width: sizeMeConfig.monitorWidth ? width : null,
              height: sizeMeConfig.monitorHeight ? height : null
            }),
            mergeWithCustomizer
          )
        , {});

        this.setState({ queryResult });
      }

      render() {
        const { size, ...otherProps } = this.props; // eslint-disable-line no-unused-vars

        const allProps = mergeWith(
          this.state.queryResult,
          otherProps,
          mergeWithCustomizer);

        return (
          <WrappedComponent {...allProps} />
        );
      }
    }

    ComponentWithComponentQueries.propTypes = {
      size: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
      }).isRequired
    };

    return SizeMe(sizeMeConfig)(ComponentWithComponentQueries);
  };
}

export default ComponentQueries;
