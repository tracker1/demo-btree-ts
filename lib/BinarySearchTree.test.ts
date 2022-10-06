import { assertEquals } from "../deps.ts";
import { BinarySearchTree } from "./BinarySearchTree.ts";

Deno.test("findDepth 1", () => {
  const bst = new BinarySearchTree();
  bst.insert(12);
  bst.insert(11);
  bst.insert(90);
  bst.insert(82);
  bst.insert(7);
  bst.insert(9);
  const r = bst.findDeepest();

  assertEquals(r.depth, 3);
  assertEquals(r.values, [9]);
  assertEquals(bst.inorder(), [7, 9, 11, 12, 82, 90]);
  assertEquals(bst.postorder(), [90, 82, 12, 11, 9, 7]);
});

Deno.test("findDepth 2", () => {
  const bst = new BinarySearchTree();
  bst.insert(26);
  bst.insert(82);
  bst.insert(16);
  bst.insert(92);
  bst.insert(33);
  const r = bst.findDeepest();

  assertEquals(r.depth, 2);
  assertEquals(r.values, [33, 92]);
  assertEquals(bst.inorder(), [16, 26, 33, 82, 92]);
  assertEquals(bst.postorder(), [92, 82, 33, 26, 16]);
});

Deno.test("remove 1", () => {
  // build from initial array - with duplicate
  const bst = new BinarySearchTree([26, 82, 16, 92, 33, 33]);
  bst.remove(33);
  assertEquals(bst.inorder(), [16, 26, 82, 92]);
});
