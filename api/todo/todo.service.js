const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  getTodos,
  getTodoById,
  addTodo,
  removeTodo,
  updateTodo
};

async function getTodos() {
  const collection = await dbService.getCollection("todo");
  let todos
  try {
    todos = await collection.find().toArray();
  } catch (err) {
    console.log("There was a problem with getting Todos From the Mongo server");
    const client = await dbService.getSqlClient()
    todos = client.query('SELECT * FROM todo')
      .then(res => res.rows)
      .catch(e => console.error(e.stack))
  } finally { 
    return todos
  } 
}

async function getTodoById(id) {
    const collection = await dbService.getCollection("todo");
    let todo
    try {
      todo = collection.findOne({ _id: ObjectId(id)});
    } catch (err) {
      console.log("Err, Mongo server couldnt find todo by the ID"); 
      const client = await dbService.getSqlClient()
      todo = client.query(`SELECT * FROM todo WHERE _id='${id}'`)
      .then(res => res.rows[0])
      .catch(e => console.error(e.stack))
    } finally { 
    return todo
  } 
}

// Keeping on track in case Mongo removing/adding/updating but backup fail with logger?

async function removeTodo(todo) {
  const collection = await dbService.getCollection("todo");
  let removedTodo
  try {
    removedTodo = await collection.deleteOne({ _id: ObjectId(todo.id) });
    const client = await dbService.getSqlClient()
    client.query(`DELETE FROM todo WHERE _id='${todo.id}'`)
    .then(res => res.rows[0])
    .catch(e => {
      console.error(e.stack)
      console.log(`Postgres server couldnt remove the todo with the ID: ${todo.id}`)
    })
  } catch (err) {
    console.log(`Err, server couldnt remove the todo with ID: ${todo.id}`);
  }
  return removedTodo
}

async function updateTodo(todo) {
  console.log('dsf',todo)
  const collection = await dbService.getCollection("todo");
  const id = todo._id
  todo._id = ObjectId(todo._id);
  try {
    await collection.updateOne({_id:todo._id},{$set:todo});
    const client = await dbService.getSqlClient()
    client.query(`UPDATE todo SET "isDone"=${todo.isDone} WHERE _id='${id}'`)
    .then(res => res.rows[0])
    .catch(e => {
      console.error(e.stack)
      console.log(`Postgres server couldnt update the todo with the ID: ${todo.id}`)
    })
    return todo
  } catch (err) {
    console.log(`Err, server couldnt update todo: ${todo._id}`);
    throw err;
  }
}


async function addTodo(todo) {
  const collection = await dbService.getCollection("todo");
  try {
    const addedTodo = await collection.insertOne(todo);
    const client = await dbService.getSqlClient()
    client.query(`INSERT INTO public.todo( _id, "desc", "isDone") VALUES ('${addedTodo.insertedId}', '${todo.desc}', ${todo.isDone})`)
    .then(res => res.rows[0])
    .catch(e => {
      console.error(e.stack)
      console.log(`Postgres server failed adding the todo with the ID: ${todo.id}`)
    })
    return todo;
  } catch (err) {
    console.log(`ERR, server failed adding the todo with the ID: ${todo.id}`);
    throw err;
  }
}

