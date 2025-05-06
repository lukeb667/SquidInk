import React from "react";
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import { Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
	Drawer,
	DrawerContent,
	DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
	Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
	Form,
	Input,
	DatePicker,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
} from "@heroui/react";
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
import {DateValue, getLocalTimeZone, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

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

// Use Luke's task class
type Task = {
	id: number;
	text: string;
	date: DateValue;
	completed: boolean;
  	details?: string;
	softDate?: DateValue;
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

		try {
			// Invoke the IPC renderer to open a file dialog and get the file content
			const fileContent = await window.ipcRenderer.invoke("loadFile");

			if (fileContent) {
				// Parse the JSON content and set it in the editor
				const content = JSON.parse(fileContent);
				editor.commands.setContent( content );
			}
		} catch (error) {
			console.error("Error loading file:", error);
		}
	};

	const [selectedOption, setSelectedOption] = React.useState(new Set(["left"]));

	const labelsMap = {
	left: <MdFormatAlignLeft />,
	center: <MdFormatAlignCenter />,
	right: <MdFormatAlignRight />,
  };

	type AlignType = "left" | "center" | "right";
	const selectedOptionValue = Array.from(selectedOption)[0] as AlignType;

	const mainButtonRef = React.useRef<HTMLButtonElement>(null);

	// Handle drawer open/close
	const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure();

	// Handle modal open/close
	const { isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange } = useDisclosure();

	// task array
	const [tasks, setTasks] = React.useState<Task[]>([]);

	const addTask = (name: string, date: DateValue, _details: string, softDate: DateValue) => {
		const task: Task = {
			id: Date.now(),
			text: name,
			date: date,
			completed: false,
			details: taskDetails.trim() || undefined,
			softDate: softDate || undefined
		}

		setTasks([...tasks, task]);
	}

	const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

	const toggleTask = (id: number) => {
		const index = tasks.findIndex(task => task.id === id);
		const task = tasks[index];

		console.log(task);
		console.log(index);

		if (!task) {
			return;
		}

		task.completed = !task.completed;
		const newTasks = tasks;
		newTasks[index] = task;

		console.log(newTasks);
		setTasks([...newTasks]);

		console.log(tasks.find(task => task.id === id)!.completed);
	}

	// state variables for inputs
	const [taskName, setTaskName] = React.useState<string>("");
  	const [taskDetails, setTaskDetails] = React.useState<string>("");
	const [taskDate, setTaskDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	const [taskSoftDate, setTaskSoftDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));

	let formatter = useDateFormatter({dateStyle: "full"});

		return editor? (
		<>
			<Drawer isOpen={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
				<DrawerContent>
					{(onDrawerClose) => (
						<>
							<DrawerHeader className="flex items-center justify-between">
								Tasks
							</DrawerHeader>
							<DrawerBody>
								<div className="flex flex-col gap-y-2">
									{
										tasks.map((task, index) => {
											return (
												<Card key={index} className="rounded-md">
												<CardHeader className="text-2xl">
													{task.completed ? <s className="text-gray-400">{task.text}</s> : task.text}
												</CardHeader>
												<Divider />
												<CardBody>
													<div>
														{task.date ? formatter.format(task.date.toDate(getLocalTimeZone())) : "--"}
													</div>
													<Divider />
													{( task.details && (
														<>
														<div>
															{task.details}
														</div>
														</>
													))}
													<Divider />
													<div>
														{task.softDate ? formatter.format(task.softDate.toDate(getLocalTimeZone())) : "--"}
													</div>
												</CardBody>

												<CardFooter>
													<div className="flex gap-x-2">
													<Button
														variant="ghost"
														onPress={() => toggleTask(task.id)}
														color="success"
														className="h-6 w-16 rounded-md">
														{task.completed ? "Reset" : "Finish"}
													</Button>
													<Button
														variant="ghost"
														onPress={() => deleteTask(task.id)}
														color="danger"
														className="h-6 w-12 rounded-md">
														Delete
													</Button>
													</div>
												</CardFooter>
												</Card>
											)
										}
									)}
								</div>
							</DrawerBody>
							<DrawerFooter>
								<Button variant="ghost" onPress={onModalOpen} color="success">
									New Task
								</Button>
								<Button variant="ghost" onPress={onDrawerClose} color="danger">
									Close
								</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>

			<Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange} backdrop="blur" isDismissable={false}>
				<ModalContent>
					{(onModalClose) => (
						<>
							<ModalHeader>Add New Task</ModalHeader>
							<ModalBody>
								<Form
									id="task-form"
									onReset={() => {
										setTaskName("");
                    setTaskDetails("");
										setTaskDate(today(getLocalTimeZone()));
										setTaskSoftDate(today(getLocalTimeZone()));
									}}
									onSubmit={(e) => {
										e.preventDefault();
										addTask(taskName, taskDate ?? today(getLocalTimeZone()), taskDetails, taskSoftDate ?? today(getLocalTimeZone()));
										onModalClose();
										setTaskName("");
                    setTaskDetails("");
										setTaskDate(today(getLocalTimeZone()));
										setTaskSoftDate(today(getLocalTimeZone()));
									}}>
									<Input
										label="Task Name"
										labelPlacement="inside"
										placeholder="Enter task name"
										value={taskName}
										onChange={(e) => setTaskName(e.target.value)}
										isRequired/>
                  <Input
										label="Task Details"
										labelPlacement="inside"
										placeholder="Enter Details (optional)"
										value={taskDetails}
										onChange={(e) => setTaskDetails(e.target.value)}
									/>
								</Form>
								<DatePicker
									label="Task Date"
									value={taskDate}
									onChange={(date) => setTaskDate(date)}
									isRequired
									/>
								<DatePicker
									label="Soft Task Date (optional)"
									value={taskSoftDate}
									onChange={(softDate) => setTaskSoftDate(softDate)}
									/>
								<Button
									form="task-form"
									variant="ghost"
									type="submit"
									color="success">
									Add Task
								</Button>
								<Button
									form="task-form"
									variant="ghost"
									type="reset"
									color="danger">
									Reset
								</Button>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>


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
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md ${
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
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md ${
						editor.isActive('bold') ? 'is-active' : ''
					}`}
					data-testid="toggleBold"
					startContent={<MdFormatBold />}
					isIconOnly
				/>

				<Button
					title="Set text color to red"
					onPress={() => editor.chain().focus().setColor('#F98181').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-red-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''
					}`}
					data-testid="setRed"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to orange"
					onPress={() => editor.chain().focus().setColor('#FBBC88').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-orange-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''
					}`}
					data-testid="setOrange"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to yellow"
					onPress={() => editor.chain().focus().setColor('#FAF594').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-yellow-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''
					}`}
					data-testid="setYellow"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to green"
					onPress={() => editor.chain().focus().setColor('#B9F18D').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-green-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''
					}`}
					data-testid="setGreen"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to teal"
					onPress={() => editor.chain().focus().setColor('#94FADB').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-teal-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''
					}`}
					data-testid="setTeal"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to blue"
					onPress={() => editor.chain().focus().setColor('#70CFF8').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-blue-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''
					}`}
					data-testid="setBlue"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Set text color to purple"
					onPress={() => editor.chain().focus().setColor('#958DF1').run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center bg-purple-500 text-white rounded-md ${
						editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''
					}`}
					data-testid="setPurple"
					startContent={<MdColorLens />}
					isIconOnly
				/>

				<Button
					title="Reset text color"
					onPress={() => editor.chain().focus().unsetColor().run()}
					className="h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md"
					data-testid="unsetColor"
					startContent={<MdInvertColorsOff />}
					isIconOnly
				/>

				<div className="inline-flex m-[2px]">
					<Button
						title= "Left align"
						ref={mainButtonRef}
						className="h-6 min-w-0 rounded-l-md rounded-r-none m-0 border-r-0"
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
								className="h-6 !w-6 min-w-0 rounded-r-md rounded-l-none m-0 border-l-0"
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
					onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).setColor(editor.getAttributes('textStyle').color).run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md ${
						editor.isActive({ level: 1 }) ? 'is-active' : ''
					}`}
					data-testid="toggleHeading"
					startContent={<LuHeading1 />}
					isIconOnly
				/>

				<Button
					title="Toggle bulleted list"
					onPress={() => editor.chain().focus().toggleBulletList().run()}
					className={`h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md ${
						editor.isActive('bulletList') ? 'is-active' : ''
					}`}
					data-testid="toggleBulletList"
					startContent={<MdFormatListBulleted />}
					isIconOnly
				/>

				<Button
					title="Save"
					onPress={handleSave}
					className="h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md"
					startContent={<MdSave />}
					isIconOnly
				/>

				<Button
					title="Open File"
					onPress={handleLoad}
					className="h-6 !w-6 m-[2px] min-w-0 justify-center rounded-md"
					startContent={<MdFileOpen />}
					isIconOnly
				/>

				<Button onPress={onDrawerOpen} className="flex absolute right-2 h-6 w-12 rounded-md">Tasks</Button>

			</div>
				<div className="flex justify-center items-center max-h-3/4 my-auto">
					<EditorContent
						className="prose w-full h-full max-h-screen marker:text-inherit bg-default-50"
						editor={editor}
					/>
				</div>
			</div>
			</>
	) : null;
}
