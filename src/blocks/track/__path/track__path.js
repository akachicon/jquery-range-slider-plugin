import { Modifiable } from '../../../bem';

export default class TrackFiller extends Modifiable {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('track__path');
  }
}
