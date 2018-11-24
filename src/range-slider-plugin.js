// eslint-disable-next-line
import jQuery from 'jquery';
import style from './style.css';

const div = document.createElement('div');
document.body.appendChild(div);
div.classList.add(style.main);

async function hello(promise) {
  const result = await promise;

  return result;
}

hello('');

jQuery('div').text('plugin');

console.log('plugin');
