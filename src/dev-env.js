import jQuery from 'jquery';
import './range-slider-plugin';
import style from './style.scss';

console.log(style);

const div = document.createElement('div');
document.body.appendChild(div);
div.classList.add('main');

jQuery('div').text('dev-env');
