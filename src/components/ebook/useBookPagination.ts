import { useMemo } from "react";

interface Chapter {
  title: string;
  content: string;
}

export interface BookPage {
  chapterTitle?: string;
  isChapterStart: boolean;
  content: string;
  pageNumber: number;
}

const CHARS_PER_PAGE = 1200;

function splitHtmlIntoPages(html: string, charsPerPage: number): string[] {
  // Create a temporary element to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const pages: string[] = [];
  let currentPage = "";
  let currentLength = 0;

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (currentLength + text.length > charsPerPage && currentPage.trim()) {
        pages.push(currentPage);
        currentPage = "";
        currentLength = 0;
      }
      currentPage += text;
      currentLength += text.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const outerStart = `<${tag}${getAttributes(el)}>`;
      const outerEnd = `</${tag}>`;

      // Block elements that should force page break if near limit
      const isBlock = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "ul", "ol", "li", "div", "table", "tr"].includes(tag);

      if (isBlock && currentLength > charsPerPage * 0.85 && currentPage.trim()) {
        pages.push(currentPage);
        currentPage = "";
        currentLength = 0;
      }

      // Self-closing tags
      if (["br", "hr", "img"].includes(tag)) {
        if (tag === "img") {
          currentPage += el.outerHTML;
          currentLength += 100; // images take space
        } else {
          currentPage += el.outerHTML;
        }
        return;
      }

      currentPage += outerStart;
      for (const child of Array.from(node.childNodes)) {
        processNode(child);
      }
      currentPage += outerEnd;
    }
  }

  for (const child of Array.from(temp.childNodes)) {
    processNode(child);
  }

  if (currentPage.trim()) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [""];
}

function getAttributes(el: HTMLElement): string {
  let attrs = "";
  for (const attr of Array.from(el.attributes)) {
    attrs += ` ${attr.name}="${attr.value}"`;
  }
  return attrs;
}

export function useBookPagination(chapters: Chapter[]): BookPage[] {
  return useMemo(() => {
    if (!chapters || chapters.length === 0) return [];

    const allPages: BookPage[] = [];
    let pageNum = 1;

    for (const chapter of chapters) {
      const contentPages = splitHtmlIntoPages(chapter.content || "<p></p>", CHARS_PER_PAGE);

      contentPages.forEach((content, i) => {
        allPages.push({
          chapterTitle: chapter.title,
          isChapterStart: i === 0,
          content,
          pageNumber: pageNum++,
        });
      });
    }

    return allPages;
  }, [chapters]);
}
