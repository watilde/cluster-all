const assert = require('assert')
const clusterAll = require('./')
const fixture = ['one', 'two', 'three', 'four', 'five']

var promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'one');
});

var promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 200, 'two');
});

var promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 300, 'three');
});

var promise4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 400, 'four');
});
var promise5 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'five');
});

clusterAll([promise1, promise2, promise3, promise4, promise5], (e, values) => {
  assert(e === null)
  assert(JSON.stringify(values) === JSON.stringify(fixture))
})
