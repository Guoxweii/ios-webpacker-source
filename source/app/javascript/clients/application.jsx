import 'react-fastclick';

import _ from 'lodash';
import $ from 'jquery';

import 'bootstrap-sass/assets/javascripts/bootstrap';

import './javascript-bridge-v4-adaptor';
import './javascript-bridge-debug';

import './unit-text-page';
import './repeat-text-page';
import './reference-page';

import './client.scss';
import './article.scss';

window._ = _;
window.$ = $;
