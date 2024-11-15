/*
 * @Author: chenzhongsheng
 * @Date: 2024-08-12 17:51:34
 * @Description: Coding something
 */
import {createStorage} from '../src/storage-store';
import {bind} from '../src/dom-store';
import {createStore, watch, watchPure, computed, join, raw, watchImme} from '../src/store';

const store = createStore({
    a: 1,
    b: 'test',
});

const computed1 = computed(() => {
    return store.a + store.b;
});

watch(store.a, (v, p) => {
    console.log('a change', v, p);
});
watch(computed1, (v, p) => {
    console.log('computed1 change', v, p, computed1.value);
});
watch(() => store.a + 1, (v, p) => {
    console.log('store.a + 1 change', v, p);
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
// pureWatch();

store.a = 2;
// store.b = 'test2';

// join change hello test
// a change 2
// computed1 change 2test
// store.a + 1 change 3
// computed1 change 2test2
// join change hello test2

const app = document.getElementById('app')!;

watchImme(join`hello ${store.b}`, (v) => {
    app.innerText = v;
});

const input = document.getElementById('input')!;

bind(input, store.a);

window.store = store;

const storage = createStorage({
    a: 1,
    b: 'test',
});

window.storage = storage;