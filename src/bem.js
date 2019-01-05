let didMountQueue = [];

didMountQueue.idle = true;

const mount = ($html, $parent) => {
  $parent.append($html);
};

export class Modifiable {
  constructor() {
    this.appliedMods = [];
  }

  applyMod(modNames) {
    const names = Modifiable.extractNames(modNames);

    this.$html.addClass(names);
    names.split(' ').forEach((mod) => {
      if (this.hasMod(mod)) return;

      if (this[mod]) {
        this[mod].apply.call(this);
      }
      this.appliedMods.push(mod);
    });
  }

  removeMod(modNames) {
    const names = Modifiable.extractNames(modNames);
    const { appliedMods } = this;

    this.$html.removeClass(names);
    names.split(' ').forEach((mod) => {
      if (!this.hasMod(mod)) return;

      if (this[mod]) {
        this[mod].remove.call(this);
      }
      this.appliedMods = appliedMods
        .filter(applied => applied !== mod);
    });
  }

  hasMod(mod) {
    return this.appliedMods
      .some(applied => applied === mod);
  }

  static extractNames(modNames) {
    let names = modNames;

    if (modNames instanceof Array) {
      names = modNames.join(' ');
    }

    return names;
  }
}

export const createEntity = ({
  $parent,
  Entity,
  args
}) => {
  // Mount after html initialization to ensure
  // that no nodes will accidentally be mounted
  // to the real DOM while others are not created.

  // When use createEntity inside another entity
  // it's assumed that the parent (if exists) will
  // be chosen from the entity html.

  let $entityHtml;
  let willBeAppendedToRealDom = false;

  if (didMountQueue.idle) {
    willBeAppendedToRealDom = true;
    didMountQueue.idle = false;
  }

  const setHtml = ($html) => {
    $entityHtml = $html;
  };
  const entity = new Entity(setHtml, args);

  mount($entityHtml, $parent);
  entity.$html = $entityHtml;
  entity.$parent = $parent;
  didMountQueue.push(entity);

  if (willBeAppendedToRealDom) {
    didMountQueue.forEach((ent) => {
      if (ent.didMount) {
        ent.didMount();
      }
    });
    didMountQueue = [];
    didMountQueue.idle = true;
  }

  return entity;
};

export const addMix = ({
  entity,
  Mix,
  args
}) => {
  const mix = new Mix(entity.$html, args);

  mix.$html = entity.$html;
  mix.$parent = entity.$parent;
  didMountQueue.push(mix);

  return mix;
};
