/*
 * @Author: chenzhongsheng
 * @Date: 2024-11-14 21:08:11
 * @Description: Coding something;
 */

import {type IState, type IActions, type IStore, createStore} from './store/store';

export function createStorage<
    State extends IState & {$id?: string},
    Actions extends IActions<Omit<State, '$id'>, Actions>,
> (
    state: State,
    actions: Actions = {} as any,
): IStore<Omit<State, '$id'>, Actions> & {
    $clear: ()=>void;
} {

    const key = state.$id || '__storage_store';
    const str = localStorage.getItem(key);
    const save = () => {
        localStorage.setItem(key, JSON.stringify(state));
    };

    const clear = () => {
        localStorage.removeItem(key);
    };
    if (str) {
        try {
            state = JSON.parse(str);
        } catch (e) {
            clear();
        }
    }
    const keys = Object.keys(state);
    // @ts-ignore
    const store = createStore(state, actions);
    for (const key of keys) {
        store.$sub(key, () => {
            save();
        });
    }
    // @ts-ignore
    store.$clear = clear;
    // @ts-ignore
    return store;
}


