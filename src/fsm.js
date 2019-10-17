class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config) {
            this.state = config.initial;
            this.config = config;
            this.history = [config.initial];
            this.currentStateIndex = 0;
        } else {
            throw Error('Config isn\'t passed');
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state]) {
            this.state = state;
            this.currentStateIndex += 1;
            this.history.splice(this.currentStateIndex);
            this.history.push(state);
        } else {
            throw Error('The state isn\'t exist');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const state = this.getState();
        const transition = this.config.states[state].transitions[event];
        if (transition) {
            this.changeState(transition);
        } else {
            throw Error('The event in current state isn\'t exist');
        }

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = this.config.states;
        let result = [];
        if (event) {
            for (let state in states) {
                if (states[state].transitions[event]) {
                    result.push(state);
                }
            }
        } else {
            result = Object.keys(this.config.states);
            //Object.getOwnPropertyNames(this.config.states);
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let isSuccessful = false;
        if (this.currentStateIndex > 0) {
            this.currentStateIndex -= 1;
            this.state = this.history[this.currentStateIndex];
            isSuccessful = true;
        }
        return isSuccessful;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let isSuccessful = false;
        if (this.currentStateIndex + 1 < this.history.length) {
            this.currentStateIndex += 1;
            this.state = this.history[this.currentStateIndex];
            isSuccessful = true;
        }
        return isSuccessful;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.splice(1);
        this.state = this.history[0];
        this.currentStateIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
