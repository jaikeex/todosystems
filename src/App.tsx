import './App.css';
import {
  TaskInput,
  TaskList,
  TaskFilters,
  TaskListHeader
} from './features/tasks/components';
import { ErrorDisplay } from './ui';
import { Typography } from './ui/Typography';

function App() {
  return (
    <main className="flex flex-col px-2 py-6 md:px-4 md:py-10 gap-4 max-w-xl min-w-sm md:min-w-lg mx-auto">
      <Typography as="h1" variant="heading-lg" align="center">
        Todo List
      </Typography>
      <TaskInput />
      <TaskFilters />
      <TaskListHeader />
      <TaskList />
      <ErrorDisplay />
    </main>
  );
}

export default App;
