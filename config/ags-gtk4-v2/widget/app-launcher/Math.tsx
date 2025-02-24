export function evaluate(expr: string): string {
    const operators: { [key: string]: (a: number, b: number) => number } = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };

    const precedence: { [key: string]: number } = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };

    const toPostfix = (infix: string): string[] => {
        const output: string[] = [];
        const stack: string[] = [];
        const tokens = infix.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\))/g);

        if (!tokens) throw new Error("Invalid expression");

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                output.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop()!);
                }
                stack.pop();
            } else if (token in operators) {
                while (
                    stack.length &&
                    precedence[stack[stack.length - 1]] >= precedence[token] &&
                    token !== '^'
                ) {
                    output.push(stack.pop()!);
                }
                stack.push(token);
            }
        }

        while (stack.length) {
            output.push(stack.pop()!);
        }

        return output;
    };

    const evaluatePostfix = (postfix: string[]): number => {
        const stack: number[] = [];

        for (const token of postfix) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (token in operators) {
                const b = stack.pop();
                const a = stack.pop();
                if (a === undefined || b === undefined) throw new Error("Invalid expression");
                stack.push(operators[token](a, b));
            }
        }

        if (stack.length !== 1) throw new Error("Invalid expression");
        return stack[0];
    };

    const result = evaluatePostfix(toPostfix(expr));
	return formatWithCommas(result);
}

// Helper function to format numbers with commas
export function formatWithCommas(num: number): string {
    if (isNaN(num)) return 'Invalid number';

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function containsMathOperation(text:string) {
	// Define a regular expression to match mathematical operators
	const mathOperationRegex = /[+\-*/]/;

	// Use the test method to check if the text contains a math operation
	return mathOperationRegex.test(text);
}
