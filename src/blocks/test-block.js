// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, createMixin } from '../bem';

export default class TestBlock {
  constructor(setHtml) {
    const $html = $('<div class="test-block">test block<div>test block inner html</div></div>');
    const childrenParent = $html.children().first();

    this._anotherTestBlock = createEntity({
      $parent: childrenParent,
      BlockName: AnotherTestBlock
    });
    this._mixin = createMixin({
      $parent: childrenParent,
      BlockName: AnotherTestBlock,
      ElementName: TestElement
    });

    setHtml($html);
  }
}

class AnotherTestBlock {
  constructor(setHtml) {
    const $html = $('<div class="another-test-block">test</div>');

    setHtml($html);
  }
}

class TestElement {
  constructor($html) {
    $html.addClass('test-element');
  }
}