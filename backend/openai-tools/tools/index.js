import { markTodoDone, markTodoDoneToolConfig,
        addTodos, addTodosToolConfig,
        checkTodos, checkTodosToolConfig
     } from "./todoList.js";

export const functions = {
    addTodos,
    markTodoDone,
    checkTodos,
}

export const configsArray = [
    addTodosToolConfig,
    markTodoDoneToolConfig,
    checkTodosToolConfig,
]

export default {
    functions,
    configsArray
}