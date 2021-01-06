import * as React from 'react';
import ReactReconciler from 'react-reconciler';
import * as L from 'leaflet';

import { is, invariant, extractEventHandlers as _extractEvents } from './utils';

const roots = new Map<L.Map, ReactReconciler.FiberRoot>();

interface Events {
  [x: string]: Function;
}

type PublicInstance = L.Layer | L.Control;

type Instance = {
  rawType: string;
  category: string;
  type: string;
  current: PublicInstance;
  container: Instance;
  parent: Instance | null;
  boundObjects: Array<any>;
  bind?: string;
};

const Categories = {
  LAYER: 'layer',
  CONTROL: 'control',
};

function _diffProps(oldProps: any, newProps: any) {
  let props: any = {};

  for (const [prop, newValue] of Object.entries(newProps)) {
    if (prop in oldProps && is.equ(oldProps[prop], newValue)) continue; // No changes
    props[prop] = newValue;
  }

  return props;
}

function _diffEvents(oldEvents: Events, newEvents: Events) {
  let result: { old: Events; new: Events } = {
    old: {},
    new: {},
  };

  for (const [event, newHandler] of Object.entries(newEvents)) {
    if (!(event in oldEvents)) {
      // New handler added
      result.new[event] = newHandler;
    } else if (!is.equ(oldEvents[event], newHandler)) {
      // Handler changed
      result.old[event] = oldEvents[event];
      result.new[event] = newHandler;
    } else {
      // No change
    }
  }

  return result;
}

function _updateProps(instance: PublicInstance, props: any) {
  for (const [prop, value] of Object.entries(props)) {
    const setMethod = `set${prop[0].toUpperCase()}${prop.slice(1)}`;

    if (setMethod in instance) {
      (instance as any)[setMethod]?.(value);
    }
  }
}

function _updateEvents(
  instance: PublicInstance,
  events: { old: any; new: any }
) {
  const { old: oldEvents, new: newEvents } = events;

  // Remove old handlers
  for (const [event, oldHandler] of Object.entries(oldEvents)) {
    (instance as any).off(event, oldHandler);
  }

  // Add new handlers
  for (const [event, newHandler] of Object.entries(newEvents)) {
    (instance as any).on(event, newHandler);
  }
}

function _bindObject(parent: Instance, child: Instance) {
  if (!child.bind) return;

  parent.boundObjects.push(child);
  const bindFunctionName = `bind${child.bind[0].toUpperCase()}${child.bind.slice(
    1
  )}`;
  invariant(
    bindFunctionName in parent.current,
    `${child.bind} is not a valid binding`
  );
  (parent.current as any)[bindFunctionName](child.current);
}

function _unbindObject(parent: Instance, child: Instance) {
  if (!child.bind) return;

  parent.boundObjects = parent.boundObjects.filter(
    (x: any) => !is.equ(x, child)
  );
  const unbindFunctionName = `unbind${child.bind[0].toUpperCase()}${child.bind.slice(
    1
  )}`;
  invariant(
    unbindFunctionName in parent.current,
    `${child.bind} is not a valid binding`
  );
  (parent.current as any)[unbindFunctionName](child);
}

function _filterSpecialProps(props: any) {
  const { args = [], bind, children, key, ref, ...rest } = props;
  return rest;
}

function createInstance(
  rawType: string,
  props: any,
  rootContainerInstance: any,
  hostContext: null,
  internalInstanceHandle: ReactReconciler.Fiber
): Instance {
  const categoryAndType = rawType.split('-');

  invariant(
    categoryAndType.length === 2,
    '`%s` is not a valid element type',
    rawType
  );

  const [category, type] = categoryAndType;

  let target;

  // TODO: Wrap leaflet so that layers are exposed at L.layer.<name>
  if ([Categories.CONTROL].includes(category)) {
    target = (L as any)[category][type];
  } else {
    target = (L as any)[type];
  }

  invariant(
    target,
    `${category}.${type} does not exist in the Leaflet namespace`
  );

  const { args = [], bind, children, key, ref, ...rest } = props;

  // Extract event handlers from props
  const eventHandlers = _extractEvents(rest);

  // Remaining props are treated as options
  const remainingProps = Object.fromEntries(
    Object.entries(rest).filter(([key, value]) => !(key in eventHandlers))
  );

  // Instantiate Leaflet element
  const instance = target(...args, remainingProps);

  // Apply props
  _updateProps(instance, remainingProps);

  // Add event handlers
  _updateEvents(instance, { old: {}, new: eventHandlers });

  return {
    rawType,
    category,
    type,
    current: instance,
    container: rootContainerInstance,
    parent: null,
    boundObjects: [],
    bind,
  };
}

function appendChild(parent: Instance, child: Instance) {
  console.log('appendChild', parent.type, child.type);

  if (!child.bind) {
    invariant(
      undefined,
      'Making `%s` a child of `%s` is unsupported at this time. Did you forget to add a binding?',
      child.rawType,
      parent.rawType
    );
  }

  _bindObject(parent, child);
}

