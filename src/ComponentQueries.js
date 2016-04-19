// Libraries and Utils.
import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import SizeMe from 'react-sizeme';

/**
 * :: Queries -> Component -> Component
 *
 * This is a HOC that provides you with the mechanism to specify Component
 * queries. A Component query is a similar concept to media queries except it
 * operates on the Component's width/height rather than the entire viewport
 * width/height.
 */
function ComponentQueries(...queries) {
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
          Object.assign({}, acc, cur({ width, height }))
        , {});

        this.setState({ queryResult });
      }

      checkForDuplicateProps() {
        const provided = new Set(Object.keys(this.props));

        Object.keys(this.state.queryResult).forEach(queryProp =>
          invariant(
            !provided.has(queryProp),
            `Duplicate prop has been provided to Component with ComponentQueries: ${queryProp}`)
        );
      }

      render() {
        // We need this guard to execute here in order to guarantee we have
        // both the updated state and the passed in props.
        this.checkForDuplicateProps();

        const { size, ...otherProps } = this.props; // eslint-disable-line no-unused-vars

        return (
          <WrappedComponent
            {...this.state.queryResult}
            {...otherProps}
          />
        );
      }
    }

    ComponentWithComponentQueries.propTypes = {
      size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
      }).isRequired
    };

    return SizeMe({
      monitorWidth: true,
      monitorHeight: false
    })(ComponentWithComponentQueries);
  };
}

export default ComponentQueries;
