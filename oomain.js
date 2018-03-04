// 用面向对象的思想优化这个程序
// 不会让别的程序， 污染我的代码， 也不会让我的代码污染别的代码

var log = function() {
    console.log.apply(console, arguments)
}
var e = function(selector) {
    return document.querySelector(selector)
}
var appendHtml = function(position, s) {
    position.insertAdjacentHTML('beforeend', s)
}
var save = function(array) {
    var s = JSON.stringify(array)
    localStorage.todos = s;
}
var load = function() {
    var s = localStorage.todos
    return JSON.parse(s)
}
var getTime = function() {
    var t = new Date()
    var y = t.getFullYear()
    var mon = t.getMonth() + 1
    var d = t.getDate()
    var h = t.getHours()
    var min = t.getMinutes()

    var str = `${y}/${mon}/${d} ${h}:${min}`
    return str
}
// 函数也算一个对象
// 我理解就是, 就是把函数抽成一个对象的方法
// 那么， 现在有多少函数呢
// getTime() 添加一个addButton(),
// templateTodo() delete-button和finished-butto,
// toggleClass() save() load()
// saveTodos()
// loadTodes()
var Api = function(position) {
    // 我想position 应该是放入的位置
    // 传进来的应该是一个元素选择器
    this.p = position
}
// 首先向放置的位置那里， 放一个， 输入框和， addButton
Api.prototype.addItem = function() {
    var s = `
        <input id="id-input-todo"type="text">
        <button id="id-button-add"type="button">Add</button>
    `
    // log("addItem()", this.p)
    appendHtml(this.p, s)
}
Api.prototype.templateTodo = function(todo) {
    var status = ''
    var task = todo.task
    var time = todo.time
    // log('templateTodo(), getTime', time, todo.time)
    if(todo.done) {
        status = 'done'
    }
    var s = `
    <div class="todo-cell ${status}">
        <button type="button" class="todo-done">Finished</button>
        <button type="button" class="todo-delete">Delete</button>
        <span class="todo-content" contenteditable="true">${task}</span>
        <span class="todo-time" contenteditable="false">${time}</span>
    </div>
    `
    return s
}
// 反正每个都是要saveTodo()的  这个功能我最后加
// 什么时候saveTodos呢？
// 就是在add, Fin, Del,
Api.prototype.saveTodos = function() {
    // 我要得到， 所有屏幕上所有数据，
    // 这个得到的是， 整个， 一条HTML语句
    var contains = document.querySelectorAll(".todo-content")
    var times = document.querySelectorAll(".todo-time")

    var todos = []
    for (var i = 0; i < contains.length; i++) {
        var c = contains[i]
        var task = c.innerHTML
        var time = times[i].innerHTML
        var done = c.parentElement.classList.contains("done")
        log("saveTodos(), done", done)
        // set a todo
        var todo = {
            done: done,
            task: task,
            time: time,
        }
        todos.push(todo)
    }
    save(todos)
}
Api.prototype.bindAdd = function() {
    var addButton = e('#id-button-add')
    var api = this
    addButton.addEventListener('click', function(){
        var todoInput = e('#id-input-todo')
        var time = getTime()
        // log('Api.prototype.bindAdd, time', time)
        var todo = {
            done: false,
            task: todoInput.value,
            time: time,
        }
        // log('bindAdd(), 检查， templateTodo()', todo)
        // 因为， 如果在这里写this.p, 调用this.p的不是Api的方法
        // 所以this 指向的不是Api这个对象
        // 用参数保存外面的 this.p 在里面可以直接用
        var s = api.templateTodo(todo)
        // var s = templateTodo(todo)
        api.p.insertAdjacentHTML('beforeend', s)
        // log(position)
        api.saveTodos()
    })
}
var toggleClass = function(element, className) {
    var e = element
    // log("toggleClass(), 执行成功")
    if(e.classList.contains('done')) {
        e.classList.remove(className)
    } else {
        // log("toggleClass(), className", className)
        e.classList.add(className)
    }
}
Api.prototype.bindDelAndFin = function() {
    // 事件委托, 给这个类， 绑定一个事件
    var todoDiv = this.p
    var api = this
    todoDiv.addEventListener('click', function(event){
        // 点击Finished
        var target = event.target
        // log("bindDelAndFin(), target", target)
        var p = target.parentElement
        // log("bindDelAndFin(), p", p)
        if(target.classList.contains('todo-done')) {
            toggleClass(p, 'done')
            api.saveTodos()
        } else if (target.classList.contains('todo-delete')) {
            p.remove()
            api.saveTodos()
        }
    })
}
Api.prototype.loadTodes = function() {
    var todos = load()
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        var s = this.templateTodo(todo)
        appendHtml(this.p, s)
    }
}
var runMethod = function(a) {
    a.addItem()
    a.loadTodes()
    a.bindAdd()
    a.bindDelAndFin()
}
var __main = function() {
    var p = e('#id-div-container')
    var a = new Api(p)
    runMethod(a)
}
__main()
