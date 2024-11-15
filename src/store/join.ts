/*
 * @Author: chenzhongsheng
 * @Date: 2024-08-09 14:50:37
 * @Description: Coding something
 */

import {GlobalStoreUseHistory} from './history';

const RawMark = Symbol('raw');
const JoinMark = Symbol('join');

export function raw (v: any) {
    return {[RawMark]: true, value: v};
}

export interface IReactive {
    value: any;
    reacts: any[],
    [JoinMark]?: boolean,
}

export function isJoin (target: any) {
    return !!target?.[JoinMark];
}

export function join (tpl: TemplateStringsArray|any, ...args: any[]): IReactive {

    if (args.length === 0) {
        // react(store.count)
        return {
            value: tpl,
            reacts: [ GlobalStoreUseHistory.latest ],
            [JoinMark]: true,
        };
    } else {
        let value = tpl[tpl.length - 1];
        let index = 1;
        const reacts = [ value ] as any[];
        for (let i = args.length - 1; i >= 0; i--) {

            let arg = args[i];

            if (arg?.[RawMark]) {
                arg = arg.value;
                reacts.unshift(arg);
            } else {
                const data = GlobalStoreUseHistory.getHistory(index);
                reacts.unshift(data);
                index ++;
            }

            reacts.unshift(tpl[i]);

            value = `${tpl[i]}${arg}${value}`;
        }
        return {
            value,
            reacts,
            [JoinMark]: true,
        };
    }
}

export function watchJoin (v: any, apply: (v:any, prev: any)=>void) {
    let prev: any;
    if (v?.[JoinMark]) {
        const {value, reacts} = v;

        reacts.forEach((item: any) => {
            if (isReactHistory(item)) {
                item.store.$sub(item.attr, () => {
                    const cur = concatReactsValues(reacts);
                    apply(cur, prev);
                    prev = cur;
                });
            }
        });
        prev = value;
        return value;
    } else {
        return v;
    }
}

function concatReactsValues (reacts: any[]): any {
    if (reacts.length === 1) {
        const {store, attr} = reacts[0];
        return store.$get(attr);
    } else {
        return reacts.map(item => {
            if (isReactHistory(item)) {
                return item.store.$get(item.attr);
            }
            return item;
        }).join('');
    }
}

function isReactHistory (item: any) {
    return typeof item === 'object' && !!item?.store.$unsub;
}

// window.react = react;

// let a = 1;

// react`a=${raw(1)},count=${store.count}`;