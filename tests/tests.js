
// tests.js
'use strict';

class Tester {
    static repeatCharacter(character, times) {
        let result = '';
        for (let i = 0; i < times; i++)
            result += character;
        return result;
    }

    static separator = Tester.repeatCharacter('-', 50);
    static endSeparator = Tester.repeatCharacter('*', 50);

    constructor() {
        this.testIndex = 0;
        this.tests = [];
        this.testNames = [];
    }

    set(testPairs) {
        this.tests = testPairs.map(pair => pair[0]);
        this.testNames = testPairs.map(pair => pair[1]);
    }

    add(test, testName) {
        this.tests.push(test);
        this.testNames.push(testName);
    }

    run() {
        if (this.testIndex < this.tests.length) {
            console.log(`${Tester.separator}\n` +
            `· Test ${this.testIndex + 1}/${this.tests.length} '${this.testNames[0]}'\n`);
            const test = this.tests[this.testIndex];
            this.testIndex++;
            return test(this.printResults.bind(this));
        } else
            return Tester.end();
        }

    printResults(error) {
        const testName = this.testNames.shift();
        let message = `Test '${testName}': `;
        message += error ? `Fail\n\t${error}` : 'Passed';
        console.log('\n> ' + message);
        if (!error)
            return this.run();
        else
            return Tester.end();
    }

    static end() {
        console.log(`${this.separator}\n> Tests Completed\n${this.endSeparator}`);
    }
}

module.exports = Tester;