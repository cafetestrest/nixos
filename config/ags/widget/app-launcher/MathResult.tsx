import { evaluate } from "./Math";

export const MathResult = (mathText: string) => {
    let result;
    try {
        result = evaluate(mathText);
    } catch (error) {
        // do nothing
    }

    if (!result) {
        return (<box visible={false}/>)
    }

    return (
        <box vertical={true}>
            <label label={result} className={"math-result"} />
        </box>
    );
};
