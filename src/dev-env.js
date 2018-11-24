import jQuery from 'jquery';
import style from './style.css';

const div = document.createElement('div');
document.body.appendChild(div);
div.classList.add(style.main);

jQuery('div').text('dev-env');
