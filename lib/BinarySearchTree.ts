import { BTreeNode } from "./BTreeNode.ts";

export interface FindDeepestResult {
  depth: number;
  values: number[];
}

export class BinarySearchTree {
  #root?: BTreeNode;

  constructor(values?: number[]) {
    if (values?.length) {
      this.insert(...values);
    }
  }

  /**
   * Read only reference to root node on the tree
   */
  get root(): BTreeNode | undefined {
    return this.#root;
  }

  /**
   * Insert value into the tree
   * (O(log n))
   * @param value numeric value to add
   */
  insert(...values: number[]): void {
    for (const value of values) {
      this.#insert(new BTreeNode(value));
    }
  }

  /**
   * Insert node into the tree
   * (O(log n))
   * @param newNode node to add
   */
  #insert(newNode: BTreeNode): void {
    if (!this.#root) {
      this.#root = newNode;
      return;
    }

    let curr = this.#root;

    while (curr) {
      if (curr.value === newNode.value) {
        // duplicate insert
        return;
      }
      if (curr.value > newNode.value) {
        if (!curr.left) {
          curr.left = newNode;
          return;
        }
        curr = curr.left;
      }
      if (curr.value < newNode.value) {
        if (!curr.right) {
          curr.right = newNode;
          return;
        }
        curr = curr.right;
      }
    }
  }

  /**
   * Remove a value from the tree
   * (O(log n))
   * @param value the value to remove
   */
  remove(value: number): void {
    if (!this.#root) return;
    this.#root = this.#remove(this.#root, value);
  }

  /**
   * Iteratively remove an item from the tree;
   */
  #remove(root: BTreeNode | undefined, value: number): BTreeNode | undefined {
    let curr = root;
    let prev: BTreeNode | undefined = undefined;

    while (curr && curr.value != value) {
      prev = curr;
      if (value < curr.value) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    if (!curr) {
      // no match found, return root as-is
      return root;
    }

    // node only has one child
    if (!curr.left || !curr.right) {
      let newNode: BTreeNode | undefined;

      // assign newnode to match
      if (!curr.left) {
        newNode = curr.right;
      } else {
        // no right side, assign to left
        newNode = curr.left;
      }

      // root match - replace with new node
      if (!prev) {
        return newNode;
      }

      if (curr === prev.left) {
        prev.left = newNode;
      } else {
        prev.right = newNode;
      }

      return root;
    }

    // node to be deleted has two children
    {
      let p: BTreeNode | undefined;
      let temp = curr.right;

      // get the in-order successor
      while (temp.left) {
        p = temp;
        temp = temp.left;
      }

      /**
       * check if the parent of the inorder
       * successor is the curr or not(i.e. curr=
       * the node which has the same data as
       * the given data by the user to be
       * deleted). if it isn't, then make the
       * the left child of its parent equal to
       * the inorder successor'd right child.
       */
      if (p) {
        p.left = temp.right;
      } else {
        /**
         * if the inorder successor was the
         * curr (i.e. curr = the node which has the
         * same data as the given data by the
         * user to be deleted), then make the
         * right child of the node to be
         * deleted equal to the right child of
         * the inorder successor.
         */
        curr.right = temp.right;
      }
      curr.value = temp.value;

      return root;
    }
  }

  /**
   * Iterative function for inorder tree traversal, no recursion
   * (O(n))
   */
  inorder(): number[] {
    const results: number[] = [];
    const stack: BTreeNode[] = [];
    let curr: BTreeNode | undefined = this.#root;

    // pushes the nodes to the left while traversing right
    // rolls up values and down left as it flows
    while (curr || stack.length) {
      // iterate to the left most node
      while (curr) {
        // place node on the top of the stack
        stack.unshift(curr);
        curr = curr.left;
      }

      // get the top of the stack (leftmost node), store value
      curr = stack.shift()!;
      results.push(curr.value);

      // we've gone as far to the left as we can, navigate right
      curr = curr.right;
    }

    return results;
  }

  /**
   * Iterative function for postorder tree traversal, no recursion
   * (O(n))
   */
  postorder(): number[] {
    const results: number[] = [];
    const stack: BTreeNode[] = [];
    let curr: BTreeNode | undefined = this.#root;

    // pushes the nodes to the right while traversing right
    // rolls up values and down left as it flows
    while (curr || stack.length) {
      // iterate to the right most node
      while (curr) {
        // push value to the top of the stack
        stack.unshift(curr);
        curr = curr.right;
      }

      // get value from top of the stack (rightmost node) - save value
      curr = stack.shift()!;
      results.push(curr.value);

      // we've gone as far to the right as we can, navigate left
      curr = curr.left;
    }

    return results;
  }

  /**
   * Find node with a given value
   * (O(log n))
   */
  find(value: number): BTreeNode | undefined {
    let curr = this.#root;
    let prev: BTreeNode | undefined = undefined;

    while (curr && curr.value != value) {
      prev = curr;
      if (value < curr.value) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    return curr || undefined;
  }

  /**
   * Finds the deepest node depth and values
   * (O(n))
   */
  findDeepest(): FindDeepestResult {
    // no result - return 0 level empty
    if (!this.#root) {
      return { depth: 0, values: [] };
    }

    // result
    let depth = 0;
    let values: number[] = [];

    // nodes to track through array of [depth, node]
    const search: [number, BTreeNode][] = [[0, this.#root]];

    // for each node
    while (search.length) {
      const [d, n] = search.shift()!;

      if (d > depth) {
        // if new depth - replace
        depth = d;
        values = [n.value];
      } else if (d === depth) {
        // match depth, add value
        values = values.concat(n.value);
      }

      // add left/right to search if present
      if (n.left) search.push([d + 1, n.left]);
      if (n.right) search.push([d + 1, n.right]);
    }

    return { depth, values: values.filter((v) => Number.isFinite(v)) };
  }
}
