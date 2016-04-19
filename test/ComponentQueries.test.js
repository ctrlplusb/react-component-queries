import React from 'react';
import { expect } from 'chai';
import { describeWithDOM } from './jsdom';
import { mount } from 'enzyme';

describeWithDOM(`Given the ComponentQueries library`, () => {
  let ComponentQueries;
  let sizeMeConfig;

  beforeEach(() => {
    ComponentQueries = require(`../src/index.js`).default;

    // Set up our mocks.
    const ComponentQueriesRewireAPI = ComponentQueries.__RewireAPI__;

    // Mock the SizeMe HOC to just return our ComponentQueries instance.
    ComponentQueriesRewireAPI.__Rewire__(`SizeMe`, config => {
      sizeMeConfig = config; return x => x;
    });
  });

  describe(`When setting up the ComponentQueries HOC`, () => {
    describe(`And no queries are provided`, () => {
      it(`Then an error should be thrown`, () => {
        const simpleConfig = () => {
          ComponentQueries();
        };
        expect(simpleConfig)
          .to.throw(/provide at least one query to ComponentQueries/);

        const complexConfig = () => {
          ComponentQueries({
            queries: []
          });
        };
        expect(complexConfig)
          .to.throw(/provide at least one query to ComponentQueries/);

        const complexConfig2 = () => {
          ComponentQueries({
            queries: `foo`
          });
        };
        expect(complexConfig2)
          .to.throw(/"queries" must be provided as an array/);
      });
    });

    describe(`And an invalid query type is provided`, () => {
      it(`Then an error should be thrown`, () => {
        const simpleConfig = () => {
          ComponentQueries(`wrong!`);
        };
        expect(simpleConfig)
          .to.throw(/queries for ComponentQueries should be functions/);

        const complexConfig = () => {
          ComponentQueries({
            queries: [`foo`]
          });
        };
        expect(complexConfig)
          .to.throw(/queries for ComponentQueries should be functions/);
      });
    });

    describe(`And no sizeMeConfig configuration is provided`, () => {
      it(`Then the default config should be given to SizeMe`, () => {
        ComponentQueries(() => ({}))(() => <div></div>);

        expect(sizeMeConfig).to.eql({
          monitorHeight: false,
          monitorWidth: true,
          refreshRate: 16
        });
      });
    });

    describe(`And a custom sizeMeConfig configuration is provided`, () => {
      it(`Then the custom config should be given to SizeMe`, () => {
        ComponentQueries({
          queries: [() => ({})],
          sizeMeConfig: {
            monitorHeight: true,
            monitorWidth: false,
            refreshRate: 200
          }
        })(() => <div></div>);

        expect(sizeMeConfig).to.eql({
          monitorHeight: true,
          monitorWidth: false,
          refreshRate: 200
        });
      });
    });
  });

  describe(`When rendering a component queries component`, () => {
    it(`Then it should receive the appropriate props based on it's queries`, () => {
      let receivedProps;

      const ComponentQueriedComponent = ComponentQueries({
        queries: [
          ({ width }) => width <= 100 ? { foo: `bar` } : {},
          ({ width }) => width > 100 && width <= 500 ? { bob: `baz` } : {},
          ({ height }) => height <= 100 ? { zip: `zap` } : {}
        ],
        sizeMeConfig: {
          monitorHeight: true
        }
      })((props) => { receivedProps = props; return <div></div>; });

      // Initial render
      const mounted = mount(<ComponentQueriedComponent size={{ width: 100, height: 100 }} />);
      expect(receivedProps).to.eql({ foo: `bar`, zip: `zap` });

      // Update size, but no size change
      mounted.setProps({ size: { width: 100, height: 100 } });
      expect(receivedProps).to.eql({ foo: `bar`, zip: `zap` });

      // Update size, with change.
      mounted.setProps({ size: { width: 101, height: 99 } });
      expect(receivedProps).to.eql({ bob: `baz`, zip: `zap` });

      // Update size, with change.
      mounted.setProps({ size: { width: 101, height: 101 } });
      expect(receivedProps).to.eql({ bob: `baz` });
    });

    it(`Then height should be undefined if we are not monitoring height`, () => {
      let actualHeight;

      const ComponentQueriedComponent = ComponentQueries(
        ({ height }) => { actualHeight = height; return {}; }
      )(() => <div></div>);

      // Initial render
      mount(<ComponentQueriedComponent size={{ width: 100, height: 100 }} />);
      expect(actualHeight).to.equal(undefined);
    });

    it(`Then it should throw an error when a duplicate prop is provided`, () => {
      const ComponentQueriedComponent = ComponentQueries(
        ({ width }) => width <= 100 ? { foo: `bar` } : {}
      )(() => <div></div>);

      // Initial render duplicate prop
      const onMount = () => mount(
        <ComponentQueriedComponent foo="foo" size={{ width: 100, height: 100 }} />
      );

      expect(onMount).to.throw(/Duplicate prop has been provided/);

      // Updated component duplicate prop
      const mounted = mount(
        <ComponentQueriedComponent size={{ width: 100, height: 100 }} />
      );

      const updateComponent = () =>
        mounted.setProps({ foo: `baz` });

      expect(updateComponent).to.throw(/Duplicate prop has been provided/);
    });
  });
});
