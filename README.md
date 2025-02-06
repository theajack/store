<!--
 * @Author: theajack
 * @Date: 2023-05-09 22:31:06
 * @Description: Coding something
-->
# [tc-store](https://github.com/theajack/store)

Simple, small and reactive state store

[Playground](https://theajack.github.io/jsbox/?config=theajack.store)

## Features

- Light: 2.6kB gzip, 5.17kB min
- Persist: Support save in localstorage
- Simple to Use

## Install

```
npm i tc-store
```

```html
<script src="https://cdn.jsdelivr.net/npm/tc-store"></script>
<script>window.TCStore</script>
```

## Usage

### Store

```js
import { createStore, computed, watch, join, raw, watchPure, watchImme } from 'tc-store';
const store = createStore({
    a: 1,
    b: 'test',
});
const computed1 = computed(() => {
    return store.a + store.b;
});
watch(store.a, (v, p) => {
    console.log(`a change: cur=${v}; prev=${p}`);
});
watch(computed1, (v, p) => {
    console.log(`computed1 change: cur=${v}; prev=${p}`);
});
watch(() => store.a + 1, (v, p) => {
    console.log(`store.a + 1 change: cur=${v}; prev=${p}`);
});
watch(join`hello ${store.b} ${raw(1)} ${store.a}`, (v, p) => {
    console.log(`join change: cur=${v}; prev=${p}`);
});
watchPure(() => store.a + 1, () => {
    console.log(`store.a + 1 pure change`);
});
watchImme(() => store.a + 1, (v, p) => {
    console.log(`store.a + 1 imme change: cur=${v}; prev=${p}`);
});

store.a ++;
```

### StorageStore

Binding State with localstorage

```js
import { createStorage } from 'tc-store';
const store = createStorage({
    a: 1,
    b: 'test',
});

console.log(`store.a = ${store.a}`);

// this change will write into localstorage
// when you refresh the page, store.a will be 2
store.a = 2; 

// You can use all store methods
```

use `$id`

```js
import { createStorage } from 'tc-store';
const store = createStorage({
    $id: 'my-store', // Custom you storage id
    a: 1,
    b: 'test',
});
```

### DomStore

Binding State with HTMLElement

```js
import { createStore, bind, watchImme} from 'tc-store';
const store = createStore({
    content: 'test',
});
const div = document.createElement('div');
watchImme(store.content, (v) => {
    div.innerText = v;
});

const input = document.createElement('input');
bind(input, store.content); // This results in a two-way binding

document.body.append(div);
document.body.append(input);

store.content += '!';
```
