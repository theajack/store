/*
 * @Author: chenzhongsheng
 * @Date: 2024-11-15 11:38:19
 * @Description: Coding something
 */
import {watchPure} from './watch';

const ComputedMark = Symbol('com');

export function computed<T> (get: ()=>T, set?: (v: T)=>void) {

    let _dirty = false;
    let _value = watchPure(get, () => {_dirty = true;});
    return {
        [ComputedMark]: true,
        get value () {
            if (_dirty) {
                _value = get();
                _dirty = false;
            }
            return _value;
        },
        set value (v: T) {
            if (!set) {
                console.warn('set 未定义');
                return;
            }
            set(v);
        },
        __get: get,
    };

}

export type IComputed = ReturnType<typeof computed>;

export function isComputed (target: any) {
    return !!target?.[ComputedMark];
}