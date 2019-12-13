import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { withContext, createContext } from '../shallowWithContext';

Enzyme.configure({ adapter: new Adapter() });

describe('shallowWithContenxt module', () => {
  let context = {
    dispatch: () => {}
  };

  function InlineComponent(props, context) {
    context.dispatch();

    return <span>{props.text}</span>;
  }

  function ThemeInlineComponent(props, context) {
    return <span>{context}</span>;
  }

  class ClassComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
    }

    componentDidMount() {
      this.context.dispatch();
    }

    render() {
      return <div>{this.props.text}</div>;
    }
  }

  class ThemeClassComponent extends React.Component {
    componentDidMount() {
      return this.context;
    }

    componentDidUpdate() {
      return this.context;
    }

    render() {
      return <div>{this.context}</div>;
    }
  }

  it('should shallow render class component for context with object value', () => {
    const ContextComponent = withContext(ClassComponent, context);
    const wrapper = shallow(<ContextComponent text="text" />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        text
      </div>
    `);
  });

  it('should shallow render class component for context with object value created from createContext', () => {
    context = createContext(context);
    const ContextComponent = withContext(ClassComponent, context);
    const wrapper = shallow(<ContextComponent text="text" />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        text
      </div>
    `);
  });

  it('should shallow render function component for context with object value', () => {
    const ContextComponent = withContext(InlineComponent, context);
    const wrapper = shallow(<ContextComponent text="text" />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <span>
        text
      </span>
    `);
  });

  it('should not modified original class component', () => {
    withContext(ClassComponent, context);

    expect(ClassComponent.contextTypes).toEqual(undefined);
  });

  it('should not modified original function component', () => {
    withContext(InlineComponent, context);

    expect(InlineComponent.contextTypes).toEqual(undefined);
  });

  it('should shallow render function component for context with primitive value', () => {
    context = createContext('light');
    const ThemeContextComponent = withContext(ThemeInlineComponent, context);
    const wrapper = shallow(<ThemeContextComponent />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <span>
        light
      </span>
    `);
  });

  it('should shallow render class component for context with primitive value', () => {
    context = createContext('light');
    const ThemeContextComponent = withContext(ThemeClassComponent, context);
    const wrapper = shallow(<ThemeContextComponent />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        light
      </div>
    `);
  });

  it('should shallow render class component for context set through setContext method', () => {
    context = createContext('light');
    const ThemeContextComponent = withContext(ThemeClassComponent, context);
    const wrapper = shallow(<ThemeContextComponent />, { context });

    wrapper.setContext(createContext('dark'));

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        dark
      </div>
    `);
  });

  it('should update class component with right context after calling setProps method', () => {
    const context2 = createContext('light');
    const ThemeContextComponent = withContext(ThemeClassComponent, context2);
    const wrapper = shallow(<ThemeContextComponent />, { context: context2 });

    wrapper.setProps({ property: 'property' });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        light
      </div>
    `);
  });

  it('should not modified original class component for context wtih primitive value', () => {
    context = createContext('light');
    withContext(ThemeClassComponent, context);
    const wrapper = shallow(<ThemeClassComponent />, { context });

    expect(ThemeClassComponent.prototype.render.toString())
      .toMatchInlineSnapshot(`
      "render() {
            return _react.default.createElement(\\"div\\", null, this.context);
          }"
    `);

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        <Component />
      </div>
    `);
  });
});
