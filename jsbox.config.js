/*
 * @Author: chenzhongsheng
 * @Date: 2025-02-05 22:26:34
 * @Description: Coding something
 */
window.jsboxCodeMap = {
    "libs": {
        "tc-store": "https://cdn.jsdelivr.net/npm/tc-store"
    },
    "iifeMap": {
        "tc-store": "TCStore"
    },
    "codes": {
        "Basic Use": {
            "dep": [
                "tc-store"
            ],
            "desc": "Basic usage of tc-store",
            "code": "<button id=\"button\">Increase a</button>\n<script>\n    import { createStore, computed, watch, join, raw, watchPure, watchImme } from 'tc-store';\n    const store = createStore({\n        a: 1,\n        b: 'test',\n    });\n    $('#button').onclick = ()=>{\n        store.a ++;\n    }\n    const computed1 = computed(() => {\n        return store.a + store.b;\n    });\n    watch(store.a, (v, p) => {\n        console.log(`a change: cur=${v}; prev=${p}`);\n    });\n    watch(computed1, (v, p) => {\n        console.log(`computed1 change: cur=${v}; prev=${p}`);\n    });\n    watch(() => store.a + 1, (v, p) => {\n        console.log(`store.a + 1 change: cur=${v}; prev=${p}`);\n    });\n    watch(join`hello ${store.b} ${raw(1)} ${store.a}`, (v, p) => {\n        console.log(`join change: cur=${v}; prev=${p}`);\n    });\n    watchPure(() => store.a + 1, () => {\n        console.log(`store.a + 1 pure change`);\n    });\n    watchImme(() => store.a + 1, (v, p) => {\n        console.log(`store.a + 1 imme change: cur=${v}; prev=${p}`);\n    });\n</script>",
            "lang": "html"
        },
        "Storage": {
            "dep": [
                "tc-store"
            ],
            "hideLog": true,
            "desc": "Persist storage",
            "code": "<button id=\"button\">Rerun</button>\n<div id=\"content\"></div>\n<script>\n    import { createStorage } from 'tc-store';\n    const store = createStorage({\n        a: 1,\n        b: 'test',\n    });\n    store.a ++; \n    store.b += '!'; \n    $('#button').onclick = $run;\n    $('#content').innerText = `a = ${store.a}; b=${store.b}`;\n</script>",
            "lang": "html"
        },
        "Dom Binding": {
            "dep": [
                "tc-store"
            ],
            "hideLog": true,
            "desc": "Dom binding usage",
            "code": "<div id=\"content\"></div>\n<input id=\"input\"/>\n<button id=\"button\">Add '!'</button>\n<script>\n    import { createStore, bind, watchImme} from 'tc-store';\n    const store = createStore({\n        content: 'test',\n    });\n    watchImme(store.content, (v) => {\n        $('#content').innerText = v;\n    });\n    bind($('#input'), store.content); // This results in a two-way binding\n    $('#button').onclick = () => {\n        store.content += '!';\n    }\n</script>",
            "lang": "html"
        }
    }
}