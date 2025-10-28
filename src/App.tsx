import './App.css';
import {
  TaskInput,
  TaskList,
  TaskFilters,
  TaskListHeader
} from './features/tasks/components';
import { ErrorDisplay } from './ui';
import { AppHeader } from './ui';

function App() {
  return (
    <main>
      <AppHeader />
      <div className="flex flex-col px-2 py-6 md:px-4 md:py-10 gap-4 max-w-xl min-w-sm md:min-w-lg mx-auto">
        <TaskInput />
        <TaskFilters />
        <TaskListHeader />
        <TaskList />
        <ErrorDisplay />
      </div>
    </main>
  );
}

export default App;
