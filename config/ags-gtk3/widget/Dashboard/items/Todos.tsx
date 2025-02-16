import { bind, Variable } from "astal";
import { Gdk, Gtk,  } from "astal/gtk3";
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
					const key = event.get_keyval()[1];
					if (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter) {
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
					const key = event.get_keyval()[1];
					if (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter) {
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
	const widgetCounter = Variable<number>(6);

	return (
		<box vertical className={"todos block"}>
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
				<scrollable
					className={"todos__scrollable"}
					name={"todos"}
					css={bind(widgetCounter).as((c) => {
						const baseHeight = 3.5;
						const maxHeight = 20;
						const height = Math.min(c * baseHeight, maxHeight);
						return `min-height: ${height}rem;`;
					})}
				>
					<box vertical className={"todos__container"}>
						{bind(TodosService, "todos").as((t) => {
							widgetCounter.set(t.length)
							return t.map((item, idx) => (
								<TodoItem todo={item} idx={idx} />
							))
						})}
					</box>
				</scrollable>
				<box name={"placeholder"}></box>
			</stack>
		</box>
	);
};
