import '../src/styles/styles.css'

import Document    from '@tiptap/extension-document'
import Paragraph   from '@tiptap/extension-paragraph'
import FontFamily  from '@tiptap/extension-font-family'
import ListItem    from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList  from '@tiptap/extension-bullet-list'
import Bold        from '@tiptap/extension-bold'
import Text        from '@tiptap/extension-text'
import TextAlign   from '@tiptap/extension-text-align'
import Heading     from '@tiptap/extension-heading'
import { Color }   from '@tiptap/extension-color'
import TextStyle   from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'

// import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, BulletList, OrderedList, ListItem, FontFamily, Bold, Heading, Color, TextStyle, Heading,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),],
    content: `
        <p><span style="color: #958DF1">Oh, for some reason that’s purple.</span></p>
      `,
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <input
            type="color"
            onInput={event => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
          />

          <button
            onClick={() => editor.chain().focus().setFontFamily('Inter').run()}
            className={editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}
            data-test-id="inter"
          >
            Inter
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            data-testid="setPurple"
          >
            B
          </button>

          <button
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            data-testid="setPurple"
          >
            Purple
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#F98181').run()}
            className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
            data-testid="setRed"
          >
            Red
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#FBBC88').run()}
            className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
            data-testid="setOrange"
          >
            Orange
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#FAF594').run()}
            className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
            data-testid="setYellow"
          >
            Yellow
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#70CFF8').run()}
            className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
            data-testid="setBlue"
          >
            Blue
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#94FADB').run()}
            className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
            data-testid="setTeal"
          >
            Teal
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#B9F18D').run()}
            className={editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''}
            data-testid="setGreen"
          >
            Green
          </button>
          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
            data-testid="unsetColor"
          >
            Unset color
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            Left Align
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive({ level: 1 }) ? 'is-active' : ''}
          >
            Toggle H1
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            Toggle bullet list
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            Save
          </button>

        </div>
      </div>

      <EditorContent editor={editor} />
    </>
  )
}



