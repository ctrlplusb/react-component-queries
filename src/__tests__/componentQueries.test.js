/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */

import React from 'react'
import enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

describe('Given the ComponentQueries library', () => {
  let componentQueries
  let sizeMeConfig

  beforeEach(() => {
    jest.doMock('react-sizeme', () => config => {
      sizeMeConfig = config
      return x => x
    })

    componentQueries = require('../componentQueries').default
  })

  describe('When setting up the ComponentQueries HOC', () => {
    describe('And no queries are provided', () => {
      it('Then an error should be thrown', () => {
        const simpleConfig = () => {
          componentQueries()
        }
        expect(simpleConfig).toThrow(
          /provide at least one query to ComponentQueries/,
        )

        const complexConfig = () => {
          componentQueries({
            queries: [],
          })
        }
        expect(complexConfig).toThrow(
          /provide at least one query to ComponentQueries/,
        )

        const complexConfig2 = () => {
          componentQueries({
            queries: 'foo',
          })
        }
        expect(complexConfig2).toThrow(/"queries" must be provided as an array/)
      })
    })

    describe('And an invalid query type is provided', () => {
      it('Then an error should be thrown', () => {
        const simpleConfig = () => {
          componentQueries('wrong!')
        }
        expect(simpleConfig).toThrow(
          /queries for ComponentQueries should be functions/,
        )

        const complexConfig = () => {
          componentQueries({
            queries: ['foo'],
          })
        }
        expect(complexConfig).toThrow(
          /queries for ComponentQueries should be functions/,
        )
      })
    })

    describe('And no sizeMeConfig configuration is provided', () => {
      it('Then the default config should be given to SizeMe', () => {
        componentQueries(() => ({}))(() => <div />)

        expect(sizeMeConfig).toMatchObject({
          monitorHeight: false,
          monitorWidth: true,
          refreshRate: 16,
        })
      })
    })

    describe('And a custom sizeMeConfig configuration is provided', () => {
      it('Then the custom config should be given to SizeMe', () => {
        componentQueries({
          queries: [() => ({})],
          sizeMeConfig: {
            monitorHeight: true,
            monitorWidth: false,
            noPlaceholder: true,
            refreshRate: 200,
          },
        })(() => <div />)

        expect(sizeMeConfig).toMatchObject({
          monitorHeight: true,
          monitorWidth: false,
          refreshRate: 200,
          noPlaceholder: true,
        })
      })
    })

    describe('And a custom config is provided', () => {
      it('Then the custom config should be given to SizeMe', () => {
        const conflictResolver = () => undefined

        componentQueries({
          queries: [() => ({})],
          config: {
            monitorHeight: true,
            monitorWidth: false,
            refreshRate: 200,
            refreshMode: 'debounce',
            noPlaceholder: true,
            conflictResolver,
          },
        })(() => <div />)

        expect(sizeMeConfig).toMatchObject({
          monitorHeight: true,
          monitorWidth: false,
          refreshRate: 200,
          refreshMode: 'debounce',
          noPlaceholder: true,
        })
      })
    })
  })

  describe('When rendering a component queries component', () => {
    it("Then it should receive the appropriate props based on it's queries", () => {
      let receivedProps

      const ComponentQueriedComponent = componentQueries({
        queries: [
          ({ width }) => (width <= 100 ? { foo: 'bar' } : {}),
          ({ width }) => (width > 100 ? { bob: 'baz' } : {}),
          ({ height }) => (height <= 100 ? { zip: 'zap' } : {}),
        ],
        // NOTE: This is the old configuration.
        sizeMeConfig: {
          monitorWidth: true,
          monitorHeight: true,
        },
      })(props => {
        receivedProps = props
        return <div />
      })

      // Initial render
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 100, height: 100 }} />,
      )
      expect(receivedProps).toMatchObject({ foo: 'bar', zip: 'zap' })

      // Update size, but no size change
      mounted.setProps({ size: { width: 100, height: 100 } })
      expect(receivedProps).toMatchObject({ foo: 'bar', zip: 'zap' })

      // Update size, with change.
      mounted.setProps({ size: { width: 101, height: 99 } })
      expect(receivedProps).toMatchObject({ bob: 'baz', zip: 'zap' })

      // Update size, with change.
      mounted.setProps({ size: { width: 101, height: 101 } })
      expect(receivedProps).toMatchObject({ bob: 'baz' })
    })

    it('Then it should only rerender if the props have changed', () => {
      const ComponentQueriedComponent = componentQueries({
        queries: [
          ({ width }) => (width <= 100 ? { foo: 'bar' } : {}),
          ({ width }) => (width > 100 ? { bob: 'baz' } : {}),
        ],
      })(() => <div />)

      // Initial render
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 50 }} foo="bar" />,
      )
      const instance = mounted.instance()

      // Set up a spy on the render
      const renderSpy = jest.spyOn(instance, 'render')
      expect(renderSpy).toHaveBeenCalledTimes(0)

      // Change the width so that the queries produce a new result.
      mounted.setProps({ size: { width: 150 }, foo: 'bar' })
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Change the width so that the queries produce the same result.
      mounted.setProps({ size: { width: 120 }, foo: 'bar' })
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Change the value of an "other" prop should cause a new render.
      mounted.setProps({ size: { width: 120 }, foo: 'zip' })
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })

    it('Then an impure component should always render', () => {
      const ComponentQueriedComponent = componentQueries({
        queries: [({ width }) => (width <= 100 ? { foo: 'bar' } : {})],
        config: {
          pure: false,
        },
      })(() => <div />)

      // Initial render
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 50 }} foo="bar" />,
      )
      const instance = mounted.instance()

      // Set up a spy on the render
      const renderSpy = jest.spyOn(instance, 'render')
      expect(renderSpy).toHaveBeenCalledTimes(0)

      // Set the props causes a rerender.
      mounted.setProps({ size: { width: 150 }, foo: 'bar' })
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Set the same props causes a rerender.
      mounted.setProps({ size: { width: 150 }, foo: 'bar' })
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })

    it('Then it should pass the "other" props to the queries', () => {
      let actualProps

      const ComponentQueriedComponent = componentQueries((_, props) => {
        actualProps = props
        return {}
      })(() => <div />)

      // Initial mount should call queries.
      const expectedMountProps = { foo: 'bar', baz: 1 }
      const mounted = mount(
        <ComponentQueriedComponent
          size={{ width: 50 }}
          {...expectedMountProps}
        />,
      )
      expect(actualProps).toMatchObject(expectedMountProps)

      // Update should call queries with updated props.
      const expectedUpdateProps = { foo: 'bob', baz: 2 }
      mounted.setProps(
        Object.assign({}, { size: { width: 100 } }, expectedUpdateProps),
      )
      expect(actualProps).toMatchObject(expectedUpdateProps)
    })

    it('Then height should be undefined if we are not monitoring height', () => {
      let actualHeight

      const ComponentQueriedComponent = componentQueries(({ height }) => {
        actualHeight = height
        return {}
      })(() => <div />)

      // Initial render
      mount(<ComponentQueriedComponent size={{ width: 100, height: 100 }} />)
      expect(actualHeight).toEqual(null)
    })

    it('Then duplicate props should be overridden when using the default conflict resolver', () => {
      let receivedProps

      const ComponentQueriedComponent = componentQueries(
        ({ width }) => (width <= 100 ? { foo: 'bar' } : {}),
        ({ width }) => (width <= 100 ? { foo: 'baz' } : {}),
      )(props => {
        receivedProps = props
        return <div />
      })

      // Initial render with duplicate query result.
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 100, height: 100 }} />,
      )
      expect(receivedProps).toMatchObject({ foo: 'baz' })

      // Set a custom prop that conflicts with the query result.
      mounted.setProps({ foo: 'bob' })
      expect(receivedProps).toMatchObject({ foo: 'bob' })
    })

    it('Then a custom conflict resolver should behave as expected', () => {
      let receivedProps

      const ComponentQueriedComponent = componentQueries({
        queries: [
          ({ width }) => (width <= 100 ? { foo: 'bar' } : {}),
          ({ width }) => (width <= 100 ? { foo: 'bob' } : {}),
        ],
        conflictResolver: (x, y, key) => (key === 'foo' ? x.concat(' ', y) : y),
      })(props => {
        receivedProps = props
        return <div />
      })

      // Initial render duplicate prop
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 100, height: 100 }} />,
      )

      expect(receivedProps).toMatchObject({ foo: 'bar bob' })

      // Updated component duplicate prop
      mounted.setProps({ foo: 'baz' })

      expect(mounted.props().foo).toEqual('baz')
    })
  })
})
