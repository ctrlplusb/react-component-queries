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
        (width) => width <= 100 ? { foo: `bar` } : {},
        (width) => width > 100 && width <= 500 ? { bob: `baz` } : {}
      )((props) => { receivedProps = props; return <div></div>; });

      // Initial render
      const mounted = mount(<ComponentQueriedComponent size={{ width: 100, height: 100 }} />);
      expect(receivedProps).to.eql({ foo: `bar` });

      // Update size, but no size change
      mounted.setProps({ size: { width: 100, height: 100 } });
      expect(receivedProps).to.eql({ foo: `bar` });

      // Update size, with change.
      mounted.setProps({ size: { width: 101, height: 100 } });
      expect(receivedProps).to.eql({ bob: `baz` });
    });
  });
});
