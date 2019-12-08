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
    return class LegacyContextComponent extends Component {};
  } else {
    if (Component.__isCloneComponent__) {
      Component = Component.__cloneFromComponent__;
    }

    let LegacyContextComponent = function(...rest) {
      return Component.apply(this, rest);
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
