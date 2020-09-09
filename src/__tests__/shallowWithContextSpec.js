import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import { withContext, createContext } from '../shallowWithContext';

Enzyme.configure({ adapter: new Adapter() });

describe('shallowWithContext module', () => {
  let context = null;

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

    bar() {
      return this.context.dispatch();
    }

    componentDidMount() {
      this.context.dispatch();
    }

    render() {
      return <div>{this.props.text}</div>;
    }
  }

  class ClassReduxComponent extends React.Component {
    render() {
      return <div>{this.props.todos.concat(',')}</div>;
    }
  }

  function todos(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          ...state,
          todos: state.todos.concat([action.payload.content])
        };
      default:
        return state;
    }
  }

  function addTodo(content) {
    return {
      type: 'ADD_TODO',
      payload: {
        content
      }
    };
  }

  const store = createStore(todos, { todos: ['Use Redux'] });

  const mapStateToProps = state => {
    return {
      todos: state.todos
    };
  };

  function ReduxProvider(props) {
    const { children } = props;
    return <Provider store={props.store}>{children}</Provider>;
  }

  const ConnectedClassReduxComponent = connect(mapStateToProps, { addTodo })(
    ClassReduxComponent
  );

  class ThemeClassComponent extends React.Component {
    componentDidMount() {
      return this.context;
    }

    componentDidUpdate() {
      return this.context;
    }

    foo() {
      return this.context;
    }

    render() {
      return <div>{this.context}</div>;
    }
  }

  class ClassComponentWithoutContext extends React.Component {
    constructor() {
      super();
      this.doSomething();
    }

    doSomething() {}

    render() {
      return <div>{this.props.text}</div>;
    }
  }

  beforeEach(() => {
    context = {
      dispatch: () => {}
    };
  });

  it('should shallow render class component for context with object value', () => {
    const ContextComponent = withContext(ClassComponent, context);
    const wrapper = shallow(<ContextComponent text="text" />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        text
      </div>
    `);
  });

  it('should call create context multiple times', () => {
    context = createContext(context);
    context = createContext(context);
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

  it('should not modified original class component for context with primitive value', () => {
    context = createContext('light');
    const ThemeContextComponent = withContext(ThemeClassComponent, context);
    const wrapper = shallow(<ThemeContextComponent />, { context });

    expect(wrapper).toMatchInlineSnapshot(`
      <div>
        light
      </div>
    `);
  });

  it('should passed context when calling a class function via `.instance()` for context with primitive value', () => {
    context = createContext('light');
    const ThemeContextComponent = withContext(ThemeClassComponent, context);
    const wrapper = shallow(<ThemeContextComponent />, { context });

    expect(wrapper.instance().foo()).toBe('light');
  });

  it('should passed context when calling a class function via `.instance()` for context with object value', () => {
    context.dispatch = jest.fn();
    const classContext = createContext(context);
    const ContextComponent = withContext(ClassComponent, classContext);
    const wrapper = shallow(<ContextComponent text="text" />, {
      context: classContext
    });

    wrapper.instance().bar();

    expect(context.dispatch).toHaveBeenCalled();
  });

  it('without context', () => {
    const classContext = createContext();
    const ContextComponent = withContext(
      ClassComponentWithoutContext,
      classContext
    );

    expect(() => {
      shallow(<ContextComponent text="text" />, {
        context: classContext
      });
    }).not.toThrow();
  });

  it('should shallow render connected class component with redux', () => {
    const classContext = createContext({ store });
    const ContextComponent = withContext(
      ConnectedClassReduxComponent,
      classContext
    );

    const wrapper = shallow(<ContextComponent store={store} />, {
      wrappingComponent: ReduxProvider,
      wrappingComponentProps: classContext.value,
      context: classContext
    });

    expect(wrapper).toMatchInlineSnapshot(`
      <ContextProvider
        value={null}
      >
        <ClassReduxComponent
          addTodo={[Function]}
          store={
            Object {
              "dispatch": [Function],
              "getState": [Function],
              "replaceReducer": [Function],
              "subscribe": [Function],
              Symbol(observable): [Function],
            }
          }
          todos={
            Array [
              "Use Redux",
            ]
          }
        />
      </ContextProvider>
    `);
  });

  it('should shallow render class component with context defined as class properties', () => {
    const MyContext = React.createContext({});
    class ClassComponentWithClassProperties extends React.Component {
      static contextType = MyContext;

      render() {
        const { type } = this.context;
        return (
          <div>
            {type}, {this.props.prop}
          </div>
        );
      }
    }

    const defaultProps = { prop: 'value' };
    const context = createContext({ type: 'user' });
    const ContextComponent = withContext(
      ClassComponentWithClassProperties,
      context
    );

    const component = shallow(<ContextComponent {...defaultProps} />, {
      context: context
    });
    expect(component).toMatchInlineSnapshot(`
      <div>
        user
        , 
        value
      </div>
    `);
  });

  it('should shallow render class component with static react life cycle method', () => {
    class ClassWithStaticMethod extends React.Component {
      static getDerivedStateFromProps() {
        return {};
      }

      render() {
        const { type } = this.context;
        return (
          <div>
            {type}, {this.props.prop}
          </div>
        );
      }
    }

    const defaultProps = { prop: 'value' };
    const context = createContext({ type: 'user' });
    const ContextComponent = withContext(ClassWithStaticMethod, context);

    const component = shallow(<ContextComponent {...defaultProps} />, {
      context: context
    });
    expect(component).toMatchInlineSnapshot(`
      <div>
        user
        , 
        value
      </div>
    `);
  });
});
