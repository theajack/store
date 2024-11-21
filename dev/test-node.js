/*
 * @Author: chenzhongsheng
 * @Date: 2024-11-21 11:02:00
 * @Description: Coding something
 */
const {createStore, watch, computed, watchImme, join, watchPure, raw} = require('../npm');
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