function appendChildToContainer(container: L.Map, child: Instance) {
  console.log('appendChildToContainer', container, child.type);

  switch (child.category) {
    case Categories.LAYER:
      container.addLayer(child.current as L.Layer);
      break;
    case Categories.CONTROL:
      container.addControl(child.current as L.Control);
      break;
    default:
      invariant(
        undefined,
        'Invalid element category `%s`. Must be one of: %s',
        child.category,
        Object.values(Categories)
      );
  }
}

function removeChild(parent: Instance, child: Instance) {
  if (!child.bind) {
    invariant(
      undefined,
      'Making `%s` a child of `%s` is unsupported at this time. Did you forget to add a binding?',
      child.rawType,
      parent.rawType
    );
  }

  _unbindObject(parent, child);
}

function removeChildFromContainer(container: L.Map, child: Instance) {
  console.log('removeChildFromContainer', container, child.type);

  switch (child.category) {
    case Categories.LAYER:
      container.removeLayer(child.current as L.Layer);
      break;
    case Categories.CONTROL:
      container.removeControl(child.current as L.Control);
      break;
    default:
      invariant(
        undefined,
        'Invalid element category `%s`. Must be one of: %s',
        child.category,
        Object.values(Categories)
      );
  }
}

function insertBefore(parentInstance: any, child: any, beforeChild: any) {
  appendChild(parentInstance, child);
}

function prepareUpdate(
  instance: Instance,
  type: any,
  oldProps: object,
  newProps: object,
  rootContainerInstance: any,
  currentHostContext: any
) {
  const filteredOldProps = _filterSpecialProps(oldProps);
  const filteredNewProps = _filterSpecialProps(newProps);

  const oldEvents = _extractEvents(filteredOldProps);
  const newEvents = _extractEvents(filteredNewProps);

  const oldRemainingProps = Object.fromEntries(
    Object.entries(filteredOldProps).filter(
      ([key, value]) => !(key in oldEvents)
    )
  );
  const newRemainingProps = Object.fromEntries(
    Object.entries(filteredNewProps).filter(
      ([key, value]) => !(key in newEvents)
    )
  );

  return {
    props: _diffProps(oldRemainingProps, newRemainingProps),
    events: _diffEvents(oldEvents, newEvents),
  };
}

function commitUpdate(
  instance: Instance,
  updatePayload: any,
  type: string,
  oldProps: any,
  newProps: any,
  fiber: ReactReconciler.Fiber
) {
  console.log('commitUpdate', updatePayload);

  // Apply props
  _updateProps(instance.current, updatePayload.props);

  // Update event handlers
  _updateEvents(instance.current, updatePayload.events);
}

const Renderer = ReactReconciler<
  string,
  object,
  L.Map,
  Instance,
  any,
  any,
  PublicInstance,
  any,
  object,
  any,
  number,
  -1
>({
  now: Date.now,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,
  createInstance: createInstance,
  // @ts-ignore
  setTimeout: is.fun(setTimeout) ? setTimeout : undefined,
  // @ts-ignore
  clearTimeout: is.fun(clearTimeout) ? clearTimeout : undefined,
  noTimeout: -1,
  appendInitialChild: appendChild,
  appendChild: appendChild,
  appendChildToContainer: appendChildToContainer,
  removeChild: removeChild,
  removeChildFromContainer: removeChildFromContainer,
  insertBefore: insertBefore,
  insertInContainerBefore: insertBefore,
  prepareUpdate: prepareUpdate,
  commitUpdate: commitUpdate,
  getPublicInstance(instance: Instance) {
    return instance.current;
  },
  getRootHostContext(rootContainerInstance) {
    let rootContext = {};
    return rootContext;
  },
  getChildHostContext(parentHostContext, type, rootContainerInstance) {
    let context = {};
    return context;
  },
  shouldSetTextContent(type, props) {
    return false;
  },
  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    // no-op
  },
  finalizeInitialChildren(
    parentInstance,
    type,
    props,
    rootContainerInstance,
    hostContext
  ) {
    return false;
  },
  prepareForCommit(rootContainerInstance) {
    // no-op
  },
  resetAfterCommit(rootContainerInstance) {
    // no-op
  },
  shouldDeprioritizeSubtree() {
    return false;
  },
  scheduleDeferredCallback() {},
  cancelDeferredCallback() {},
  clearContainer() {
    return false;
  },
});

export function render(element: React.ReactNode, container: L.Map) {
  let root = roots.get(container);
  if (!root) {
    let newRoot = (root = Renderer.createContainer(container, false, false));
    roots.set(container, newRoot);
  }

  Renderer.updateContainer(element, root, null, () => undefined);
  return Renderer.getPublicRootInstance(root);
}

export function unmountComponentAtNode(container: L.Map) {
  const root = roots.get(container);
  if (root) {
    Renderer.updateContainer(
      null,
      root,
      null,
      () => void roots.delete(container)
    );
    container.remove();
  }
}

Renderer.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  //@ts-ignore
  findHostInstanceByFiber: () => null,
  version: React.version,
  rendererPackageName: 'react-leaflet-fiber',
});
