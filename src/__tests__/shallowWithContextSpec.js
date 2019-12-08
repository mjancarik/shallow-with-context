import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { withContext } from '../shallowWithContext';

Enzyme.configure({ adapter: new Adapter() });

describe('shallowWithContenxt module', () => {
  const context = {
    dispatch: () => {}
  };

  function InlineComponent(props, context) {
    context.dispatch();

    return <span>{props.text}</span>;
  }

  class ClassComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
    }

    componentDidMount() {
      this.context.dispatch();
    }

    render() {
      this.context.dispatch();

      return <div>{this.props.text}</div>;
    }
  }

  it('should shallow render class component', () => {
    const ContextComponent = withContext(ClassComponent, context);
    const wrapper = shallow(<ContextComponent text="text" />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        text
      </div>
    `);
  });

  it('should shallow render function component', () => {
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
});
