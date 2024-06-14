# react-required-contexts

A react component tree can require multiple react context, and its easy to be lost.
This library offer a way to define for each **component** and **hook** what are the required contexts.

It offers also some tools to **wrap** a component into **only its required contexts**.

## Setup

You have to create a config file for each context:

### 1 - Definition of context: `position.context.ts`

```ts
export const context = PositionContext;
export const provider = PositionProvider;
export const props = {
  startPosition: POSITIONS.TOP_LEFT,
};
```

The exported module (\*.context.ts) should be of TS type `ContextConfig`

### 2 - Library setup: combine all contexts (`required-contexts.ts`)

Then create a file that combine all the context together: `required-contexts.ts`

```ts
import * as position from './contexts/position.context';

export default {
  position,
};
```

Finally init the library by calling `setupDefaultContexts`

```ts
import { setupDefaultContexts } from '@alistigo/react-required-contexts';
import requiredContexts from 'config/required-contexts';

setupDefaultContexts(requiredContexts);
```

### 3 - For each component / hook / part of your application -> define their required contexts

#### Component

```tsx
import { PositionContext } from './contexts/position';

export default function MyComponent() {
  const { position } = useContext(PositionContext);

  return <span>{position}</span>;
}

// Required context definition
MyComponent.requiredContexts = [PositionContext];
```

#### Hook

```tsx
import { PositionContext } from './contexts/position';

export default function useMyHook() {
  const { position } = useContext(PositionContext);

  return position;
}

// Required context definition
useMyHook.requiredContexts = [PositionContext];
```

#### If a component have sub-component that also require some contexts

```tsx
import { mergeContexts } from '@alistigo/react-required-contexts';
import Component1 from './components/Component1';
import Component2 from './components/Component2';
import Component3 from './components/Component3';
import useMyHook from './hooks/useMyHook';

export default function MyApp() {
  useMyHook();

  return (
    <Component1>
      <Component2 />
      <Component3 />
    </Component1>
  );
}

// Required context definition
MyApp.requiredContexts = mergeContexts(
  Component1,
  Component1,
  Component3,
  useMyHook
);
```

## Usage

### Automatically wrap component into all the required contexts

```tsx
<RequiredContextsWrapper
  contexts={MyComponent.requiredContexts}
  parameters={{ position: { startPosition: 'new-position' } }}
>
  <MyComponent />
</RequiredContextsWrapper>
```
