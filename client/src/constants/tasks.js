export const taskStatuses = ["Pending", "In Progress", "Completed"];

export function createEmptyTask(project) {
  const firstRegisteredMember = project?.members?.find((member) => member.user?._id);

  return {
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    assignee: firstRegisteredMember?.user?._id || ""
  };
}
