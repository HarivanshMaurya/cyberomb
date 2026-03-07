

## Plan: Add Chapter Content Editor to eBook Form

### Overview
Add a new "Chapter Content Editor" section below Table of Contents in the existing ProductsManager form. Each chapter has a title + rich text content using the existing RichTextEditor component. Chapters stored as JSONB in a new `chapters` column on the `products` table.

### Database Change
- Add `chapters` column (JSONB, default `'[]'`) to `products` table via migration

### Data Structure
```json
[
  { "title": "Chapter 1 Title", "content": "<p>Rich text HTML...</p>" },
  { "title": "Chapter 2 Title", "content": "<p>...</p>" }
]
```

### Code Changes

1. **`src/hooks/useProducts.ts`** — Add `chapters: { title: string; content: string }[]` to the `Product` interface

2. **`src/pages/admin/ProductsManager.tsx`**:
   - Add `chapters` to `emptyForm` (default `[]`)
   - Add `chapters` to `openEdit` mapping
   - Add new "Chapter Content Editor" section after Table of Contents:
     - "Add Chapter" button creates a new entry with empty title/content
     - Each chapter block shows: chapter number, title input, RichTextEditor for content, remove button
     - Collapsible/accordion style so multiple chapters don't overwhelm the form
   - Import `RichTextEditor` and `Accordion` components

3. **No changes** to existing fields (Title, Author, Slug, etc.) or Table of Contents section

### UI Layout (inside dialog, after ToC section)
```text
┌─────────────────────────────────┐
│ Chapter Content Editor          │
│ [+ Add Chapter]                 │
│                                 │
│ ▸ Chapter 1: "Introduction"    │
│   Title: [_______________]      │
│   Content: [Rich Text Editor]   │
│   [Remove]                      │
│                                 │
│ ▸ Chapter 2: "Getting Started" │
│   ...                           │
└─────────────────────────────────┘
```

### Technical Notes
- Reuses existing `RichTextEditor` component (Tiptap-based, supports headings, bold/italic, lists, images)
- Uses Radix Accordion for collapsible chapters to keep form manageable
- All existing fields remain untouched
- Chapters data flows through the same create/update mutation pipeline as other product fields

