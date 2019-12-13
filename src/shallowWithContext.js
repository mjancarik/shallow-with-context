import { aop, hookName, createHook } from 'to-aop';

const SHALLOW_CONTEXT_FLAG = '__SHALLOW_CONTEXT_FLAG__';

const classHookAround = createHook(
  hookName.aroundMethod,
  /^(render|shouldComponentUpdate|getSnapshotBeforeUpdate|componentDidUpdate|componentDidMount|componentWillUnmount)$/,
  ({ object, property, context, args }) => {
    const originalContext = context.context;
    context.context = Object.prototype.hasOwnProperty.call(
      originalContext,
      SHALLOW_CONTEXT_FLAG
    )
      ? originalContext.value
      : originalContext;

    const originalResult = Reflect.apply(object[property], context, args);
    context.context = originalContext;

    return originalResult;
  }
);

export function createContext(value) {
  let context = {
    value
  };

  Reflect.defineProperty(context, SHALLOW_CONTEXT_FLAG, {
    value: true,
    enumerable: true,
    writable: false
  });

  return context;
}

export function withContext(Component, context) {
  if (!context) {
    return Component;
  }

  if (typeof Component !== 'function') {
    throw new TypeError(
      `The defined Component must be function. You give type of ${typeof Component}.`
    );
  }

  if (typeof context !== 'object') {
    throw new TypeError(
      `The defined context must be object. You give type of ${typeof Component}.`
    );
  }

  const legacyContext = Object.keys(context).reduce(
    (accumulatedContext, key) => {
      accumulatedContext[key] = () => {};

      return accumulatedContext;
    },
    {}
  );

  const LegacyContextComponent = cloneComponent(Component);
  LegacyContextComponent.contextTypes = legacyContext;

  return LegacyContextComponent;
}

export function cloneComponent(Component) {
  if (Component && Component.prototype && Component.prototype.render) {
    class LegacyContextComponent extends Component {
      constructor(props, context) {
        super(
          props,
          Object.prototype.hasOwnProperty.call(context, SHALLOW_CONTEXT_FLAG)
            ? context.value
            : context
        );
      }

      shouldComponentUpdate(...rest) {
        return super.shouldComponentUpdate
          ? super.shouldComponentUpdate(...rest)
          : true;
      }

      getSnapshotBeforeUpdate(...rest) {
        return super.getSnapshotBeforeUpdate
          ? super.getSnapshotBeforeUpdate(...rest)
          : undefined;
      }

      componentDidUpdate(...rest) {
        return super.componentDidUpdate
          ? super.componentDidUpdate(...rest)
          : undefined;
      }

      componentDidMount(...rest) {
        return super.componentDidMount
          ? super.componentDidMount(...rest)
          : undefined;
      }

      render(...rest) {
        return super.render(...rest);
      }
    }

    const originalConsoleWarn = console.warn;
    console.warn = () => {};
    aop(LegacyContextComponent, classHookAround);
    console.warn = originalConsoleWarn;

    return LegacyContextComponent;
  } else {
    if (Component.__isCloneComponent__) {
      Component = Component.__cloneFromComponent__;
    }

    let LegacyContextComponent = function(props, context, ...rest) {
      return Component.apply(this, [
        props,
        Object.prototype.hasOwnProperty.call(context, SHALLOW_CONTEXT_FLAG)
          ? context.value
          : context,
        ...rest
      ]);
    };
    for (let key in Component) {
      if (Object.prototype.hasOwnProperty.call(Component, key)) {
        LegacyContextComponent[key] = Component[key];
      }
    }

    LegacyContextComponent.__isCloneComponent__ = true;
    LegacyContextComponent.__cloneFromComponent__ = Component;

    return LegacyContextComponent;
  }
}
