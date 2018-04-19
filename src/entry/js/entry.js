import { util } from 'common/js/util.js'

console.log('entry');

var a = "this is common";

setTimeout(() => {
    alert("entry es6" + a);
    util.diyAlert();
}, 1000)