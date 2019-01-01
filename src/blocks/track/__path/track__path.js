import { Modifiable } from '../../../bem';

export default class TrackFiller extends Modifiable {
  constructor($entityHtml) {
    super();

    $entityHtml.addClass('track__path');
  }
}
