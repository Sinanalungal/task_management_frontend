import TaskManagementSystem from "@/components/task-manage/TaskManagementSystem";

export default function Layout({ children }) {
  return (
    <>
      <main>
        <TaskManagementSystem>{children}</TaskManagementSystem>
      </main>
    </>
  );
}