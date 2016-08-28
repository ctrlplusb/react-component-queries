const createDom = require('./jsdom').createDom;

/**
 * Fix react dom configuration.
 * @see http://stackoverflow.com/questions/26867535/calling-setstate-in-jsdom-based-tests-causing-cannot-render-markup-in-a-worker/26872245
 */
createDom();
