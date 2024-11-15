/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-07 19:40:43
 * @Description: Coding something
 */

import {GlobalStoreUseHistory} from './store/history';

export function bind (dom: HTMLElement, v: any) {
    const {store, attr} = GlobalStoreUseHistory.latest;
    if (!store) throw new Error('Bind 参数错误');
    if (store.$get(attr) !== v) throw new Error('Bind 传入参数错误');

    let vType = 'string';
    if (dom.tagName === 'INPUT') {
        const type = dom.getAttribute('type');
        if (type === 'number' || type === 'range') {
            vType = 'number';
        } else if (type === 'radio' || type === 'checkbox') {
            vType = 'boolean';
        }
    }

    const getValue = () => {
        // @ts-ignore
        if (vType === 'boolean') return dom.checked;
        // @ts-ignore
        const v = dom.value;
        return vType === 'number' ? parseFloat(v) : v;
    };
    const setValue = (v: any) => {
        if (vType === 'boolean') {
            // @ts-ignore
            dom.checked = v;
            return;
        }
        // @ts-ignore
        dom.value = v;
    };
    let ignoreSub = false;
    const modStore = () => {
        ignoreSub = true;
        store[attr] = getValue();
        ignoreSub = false;
    };

    setValue(store.$get([ attr ]));
    dom.addEventListener('input', () => { modStore();});
    dom.addEventListener('change', () => { modStore();});
    store.$sub(attr, (v: any) => {if (!ignoreSub) setValue(v);});
}

