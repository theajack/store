/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-07 19:40:43
 * @Description: Coding something
 */

import {GlobalStoreUseHistory} from './history';
import {watchFn} from './watch';

export type IState = Record<string, any>;

export type IActions<State extends IState, Actions extends IActions<State, Actions>> = {
  [prop in string]: (this: IStore<State, Actions> & Actions, ...args: any[]) => any;
}

export type IStore<
  State extends IState,
  Actions extends IActions<State, Actions>,
  Key extends keyof State = keyof State,
> = {
  [prop in keyof State]: State[prop];
} & {
  [prop in keyof Actions]: Actions[prop];
} & {
  $sub: (key: Key, ln: (v: State[Key], prev: State[Key]) => void) => (()=>void);
  $unsub: (key: Key, ln?: (v: State[Key], prev: State[Key]) => void) => void;
//   $bind: <Keys extends Key[]>(keys: Keys, ln: (...args: State[Keys[number]][]) => void) => void;
};

export type IStoreDef = IStore<any, any>;
// set: <Prop extends keyof State>(key: Prop, value: State[Prop][0]) => void;


export function createStore<
  State extends IState,
  Actions extends IActions<State, Actions>
> (
    state: State,
    actions: Actions = {} as any,
): IStore<State, Actions> {
    const subMap: any = {};
    // @ts-ignore
    const result: IStore<State, Actions> = {
        $sub (k: any, ln: any) {
            if (!subMap[k]) subMap[k] = [];
            subMap[k].push(ln);
            return () => {result.$unsub(k, ln);};
        },
        $unsub (k: any, ln?: any) {
            if (!subMap[k]) return;
            if (typeof ln === 'undefined') {
                delete subMap[k];
                return;
            }
            const index = subMap[k].indexOf(ln);
            if (index === -1) return;
            subMap[k].splice(index, 1);
        },
        $get (attr: string) {
            return state[attr];
        },
    };

    const objMap: any = {};
    for (const k in state) {
        const value = state[k];
        objMap[k] = {
            get () {
                watchFn?.(result, k);
                GlobalStoreUseHistory.addUse(result, k);
                return state[k];
            },
            set (v: any) {
                const origin = state[k];
                state[k] = v;
                subMap[k]?.forEach((fn: any) => {fn(v, origin);});
            }
        };
        // @ts-ignore
        result[k] = value;
    }

    Object.defineProperties(result, objMap);

    for (const k in actions) {
        // @ts-ignore
        result[k] = (...args: any[]) => {
            return actions[k].apply(result, args);
        };
    }
    return result;
};

