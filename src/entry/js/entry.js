console.log('entry');
setTimeout(() => {
    alert("entry es6")
}, 1000)

const render = require('../layout/entry.art');
const data = {
    title: 'My Page'
};
const html = render(data);
console.log(html);

if (typeof document === 'object') {
    document.body.innerHTML = html;
}

module.exports = render;