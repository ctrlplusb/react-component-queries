import React from 'react';
import { expect } from 'chai';
import { describeWithDOM } from './jsdom';
import { mount } from 'enzyme';

describeWithDOM(`Given the ComponentQueries library`, () => {
  let ComponentQueries;

  beforeEach(() => {
    ComponentQueries = require(`../src/index.js`).default;

    // Set up our mocks.
    const ComponentQueriesRewireAPI = ComponentQueries.__RewireAPI__;

    // Mock the SizeMe HOC to just return our ComponentQueries instance.
    ComponentQueriesRewireAPI.__Rewire__(`SizeMe`, () => x => x);
  });

  describe(`When providing a configuration object`, () => {
    describe(`And no queries are provided`, () => {
      it(`Then an error should be thrown`, () => {
        const action = () => {
          ComponentQueries();
        };

        expect(action).to.throw(/provide at least one query to ComponentQueries/);
      });
    });

    describe(`And an invalid query type is provided`, () => {
      it(`Then an error should be thrown`, () => {
        const action = () => {
          ComponentQueries(`wrong!`);
        };

        expect(action).to.throw(/queries for ComponentQueries should be functions/);
      });
    });
  });

  describe(`When rendering a component queries component`, () => {
    it(`Then it should receive the appropriate props based on it's queries`, () => {
      let receivedProps;

      const ComponentQueriedComponent = ComponentQueries(
        ({ width }) => width <= 100 ? { foo: `bar` } : {},
        ({ width }) => width > 100 && width <= 500 ? { bob: `baz` } : {},
        ({ height }) => height <= 100 ? { zip: `zap` } : {}
      )((props) => { receivedProps = props; return <div></div>; });

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
