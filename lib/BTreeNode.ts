/**
 * Basic Node of BTree.
 * Keep reference to their children and values.
 * Keep a reference to the parent and tree.
 */
export class BTreeNode {
  value: number;
  left?: BTreeNode;
  right?: BTreeNode;

  constructor(value: number) {
    this.value = value;
  }

  get hasChildren(): boolean {
    return !!(this.left || this.right);
  }

  get isLeaf(): boolean {
    return !(this.left || this.right);
  }
}
