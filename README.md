# shallow-with-context

[![Build Status](https://travis-ci.org/mjancarik/shallow-with-context.svg?branch=master)](https://travis-ci.org/mjancarik/shallow-with-context) [![dependencies Status](https://david-dm.org/mjancarik/shallow-with-context/status.svg)](https://david-dm.org/mjancarik/shallow-with-context)
[![Coverage Status](https://coveralls.io/repos/github/mjancarik/shallow-with-context/badge.svg?branch=master)](https://coveralls.io/github/mjancarik/shallow-with-context?branch=master)
[![NPM package version](https://img.shields.io/npm/v/shallow-with-context/latest.svg)](https://www.npmjs.com/package/shallow-with-context)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The module is temporary workaround for passing context in shallow rendering mode. The new React Context API is not supported in shallow rendering mode yet.

It use under hood Legacy Context API.

## Installation

```bash
npm i shallow-with-context --save-dev
```

## Usage

``` javascript
import { shallow } from 'enzyme';
import { withContext } from 'shallow-with-context';
import React from 'react';

const MyContext = React.createContext({ text: 'default' });
class Component extends React.Component {
  static contextType = MyContext;
  render() {
    return <div>{this.context.text}</div>
  }
}

describe('your description', () => {
  it('your spec', () => {
    const context = { text: 'new value' };
    const ComponentWithContext = withContext(Component, context);

    const wrapper = shallow(ComponentWithContext, { context });

    expect(wrapper).toMatchInlineSnapshot('<div>new value</div>');
  });
});
```

## API
### withContext
#### Parameters

-   `Component` (React.Component|React.PureComponent|function)
-   `context` Object<string, *>
