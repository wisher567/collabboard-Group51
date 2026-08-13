export const board = {
  title: "CollabBoard",
  columns: [
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        { id: "task-1", title: "Set up project repo" },
        { id: "task-2", title: "Design database schema" },
        { id: "task-3", title: "Write API spec" },
      ],
    },
    {
      id: "col-2",
      title: "Doing",
      tasks: [
        { id: "task-4", title: "Build Board component" },
        { id: "task-5", title: "Implement drag and drop" },
      ],
    },
    {
      id: "col-3",
      title: "Done",
      tasks: [
        { id: "task-6", title: "Project kickoff meeting" },
        { id: "task-7", title: "Initial wireframes" },
      ],
    },
  ],
};

export default board;