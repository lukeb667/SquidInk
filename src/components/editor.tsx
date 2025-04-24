import React from "react";
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import { Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem } from "@heroui/react";
import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import { EditorContent, useEditor } from '@tiptap/react';
import FontFamily from '@tiptap/extension-font-family';
import Heading from '@tiptap/extension-heading';
import { JSX } from 'react';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { useTheme } from "@heroui/use-theme";
import { MdSave,
	MdFormatListBulleted,
	MdFormatAlignLeft,
	MdFormatAlignCenter,
	MdFormatAlignRight,
	MdInvertColorsOff,
	MdColorLens,
	MdOutlineFontDownload,
	MdFormatBold, 
	MdFileOpen} from "react-icons/md";
import { LuHeading1 } from "react-icons/lu";

import '@/styles/styles.css'

export const ChevronDownIcon = () => {
  return (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function RichTextEditor(): JSX.Element | null {
	const { theme } = useTheme();

	const editor = useEditor({
		extensions: [
			Document, Paragraph, Text, BulletList, OrderedList,
			ListItem, FontFamily, Bold, Heading, Color, TextStyle, 
			Heading,

			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		editorProps: {
			attributes: {
				class: "border border-white px-2 focus:outline-none h-screen text-white"
			}
		},
		content: `<p><span style="color: white">This is the new default text</span></p>`,
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

	const handleLoad = async () => {
		if (!editor) {
			return;
		}
		console.log("Not Implemented!")
	}

	const [selectedOption, setSelectedOption] = React.useState(new Set(["left"]));

	const labelsMap = {
	left: <MdFormatAlignLeft />,
	center: <MdFormatAlignCenter />,
	right: <MdFormatAlignRight />,
  };

	type AlignType = "left" | "center" | "right";
	const selectedOptionValue = Array.from(selectedOption)[0] as AlignType;

	const mainButtonRef = React.useRef<HTMLButtonElement>(null);
	
		return editor? (
		<div className={theme}>
			<div
				className={`${theme === "dark" ? "bg-black" : "bg-gray-500"} flex items-center p-1 sticky top-0 z-10 flex-wrap`}
				style={{ width: "100%" }} // Ensure buttons stay within the div
			>
				<input
					title= "Select a text color"
					type="color"
					onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
					value={editor.getAttributes('textStyle').color}
					data-testid="setColor"
					// className="flex-shrink w-6 h-6 m-2" // Allow shrinking and set initial size
					className="w-6 h-6 rounded-md cursor-pointer"
				/>

				<Button
					title= "Set font to Inter"
					color="default"
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md ${
						editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''
					}`}
					onPress={() => editor.chain().focus().setFontFamily('Inter').run()}
					data-test-id="inter"
					startContent={<MdOutlineFontDownload />}
					isIconOnly
					/>

				<Button
					title="Toggle bold"
					onPress={() => editor.chain().focus().toggleBold().run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md ${
						editor.isActive('bold') ? 'is-active' : ''
					}`}
					data-testid="toggleBold"
					startContent={<MdFormatBold />}
					isIconOnly
				/>

				<Button
					title="Set text color to red"
					onPress={() => editor.chain().focus().setColor('#F98181').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-red-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''
					}`}
					data-testid="setRed"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to orange"
					onPress={() => editor.chain().focus().setColor('#FBBC88').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-orange-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''
					}`}
					data-testid="setOrange"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to yellow"
					onPress={() => editor.chain().focus().setColor('#FAF594').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-yellow-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''
					}`}
					data-testid="setYellow"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to green"
					onPress={() => editor.chain().focus().setColor('#B9F18D').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-green-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''
					}`}
					data-testid="setGreen"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to teal"
					onPress={() => editor.chain().focus().setColor('#94FADB').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-teal-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''
					}`}
					data-testid="setTeal"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to blue"
					onPress={() => editor.chain().focus().setColor('#70CFF8').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-blue-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''
					}`}
					data-testid="setBlue"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to purple"
					onPress={() => editor.chain().focus().setColor('#958DF1').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center bg-purple-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''
					}`}
					data-testid="setPurple"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Reset text color"
					onPress={() => editor.chain().focus().unsetColor().run()}
					className="h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md"
					data-testid="unsetColor"
					startContent={<MdInvertColorsOff />}
					isIconOnly
				/>

				<div className="inline-flex m-[2px]">
					<Button 
						title= "Left align"
						ref={mainButtonRef}
						className="h-6 min-w-0 p-2 rounded-l-md rounded-r-none m-0 border-r-0"
					>
						{labelsMap[selectedOptionValue]}
					</Button>
					<Dropdown
						placement="bottom-start"
						offset={0}
						shouldFlip={false}
						portalContainer={document.body}
					>
						<DropdownTrigger>
							<Button 
								title= "Choose a text alignment"
								isIconOnly 
								className="h-6 !w-6 min-w-0 p-0 rounded-r-md rounded-l-none m-0 border-l-0"
							>
								<ChevronDownIcon />
							</Button>
						</DropdownTrigger>
						<DropdownMenu
						disallowEmptySelection
						aria-label="Align Text"
						className={`max-w-[300px] text-white ${theme === "dark" ? "bg-gray-900" : "bg-gray-700"} rounded-lg`}
						selectedKeys={selectedOption}
						selectionMode="single"
						onSelectionChange={(keys) => {
						if (keys instanceof Set) {
							setSelectedOption(new Set(keys as Set<string>));
							// Set text alignment based on selection
							const alignment = Array.from(keys)[0] as AlignType;
							editor.chain().focus().setTextAlign(alignment).run();
						}
						}}
						>
							<DropdownItem key="left" className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-600"}`}>
								{labelsMap["left"]}
							</DropdownItem>
							<DropdownItem key="center" className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-600"}`}>
								{labelsMap["center"]}
							</DropdownItem>
							<DropdownItem key="right" className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-600"}`}>
								{labelsMap["right"]}
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					</div>

				<Button
					title="Toggle heading"
					onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md ${
						editor.isActive({ level: 1 }) ? 'is-active' : ''
					}`}
					data-testid="toggleHeading"
					startContent={<LuHeading1 />}
					isIconOnly
				/>

				<Button
					title="Toggle bulleted list"
					onPress={() => editor.chain().focus().toggleBulletList().run()}
					className={`h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md ${
						editor.isActive('bulletList') ? 'is-active' : ''
					}`}
					data-testid="toggleBulletList"
					startContent={<MdFormatListBulleted />}
					isIconOnly
				/>

				<Button
					title="Save"
					onPress={handleSave}
					className="h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md"
					startContent={<MdSave />}
					isIconOnly
				/>

				<Button
					title="Open a file (Not currently functional)"
					onPress={handleLoad}
					className="h-6 !w-6 m-[2px] min-w-0 p-0 justify-center rounded-md"
					startContent={<MdFileOpen />}
					isIconOnly
				/>

			</div>

			<div className="flex-1 overflow-auto pt-5 pb-2">
				<EditorContent
					className="prose w-full h-full overflow-auto marker:text-inherit"
					editor={editor}
				/>
			</div>
		</div>
	) : null;
}
