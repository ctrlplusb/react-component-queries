import React, { Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import sizeMe from 'react-sizeme'
import mergeWith from './utils/mergeWith'
import getDisplayName from './utils/getDisplayName'
import shallowEqual from './utils/shallowEqual'

const defaultConfig = {
  monitorHeight: false,
  monitorWidth: true,
  refreshRate: 16,
  pure: true,
  noPlaceholder: false,
}

const defaultConflictResolver = (x, y) => y

const defaultSizeMeConfig = () => ({
  monitorWidth: defaultConfig.monitorWidth,
  monitorHeight: defaultConfig.monitorHeight,
  refreshRate: defaultConfig.refreshRate,
})

/**
 * :: Queries -> Component -> Component
 *
 * This is a HOC that provides you with the mechanism to specify Component
 * queries. A Component query is a similar concept to media queries except it
 * operates on the Component's width/height rather than the entire viewport
 * width/height.
 */
function componentQueries(...params) {
  let queries
  let sizeMeConfig
  let pure
  let conflictResolver

  if (params.length === 1 && params[0].queries) {
    queries = params[0].queries || []
    if (params[0].sizeMeConfig) {
      // Old school config style.
      sizeMeConfig = params[0].sizeMeConfig || defaultSizeMeConfig()
      pure = defaultConfig.pure // this didn't exist before, so we default it.
    } else if (params[0].config) {
      // New school config style.
      pure = params[0].config.pure
      const {
        monitorHeight,
        monitorWidth,
        refreshRate,
        refreshMode,
        noPlaceholder,
      } = params[0].config
      sizeMeConfig = {
        monitorHeight:
          monitorHeight != null ? monitorHeight : defaultConfig.monitorHeight,
        monitorWidth:
          monitorWidth != null ? monitorWidth : defaultConfig.monitorWidth,
        refreshRate:
          refreshRate != null ? refreshRate : defaultConfig.refreshRate,
        refreshMode:
          refreshMode != null ? refreshMode : defaultConfig.refreshMode,
        noPlaceholder:
          noPlaceholder != null ? noPlaceholder : defaultConfig.noPlaceholder,
      }
    }
    conflictResolver =
      conflictResolver || params[0].conflictResolver || defaultConflictResolver
    invariant(
      typeof conflictResolver === 'function',
      'The conflict resolver you provide to ComponentQueries should be a function.',
    )
    invariant(
      Array.isArray(queries),
      '"queries" must be provided as an array when using the complex configuration.',
    )
  } else {
    queries = params
  }

  // TODO: Consider removing this check.  Perhaps it's best to just silently
  // pass through if no queries were provided?  Maybe a development based
  // warning would be the most useful.
  invariant(
    queries.length > 0,
    'You must provide at least one query to ComponentQueries.',
  )
  invariant(
    queries.filter(q => typeof q !== 'function').length === 0,
    'All provided queries for ComponentQueries should be functions.',
  )

  // We will default out any configuration if it wasn't set.
  sizeMeConfig = sizeMeConfig || defaultSizeMeConfig()
  conflictResolver = conflictResolver || defaultConflictResolver
  pure = pure != null ? pure : defaultConfig.pure

  const mergeWithCustomizer = (x, y, key) => {
    if (x === undefined) return undefined
    return conflictResolver(x, y, key)
  }

  return function WrapComponent(WrappedComponent) {
    class ComponentWithComponentQueries extends Component {
      static displayName = `ComponentQueries(${getDisplayName(
        WrappedComponent,
      )})`

      static propTypes = {
        size: PropTypes.shape({
          width: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
          height: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
        }).isRequired,
      }

      static WrappedComponent = WrappedComponent

      state = {
        queryResult: {},
      }

      componentWillMount() {
        const { size, ...otherProps } = this.props
        this.runQueries(size, otherProps)
      }

      componentWillReceiveProps(nextProps) {
        const { size } = this.props
        const { size: nextSize, ...nextOtherProps } = nextProps

        if (!shallowEqual(size, nextSize)) {
          this.runQueries(nextSize, nextOtherProps)
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        const {
          size, // eslint-disable-line no-unused-vars
          ...otherProps
        } = this.props
        const {
          size: nextSize, // eslint-disable-line no-unused-vars
          ...nextOtherProps
        } = nextProps

        return (
          !pure ||
          !shallowEqual(otherProps, nextOtherProps) ||
          !shallowEqual(this.state.queryResult, nextState.queryResult)
        )
      }

      runQueries({ width, height }, otherProps) {
        const queryResult = queries.reduce(
          (acc, cur) =>
            mergeWith(
              acc,
              cur(
                {
                  width: sizeMeConfig.monitorWidth ? width : null,
                  height: sizeMeConfig.monitorHeight ? height : null,
                },
                otherProps,
              ),
              mergeWithCustomizer,
            ),
          {},
        )

        this.setState({ queryResult })
      }

      render() {
        const {
          size, // eslint-disable-line no-unused-vars
          ...otherProps
        } = this.props

        const allProps = mergeWith(
          this.state.queryResult,
          otherProps,
          mergeWithCustomizer,
        )

        return <WrappedComponent {...allProps} />
      }
    }

    return sizeMe(sizeMeConfig)(ComponentWithComponentQueries)
  }
}

export default componentQueries
