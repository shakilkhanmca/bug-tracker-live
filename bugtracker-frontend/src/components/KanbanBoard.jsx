import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TicketService from "../services/ticket.service";
import ProjectService from "../services/project.service";

const columnsFromBackend = {
  TODO: {
    name: "To Do",
    items: [],
  },
  IN_PROGRESS: {
    name: "In Progress",
    items: [],
  },
  DONE: {
    name: "Done",
    items: [],
  },
  BACKLOG: {
    name: "Backlog",
    items: [],
  }
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    retrieveProjects();
  }, []);

  const retrieveProjects = async () => {
    try {
      const response = await ProjectService.getMyProjects();
      setProjects(response.data);

      // If projectId is in URL, prefer that.
      const urlProjectId = window.location.pathname.split("/").pop(); // Simple hack or use useParams if we update route
      const isNum = !isNaN(urlProjectId);

      let targetProjId = null;
      if (isNum && response.data.some(p => p.id == urlProjectId)) {
        targetProjId = urlProjectId;
      } else if (response.data.length > 0) {
        targetProjId = response.data[0].id;
      }

      if (targetProjId) {
        setSelectedProject(targetProjId);
        retrieveTickets(targetProjId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveTickets = async (projectId) => {
    setLoading(true);
    try {
      const response = await TicketService.getTicketsByProject(projectId);
      const tickets = response.data;

      const newColumns = {
        TODO: { name: "To Do", items: [] },
        IN_PROGRESS: { name: "In Progress", items: [] },
        DONE: { name: "Done", items: [] },
        BACKLOG: { name: "Backlog", items: [] }
      };

      tickets.forEach(ticket => {
        if (newColumns[ticket.status]) {
          newColumns[ticket.status].items.push(ticket);
        } else {
          // Default to TODO if status mismatch
          newColumns.TODO.items.push(ticket);
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    retrieveTickets(projectId);
  };

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      // update ticket status
      removed.status = destination.droppableId;
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      // Call API
      try {
        await TicketService.updateTicket(removed.id, { status: destination.droppableId });
      } catch (error) {
        console.error("Failed to update ticket status", error);
        // Revert changes if needed (omitted for brevity)
      }

    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-4 pt-4">
        <h2 className="text-2xl font-bold text-gray-800">Kanban Board</h2>
        <div>
          <select
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={selectedProject || ""}
            onChange={handleProjectChange}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center h-full overflow-x-auto px-4 pb-4">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                className="flex flex-col bg-gray-100 rounded-lg w-80 min-w-[250px] mx-2 shadow-md"
                key={columnId}
              >
                <div className="p-4 font-bold text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg">
                  {column.name} <span className="text-sm font-normal text-gray-500 ml-2">({column.items.length})</span>
                </div>
                <div className="flex-1 p-2 overflow-y-auto min-h-[100px]">
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={String(item.id)}
                              draggableId={String(item.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`user-select-none p-4 mb-3 bg-white rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${snapshot.isDragging ? "bg-blue-100" : ""}`}
                                  style={{ ...provided.draggableProps.style }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-gray-800">{item.title}</h5>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                    <span className={`px-2 py-1 rounded text-white font-bold ${item.priority === 'HIGH' || item.priority === 'CRITICAL' ? 'bg-red-500' :
                                        item.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}>
                                      {item.priority}
                                    </span>
                                    <span>{item.dueDate}</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
