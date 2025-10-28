import './App.css';
import {
  TaskInput,
  TaskList,
  TaskFilters,
  TaskListHeader
} from './features/tasks/components';
import { ErrorDisplay, Loader } from './ui';

function App() {
  return (
    <main className="flex flex-col px-2 py-6 md:px-4 md:py-10 gap-4 max-w-xl min-w-sm md:min-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <TaskInput />
      <TaskFilters />
      <TaskListHeader />
      <TaskList />
      <ErrorDisplay />
      <Loader />
    </main>
  );
}

export default App;
