import {isComputed} from './computed';
import {GlobalStoreUseHistory} from './history';
import {isJoin, watchJoin} from './join';
import type {IStoreDef} from './store';

export let watchFn: any = null;

export type IWatchTarget = any;

/*
1. store.attr : 直接对属性进行监听
2. () => store.attr+1 : 表达式需要用函数包裹
3. computed : 直接对computed监听
4. join`head_${store.attr}_tail`
*/
function watchBase (target: IWatchTarget, change: (v: any, prev: any)=>void, pure?: boolean): any {
    let prev: any;
    if (isComputed(target)) {
        target = target.__get;
    }
    if (typeof target === 'function') {
        watchFn = (store: IStoreDef, attr: string) => {
            console.log('watch fn');
            store.$sub(attr, () => {
                if (pure) change(prev, prev);
                else {
                    const cur = target();
                    change(cur, prev);
                    prev = cur;
                }
            });
        };
        const v = target();
        watchFn = null;
        prev = v;
        return v;
    } else if (isJoin(target)) {
        return watchJoin(target, change);
    } else {
        const {store, attr} = GlobalStoreUseHistory.latest;
        store.$sub(attr, (v: any) => {
            change(v, prev);
            prev = v;
        });
        prev = target;
        return target;
    }
}

export function watch (target: IWatchTarget, change: (v: any, prev: any)=>void): any {
    return watchBase(target, change, false);
}

export function watchImme (target: IWatchTarget, change: (v: any, prev: any)=>void): any {
    const v = watchBase(target, change);
    change(v, undefined);
    return v;
}

export function watchPure (target: IWatchTarget, change: ()=>void): any {
    return watchBase(target, change, true);
}