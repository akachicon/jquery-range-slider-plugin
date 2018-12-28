let didMountQueue = [];

const mount = ($html, $parent) => {
  $parent.append($html);
};

export class Block {
  applyMod(modNames) {
    const names = Block.extractNames(modNames);

    this.$html.first().addClass(names);
    names.split(' ').forEach((mod) => {
      if (this[mod]) {
        this[mod].apply.call(this);
      }
    });
  }

  removeMod(modNames) {
    const names = Block.extractNames(modNames);

    this.$html.first().removeClass(names);
    names.split(' ').forEach((mod) => {
      if (this[mod]) {
        this[mod].remove.call(this);
      }
    });
  }

  static extractNames(modNames) {
    let names = modNames;

    if (modNames instanceof Array) {
      names = modNames.join(' ');
    }

    return names;
  }
}

export const createBlock = ({
  $parent,
  // eslint-disable-next-line no-shadow
  Block,
  args
}) => {
  // Mount after html initialization to ensure
  // that no nodes will accidentally be mounted
  // to the real DOM while others are not created.

  // When use createBlock inside another block
  // it's assumed that the parent (if exists) will
  // be chosen from the block html.

  let $blockHtml;
  let willBeAppendedToRealDom = false;

  if (!didMountQueue.length) {
    willBeAppendedToRealDom = true;
  }

  const setHtml = ($html) => {
    $blockHtml = $html;
  };
  const block = new Block(setHtml, args);

  if ($parent) {
    mount($blockHtml, $parent);
  }
  block.$parent = $parent;
  block.$html = $blockHtml;

  didMountQueue.push(block);

  if (willBeAppendedToRealDom) {
    didMountQueue.forEach((entity) => {
      if (entity.didMount) {
        entity.didMount();
      }
    });
    didMountQueue = [];
  }

  return block;
};

export const createElementFromBlock = ({
  block,
  Element,
  args
}) => {
  const element = new Element(block.$html, args);

  element.$html = block.$html;
  didMountQueue.push(element);

  return element;
};
