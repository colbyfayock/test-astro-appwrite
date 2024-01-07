import { useState, useRef } from 'react';
import type { Editor as TiptapEditor, JSONContent } from '@tiptap/core';
import { ID, Query } from 'appwrite';
import slugify from 'slugify';

import { databases } from '@/lib/appwrite';

import Button from '@/components/Button.tsx';
import Editor from '@/components/Editor.js';

const NewPost = () => {
  const slugRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<string>();

  function handleOnContentUpdate(editor?: TiptapEditor) {
    if ( !editor ) return;
    setContent(editor.getHTML());
  }

  async function handleOnTitleBlur(event: React.SyntheticEvent<HTMLInputElement>) {
    const target = event.target as typeof event.target & {
      value: string;
    }
    const value = target.value;

    if ( value && slugRef.current && !slugRef.current.value ) {
      slugRef.current.value = slugify(value, {
        lower: true,
        strict: true
      })
    }
  }

  async function handleOnSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      title: { value: string };
      slug: { value: string };
      excerpt: { value: string };
    }

    const { documents } = await databases.listDocuments(
      import.meta.env.PUBLIC_APPWRITE_DATABASE_ID,
      import.meta.env.PUBLIC_APPWRITE_COLLECTION_ID,
      [Query.equal('slug', target.slug.value)]
    );

    if ( !documents[0] ) {
      const results = await databases.createDocument(
        import.meta.env.PUBLIC_APPWRITE_DATABASE_ID,
        import.meta.env.PUBLIC_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          title: target.title.value,
          slug: target.slug.value,
          excerpt: target.excerpt.value,
          content
        }
      );

      window.location.href = `/posts/${results.slug}`;
    } else {
      alert('Oops, that slug already exists!');
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" htmlFor="title">Title</label>
        <input
          id="title"
          className="block w-full text-slate-900 border-slate-400 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          name="title"
          onBlur={handleOnTitleBlur}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" htmlFor="slug">Slug</label>
        <input
          ref={slugRef}
          id="slug"
          className="block w-full text-slate-900 border-slate-400 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          name="slug"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Content</label>
        <Editor onDebouncedUpdate={handleOnContentUpdate} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" htmlFor="excerpt">Excerpt</label>
        <input
          id="excerpt"
          className="block w-full text-slate-900 border-slate-400 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          name="excerpt"
        />
      </div>
      <Button>Submit</Button>
    </form>
  );
}

export default NewPost;