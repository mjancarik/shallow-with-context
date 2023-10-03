import { aop, hookName, createHook } from 'to-aop';
import { createCloneClass } from 'create-clone-class';

const SHALLOW_CONTEXT_FLAG = '__SHALLOW_CONTEXT_FLAG__';

const classHookAround = createHook(
  hookName.aroundMethod,
  /.*/,
  ({ object, property, context, args }) => {
    const originalContext = context ? context.context : undefined;

    if (
      originalContext &&
      typeof originalContext === 'object' &&
      !Array.isArray(originalContext)
    ) {
      context.context = Object.prototype.hasOwnProperty.call(
        originalContext,
        SHALLOW_CONTEXT_FLAG,
      )
        ? originalContext.value
        : originalContext;
    }

    const originalResult = Reflect.apply(object[property], context, args);

    if (context) {
      context.context = originalContext;
    }

    return originalResult;
  },
);

export function createContext(value) {
  if (
    value &&
    Object.prototype.hasOwnProperty.call(value, SHALLOW_CONTEXT_FLAG)
  ) {
    return value;
  }

  let context = {
    value,
  };

  Reflect.defineProperty(context, SHALLOW_CONTEXT_FLAG, {
    value: true,
    enumerable: true,
    writable: false,
  });

  return context;
}

export function withContext(Component, context) {
  if (!context) {
    return Component;
  }

  const isValidMemoComponent =
    typeof Component === 'object' &&
    Component.type &&
    typeof Component.type === 'function' &&
    Component['$$typeof'];
  const isValidComponent =
    typeof Component === 'function' ||
    (typeof Component === 'object' &&
      Component.type &&
      Component.WrappedComponent) ||
    isValidMemoComponent;

  if (!isValidComponent) {
    throw new TypeError(
      `The defined Component must be function or specific react object. You give type of ${typeof Component}.`,
    );
  }

  if (typeof context !== 'object') {
    throw new TypeError(
      `The defined context must be object. You give type of ${typeof Component}.`,
    );
  }

  const legacyContext = Object.keys(context).reduce(
    (accumulatedContext, key) => {
      accumulatedContext[key] = () => {};

      return accumulatedContext;
    },
    {},
  );

  const LegacyContextComponent = cloneComponent(
    isValidMemoComponent ? Component.type : Component,
  );
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
            : context,
        );
      }
    }

    const CloneLegacyContextComponent = createCloneClass(
      LegacyContextComponent,
    );
    const originalConsoleWarn = console.warn;
    console.warn = () => {};
    aop(CloneLegacyContextComponent, classHookAround);
    console.warn = originalConsoleWarn;

    return CloneLegacyContextComponent;
  } else {
    if (Component.__isCloneComponent__) {
      Component = Component.__cloneFromComponent__;
    }

    let LegacyContextComponent = function (props, context, ...rest) {
      return Component.apply(this, [
        props,
        Object.prototype.hasOwnProperty.call(context, SHALLOW_CONTEXT_FLAG)
          ? context.value
          : context,
        ...rest,
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
