import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description} = req.body
            const user = { 
                id: randomUUID(), // UUID => Unique Universal ID 
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null
            };
            database.insert('tasks', user)

            return res.writeHead(201).end()
        }
    }, 
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const tasksData = database.select('tasks', id ? {
                id
            } : null)
            const {created_at, completed_at} = tasksData[0]
            
            database.update('tasks', id, {
                id,
                title,
                description,
                completed_at,
                created_at,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }
]