const AUTH_URL = "http://localhost:3000/api/auth"; // Auth URL
const API_URL = "http://localhost:3000/api/todo"; // Backend URL

document.getElementById("toggleAuth").addEventListener("click", function () {
    const title = document.getElementById("authTitle");
    const button = document.querySelector("#authContainer button");

    if (title.innerText === "Login") {
        title.innerText = "Register";
        button.innerText = "Register";
        this.innerHTML = 'Already have an account? <a href="#">Login</a>';
    } else {
        title.innerText = "Login";
        button.innerText = "Login";
        this.innerHTML = "Don't have an account? <a href='#'>Register</a>";
    }
});

async function handleAuth() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const authType = document.getElementById("authTitle").innerText.toLowerCase();
    const endpoint = authType === "login" ? "login" : "register"; 

    try {
        const response = await fetch(`${AUTH_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()
        

        if (!response.ok) {
            document.getElementById("authError").innerText = data.message || "An error occurred";
            document.getElementById("authError").style.color = "red";
            return;
        }
        if (response.ok) {
            document.getElementById("authError").innerText = "Registration successful! 🎉";
            document.getElementById("authError").style.color = "green";
            setTimeout(() => {
                document.getElementById("authError").innerText = ""; 
            }, 2000);
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                showTodoContainer();
            }
        } else {
            document.getElementById("authError").innerText = data.error || "An error occurred";
            document.getElementById("authError").style.color = "red"; 
        }

    } catch (err) {
        console.error("Error : ", err);
    }

}

async function showTodoContainer() {
    document.getElementById("authContainer").style.display = "none";
    document.getElementById("todoContainer").style.display = "block";

    await loadTodos(); 
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

async function addTodo() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in first!");
        return;
    }
    const todoText = document.getElementById("todoInput").value;

    const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: todoText, completed: false }),
    })

    if (response.status === 401) {
        alert("Unauthorized! Please log in again.");
        logout();
        return;
    }


    if (response.status === 409) {
        alert("This task already exists! Please add a different task.");
        return;
    }

    document.getElementById("todoInput").value = "";
    await loadTodos();

}

async function loadTodos() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (!response.ok) {
            throw new Error("Failed to fetch todos");
        }
        const data = await response.json();

        const todoList = document.getElementById("todoList");
        todoList.innerHTML = "";


        data.forEach(todo => {
            const li = document.createElement("li");
            li.className = "todo-item";
            li.innerHTML = "";

           
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;
            checkbox.className = "todo-checkbox";

            const textSpan = document.createElement("span");
            textSpan.textContent = `${todo.title}`;
            textSpan.className = todo.completed ? "todo-text completed" : "todo-text";



            checkbox.onclick = async () => {
                await fetch(`${API_URL}/${todo._id}/toggle`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`

                    }
                });
                await loadTodos();
            };


            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
            deleteBtn.className = "delete-btn";


            deleteBtn.onclick = async () => {
                await fetch(`${API_URL}/${todo._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                await loadTodos();
            };

            
            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });


    } catch (err) {
        console.error("Error fetching todos:", err);
    }
}

