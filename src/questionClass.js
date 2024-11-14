export class Question {
    constructor(question = "", answers = []) {
        this.question = question;
        this.answers = answers;
    }
    toJSON() {
        return {
            question: this.question,
            answers: this.answers
        }
    }
}