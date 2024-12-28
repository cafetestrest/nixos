import { bind, GLib, readFile, Variable, writeFile } from "astal";
import { Gtk,  } from "astal/gtk3";
import TodosService, { Todo } from "../../../service/LocalTodos";
import icons from "../../../lib/icons";

const TodoItem = ({ todo, idx }: { todo: Todo; idx: number }) => {
	return (
		<box spacing={24} hexpand={true} className="todo">
			<button
				onClick={() => {
					TodosService.check(idx);
				}}
			>
				<icon
					className="todo__check"
					icon={
						todo.done ? icons.todo.checkedAlt : icons.todo.unchecked
					}
					pixelSize={24}
				/>
			</button>

			<label
				hexpand={true}
				halign={Gtk.Align.START}
				label={todo.content}
			/>

			<button
				valign={Gtk.Align.CENTER}
				onClicked={() => {
					TodosService.remove(idx);
				}}
			>
				<icon
					className="todo__delete"
					pixelSize={24}
					icon={icons.ui.close}
				/>
			</button>
		</box>
	);
};

const addNewTodo = (text: string) => {
	if (text.length >= 3) {
		TodosService.add(text);
	}
};

export default () => {
	const newTodoText = Variable<string>("");

	return (
		<box vertical className={"todos block"}>
			<label
				label={"Todos"}
				className={"todos__heading"}
				halign={Gtk.Align.START}
			/>
			<box className={"todos__input_box"} spacing={24}>
				<icon icon={icons.todo.checkedAlt} />
				<entry
					className={"todos__input"}
					placeholderText={"New todo..."}
					onChanged={({ text }) => newTodoText.set(text)}
					onActivate={(self) => {
						addNewTodo(newTodoText.get());
						self.text = "";
					}}
				/>
			</box>
			<stack
				transitionType={Gtk.StackTransitionType.CROSSFADE}
				shown={bind(TodosService, "todos").as((t) =>
					t.length > 0 ? "todos" : "placeholder",
				)}
			>
				<scrollable className={"todos__scrollable"} name={"todos"}>
					<box vertical className={"todos__container"}>
						{bind(TodosService, "todos").as((t) =>
							t.map((item, idx) => (
								<TodoItem todo={item} idx={idx} />
							)),
						)}
					</box>
				</scrollable>
				<box name={"placeholder"}></box>
			</stack>
		</box>
	);
};
