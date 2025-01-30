import { TodoList } from "@/components/blocks/todo-list"

export default function IndexPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="font-mono text-4xl font-bold mb-2 animate-pulse">
          Retro Todo List
        </h1>
        <p className="font-mono text-gray-600 dark:text-gray-400">
          Keep track of your vintage tasks in style
        </p>
      </div>
      
      <TodoList />
      
      <footer className="mt-16 text-center font-mono text-sm text-gray-500">
        Made with ❤️ on a vintage keyboard
      </footer>
    </div>
  )
}