import { bind, Variable } from "astal";
import { Gdk, Gtk,  } from "astal/gtk4";
import TodosService, { Todo } from "../../../service/LocalTodos";
import icons from "../../../lib/icons";
import Pango from "gi://Pango?version=1.0";
import { widgetTodoQuery } from "../../AppLauncher";

const TodoItem = ({ todo, idx }: { todo: Todo; idx: number }) => {
	return (
		<box spacing={24} hexpand={false} cssClasses={["todo"]} visible={bind(widgetTodoQuery).as((query) => {
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
				cssClasses={["todo-toggle"]}
				onClicked={() => {
					TodosService.toggle(idx);
				}}
				onKeyPressed={(_, keyval) => {
					if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
						TodosService.toggle(idx);
					}
				}}
			>
				<image
					cssClasses={["todo__check"]}
					iconName={
						todo.done ? icons.todo.checkedAlt : icons.todo.unchecked
					}
					pixelSize={24}
				/>
			</button>

			<label
				hexpand={true}
				halign={Gtk.Align.START}
				label={todo.content}
				cssClasses={["todo-label"]}
				wrap={true}
				ellipsize={todo.content.length > 128 ? Pango.EllipsizeMode.END : Pango.EllipsizeMode.NONE}
				wrapMode={Pango.WrapMode.CHAR}
				justify={Gtk.Justification.FILL}
			/>

			<button
				cssClasses={["todo-remove"]}
				valign={Gtk.Align.CENTER}
				onClicked={() => {
					TodosService.remove(idx);
				}}
				onKeyPressed={(_, keyval) => {
					if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
						TodosService.remove(idx);
					}
				}}
			>
				<image
					cssClasses={["todo__delete"]}
					pixelSize={24}
					iconName={icons.ui.close}
				/>
			</button>
		</box>
	);
};

const addNewTodo = (text: string) => {
	if (text.length >= 1) {
		TodosService.add(text);
	}
};

export default () => {
	const newTodoText = Variable<string>("");
	const widgetCounter = Variable<number>(6);

	return (
		<box vertical cssClasses={["todos", "block"]}>
			<box cssClasses={["todos__input_box"]} spacing={24}>
				<image iconName={icons.todo.checkedAlt} />
				<entry
					cssClasses={["todos__input"]}
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
				visibleChildName={bind(TodosService, "todos").as((t) =>
					t.length > 0 ? "todos" : "placeholder",
				)}
			>
				<box
					name={"todos"}
					cssClasses={bind(widgetCounter).as((c) => {
						const baseHeight = 3.5;
						const maxHeight = 20;
						const height = Math.min(c * baseHeight, maxHeight);
						// const heightCss = `min-height: ${height}rem;`;
						const css = height.toFixed(1).replace(".0", "").replace(".", "-");
						return ["todos-box", `todos-${css}`];
					})}
				>
					<Gtk.ScrolledWindow
						cssClasses={["todos__scrollable"]}
						hexpand
						vexpand
					>
						<box vertical cssClasses={["todos__container"]}>
							{bind(TodosService, "todos").as((t) => {
								widgetCounter.set(t.length)
								return t.map((item, idx) => (
									<TodoItem todo={item} idx={idx} />
								))
							})}
						</box>
					</Gtk.ScrolledWindow>
				</box>
				<box name={"placeholder"}></box>
			</stack>
		</box>
	);
};
