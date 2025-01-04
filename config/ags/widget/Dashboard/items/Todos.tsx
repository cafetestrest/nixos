import { bind, GLib, readFile, Variable, writeFile } from "astal";
import { Gtk,  } from "astal/gtk3";
import TodosService, { Todo } from "../../../service/LocalTodos";
import icons from "../../../lib/icons";
import Pango from "gi://Pango?version=1.0";
import { widgetTodoQuery } from "../../AppLauncher";

const TodoItem = ({ todo, idx }: { todo: Todo; idx: number }) => {
	return (
		<box spacing={24} hexpand={false} className="todo" visible={bind(widgetTodoQuery).as((query) => {
			if (!query)
				return true;

			if (query.startsWith(":todo "))
				query = query.replace(":todo ", "");

			if (!query)
				return true;

			if (query.startsWith(":todo"))
				query = query.replace(":todo", "");

			if (!query)
				return true;

			const todoContent = todo.content.toLowerCase().trim();

			if (todoContent && todoContent.includes(query.toLowerCase().trim()))
				return true;

			return false;
		})}>
			<button
				className={"todo-toggle"}
				onClick={() => {
					TodosService.toggle(idx);
				}}
				onKeyReleaseEvent={(_, event) => {
					const [keyEvent, keyCode] = event.get_keycode();
	
					if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
						TodosService.toggle(idx);
					}
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
				className={"todo-label"}
				wrap={true}
				truncate={todo.content.length > 256 ? true : false}
				wrapMode={Pango.WrapMode.CHAR}
				justifyFill={true}
			/>

			<button
				className={"todo-remove"}
				valign={Gtk.Align.CENTER}
				onClicked={() => {
					TodosService.remove(idx);
				}}
				onKeyReleaseEvent={(_, event) => {
					const [keyEvent, keyCode] = event.get_keycode();
	
					if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
						TodosService.remove(idx);
					}
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
			{/* <label
				label={"Todos"}
				className={"todos__heading"}
				halign={Gtk.Align.CENTER}
			/> */}
			<box className={"todos__input_box"} spacing={24}>
				<icon icon={icons.todo.checkedAlt} />
				<entry
					className={"todos__input"}
					placeholderText={"Add new todo"}
					onChanged={({ text }) => newTodoText.set(text)}
					onActivate={(self) => {
						addNewTodo(newTodoText.get());
						self.text = "";
					}}
					hexpand
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
