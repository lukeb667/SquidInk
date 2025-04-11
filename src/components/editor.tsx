import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import { Button } from "@heroui/Button";
import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import { EditorContent, useEditor } from '@tiptap/react';
import FontFamily from '@tiptap/extension-font-family';
import Heading from '@tiptap/extension-heading';
import { IpcMainInvokeEvent } from "electron";
import { JSX } from 'react';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { useTheme } from "@heroui/use-theme";

import '@/styles/styles.css'

export default function RichTextEditor(): JSX.Element | null {
	const { theme } = useTheme();

	const editor = useEditor({
		extensions: [
			Document, Paragraph, Text, BulletList, OrderedList,
			ListItem, FontFamily, Bold, Heading, Color, TextStyle, Heading,

			TextAlign.configure({
				types: ['heading', 'paragraph']
			})
		],
		editorProps: {
			attributes: {
				class: "border border-white px-2 focus:outline-none h-screen"
			}
		},
		content: `<p><span style="color: #958DF1">Oh, for some reason that\'s purple.</span></p>`,
	});

	const handleSave = async () => {
		if (!editor) {
			return;
		}

		const { content } = editor.getJSON();
		const json = JSON.stringify(content, null, 2);

		const filePath = await window.ipcRenderer.invoke("saveFile", json);
		console.log(`Saved file to ${filePath}`);
	}

	return editor? (
		<div className={theme}>
			<div className={`${theme === "dark"? "bg-black" : "bg-gray-500"} flex flex-wrap justify-center items-center gap-2 p-2 sticky top-0 z-10`}>
					<input
						type="color"
						onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
						value={editor.getAttributes('textStyle').color}
						data-testid="setColor"
					/>

					<Button
						color="default"
						className={`${editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}`}
						onPress={() => editor.chain().focus().setFontFamily('Inter').run()}
						data-test-id="inter"
					>
						Inter
					</Button>

					<Button
						onPress={() => editor.chain().focus().toggleBold().run()}
						className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
						data-testid="setPurple"
					>
						B
					</Button>

					<Button
						onPress={() => editor.chain().focus().setColor('#958DF1').run()}
						className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
						data-testid="setPurple"
					>
						Purple
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#F98181').run()}
						className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
						data-testid="setRed"
					>
						Red
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#FBBC88').run()}
						className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
						data-testid="setOrange"
					>
						Orange
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#FAF594').run()}
						className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
						data-testid="setYellow"
					>
						Yellow
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#70CFF8').run()}
						className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
						data-testid="setBlue"
					>
						Blue
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#94FADB').run()}
						className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
						data-testid="setTeal"
					>
						Teal
					</Button>
					<Button
						onPress={() => editor.chain().focus().setColor('#B9F18D').run()}
						className={editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''}
						data-testid="setGreen"
					>
						Green
					</Button>
					<Button
						onPress={() => editor.chain().focus().unsetColor().run()}
						data-testid="unsetColor"
					>
						Unset color
					</Button>

					<Button
						onPress={() => editor.chain().focus().setTextAlign('left').run()}
						className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
					>
						Left Align
					</Button>

					<Button
						onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						className={editor.isActive({ level: 1 }) ? 'is-active' : ''}
					>
						Toggle H1
					</Button>

					<Button
						onPress={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive('bulletList') ? 'is-active' : ''}
					>
						Toggle bullet list
					</Button>

					<Button
						onPress={handleSave}
						className={editor.isActive('bulletList') ? 'is-active' : ''}
					>
						Save
					</Button>
			</div>

			<div className="flex-1 overflow-auto px-[20%] pt-5 pb-2">
				<EditorContent
					className="w-full h-full overflow-scroll"
					editor={editor}
				/>
			</div>
		</div>
	) : null;
}
