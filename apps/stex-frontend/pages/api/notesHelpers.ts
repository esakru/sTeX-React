import axios from 'axios';
import { textContent } from 'domutils';
import * as htmlparser2 from 'htmlparser2';
import NOTES_TREES, { TreeNode } from '../../notes-trees.preval';
import { AI_1_DECK_IDS } from '../../course_info/ai-1-notes';
import { FileLocation, fileLocToString, stringToFileLoc } from '@stex-react/utils';

export const AI_ROOT_NODE = fixCourseRootNode('ai-1');
export const IWGS_ROOT_NODE = fixCourseRootNode('iwgs');
export const LBS_ROOT_NODE = fixCourseRootNode('lbs');
export const KRMT_ROOT_NODE = fixCourseRootNode('krmt');

const SLIDE_DOC_CACHE = new Map<string, string>();
export async function getFileContent(
  nodeId: FileLocation,
  mmtUrl: string
): Promise<string> {
  const url = `${mmtUrl}/:sTeX/document?archive=${nodeId.archive}&filepath=${nodeId.filepath}`;
  if (SLIDE_DOC_CACHE.has(url)) return SLIDE_DOC_CACHE.get(url);
  console.log('Fetching ' + url);
  const resp = await axios.get(url);
  SLIDE_DOC_CACHE.set(url, resp.data);
  return resp.data;
}

function fixTree(node: TreeNode) {
  const v = fileLocToString(node);
  if (AI_1_DECK_IDS.includes(v)) {
    node.endsSection = true;
  }
  for (const c of node.children) {
    c.parent = node;
    fixTree(c);
  }
}

function fixCourseRootNode(courseId: string) {
  const root: TreeNode = NOTES_TREES[courseId];
  fixTree(root);
  return root;
}

export function getCourseRootNode(courseId: string) {
  switch (courseId) {
    case 'ai-1':
      return AI_ROOT_NODE;
    case 'iwgs':
      return IWGS_ROOT_NODE;
    case 'lbs':
      return LBS_ROOT_NODE;
    case 'krmt':
      return KRMT_ROOT_NODE;
  }
  return undefined;
}

export function findNode(nodeId: FileLocation, tree: TreeNode): TreeNode | null {
  if (!nodeId) return null;
  if (nodeId.archive === tree.archive && nodeId.filepath === tree.filepath)
    return tree;
  for (const child of tree.children) {
    const loc = findNode(nodeId, child);
    if (loc) return loc;
  }
  return null;
}

function lastDescendent(node: TreeNode): TreeNode {
  if (node.children?.length) {
    return lastDescendent(node.children[node.children.length - 1]);
  }
  return node;
}

export function previousNode(node: TreeNode): TreeNode {
  if (!node?.parent) return undefined;
  while (node) {
    const parent = node.parent;

    let previousSibling = undefined as TreeNode;
    for (const c of parent.children) {
      if (c == node) break;
      previousSibling = c;
    }
    if (previousSibling) return previousSibling;

    node = node.parent;
  }
  return undefined;
}

export function nextNode(node: TreeNode): TreeNode {
  if (node.children?.length > 0) return node.children[0];
  if (!node?.parent) return undefined;
  while (node) {
    const parent = node.parent;
    let found = false;
    for (const c of parent.children) {
      if (found) return c;
      if (c == node) found = true;
    }
    if (!found) {
      console.log('nooooooooooooo');
      return;
    }
    node = node.parent;
  }
  return undefined;
}

export function getText(html: string) {
  const handler = new htmlparser2.DomHandler();
  const parser = new htmlparser2.Parser(handler);

  parser.write(html);
  parser.end();
  const nodes: any = handler.root.childNodes.filter(
    (n: any) => !n.attribs?.['style']?.includes('display:none')
  );
  return textContent(nodes);
}

export function getTitle(deckId: string) {
  if (!deckId) return 'Error';
  const nodeId = stringToFileLoc(deckId);
  let node = nodeId ? findNode(nodeId, AI_ROOT_NODE) : AI_ROOT_NODE;
  while (node) {
    if (node.titleAsHtml?.length) {
      const text = getText(node.titleAsHtml);
      if (text.trim().length) return node.titleAsHtml;
    }
    node = nextNode(node);
  }
  return 'Unknown';
}
