import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  Board, 
  ProjectDoc, 
  Training, 
  Workspace, 
  Project, 
  Subtask, 
  Comment, 
  Attachment, 
  ProjectLog 
} from '../../types';
import { supabase } from '../lib/supabase';

interface TaskContextType {
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  boards: Board[];
  docs: ProjectDoc[];
  trainings: Training[];
  isLoading: boolean;
  
  // Workspaces
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  startTimer: (taskId: string) => Promise<void>;
  stopTimer: (taskId: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  
  // Boards
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBoard: (id: string, board: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  
  // Docs
  addDoc: (doc: Omit<ProjectDoc, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDoc: (id: string, doc: Partial<ProjectDoc>) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;
  
  // Trainings
  addTraining: (training: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTraining: (id: string, training: Partial<Training>) => Promise<void>;
  deleteTraining: (id: string) => Promise<void>;
  
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [docs, setDocs] = useState<ProjectDoc[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [
        { data: workspacesData },
        { data: projectsData },
        { data: tasksData },
        { data: boardsData },
        { data: docsData },
        { data: trainingsData }
      ] = await Promise.all([
        supabase.from('workspaces').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('boards').select('*').order('created_at', { ascending: false }),
        supabase.from('project_docs').select('*').order('created_at', { ascending: false }),
        supabase.from('trainings').select('*').order('created_at', { ascending: false })
      ]);

      if (workspacesData) setWorkspaces(workspacesData.map(w => ({
        ...w,
        id: w.id,
        createdAt: w.created_at,
        updatedAt: w.updated_at,
        ownerId: w.owner_id
      })));

      if (projectsData) setProjects(projectsData.map(p => ({
        ...p,
        id: p.id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        workspaceId: p.workspace_id,
        clientId: p.client_id,
        startDate: p.start_date,
        ownerId: p.owner_id
      })));

      if (tasksData) setTasks(tasksData.map(t => ({
        ...t,
        id: t.id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        deadline: t.deadline,
        assigneeId: t.assignee_id,
        assigneeName: t.assignee_name,
        reporterId: t.reporter_id,
        projectId: t.project_id,
        workspaceId: t.workspace_id,
        startDate: t.start_date,
        estimatedHours: t.estimated_hours,
        actualHours: t.actual_hours,
        isTimerRunning: t.is_timer_running,
        timerStartedAt: t.timer_started_at,
        productionStage: t.production_stage
      })));
      
      if (boardsData) setBoards(boardsData.map(b => ({
        ...b,
        id: b.id,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
        projectId: b.project_id
      })));
      
      if (docsData) setDocs(docsData.map(d => ({
        ...d,
        id: d.id,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        authorId: d.author_id,
        boardId: d.board_id
      })));
      
      if (trainingsData) setTrainings(trainingsData.map(t => ({
        ...t,
        id: t.id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        authorId: t.author_id
      })));

    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Workspaces CRUD
  const addWorkspace = async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('workspaces').insert([{
        name: workspace.name,
        description: workspace.description,
        owner_id: workspace.ownerId,
        members: workspace.members
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding workspace:', error);
    }
  };

  const updateWorkspace = async (id: string, workspace: Partial<Workspace>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('workspaces').update({
        name: workspace.name,
        description: workspace.description,
        members: workspace.members,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating workspace:', error);
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('workspaces').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  // Projects CRUD
  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('projects').insert([{
        name: project.name,
        description: project.description,
        workspace_id: project.workspaceId,
        client_id: project.clientId,
        start_date: project.startDate,
        deadline: project.deadline,
        status: project.status,
        owner_id: project.ownerId,
        members: project.members
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('projects').update({
        name: project.name,
        description: project.description,
        client_id: project.clientId,
        start_date: project.startDate,
        deadline: project.deadline,
        status: project.status,
        members: project.members,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Tasks CRUD
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('tasks').insert([{
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        start_date: task.startDate,
        assignee_id: task.assigneeId,
        assignee_name: task.assigneeName,
        reporter_id: task.reporterId,
        project_id: task.projectId,
        workspace_id: task.workspaceId,
        estimated_hours: task.estimatedHours,
        actual_hours: task.actualHours,
        production_stage: task.productionStage,
        checklist: task.checklist,
        tags: task.tags
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('tasks').update({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        start_date: task.startDate,
        assignee_id: task.assigneeId,
        assignee_name: task.assigneeName,
        reporter_id: task.reporterId,
        project_id: task.projectId,
        workspace_id: task.workspaceId,
        estimated_hours: task.estimatedHours,
        actual_hours: task.actualHours,
        production_stage: task.productionStage,
        checklist: task.checklist,
        tags: task.tags,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startTimer = async (taskId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('tasks').update({
        is_timer_running: true,
        timer_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', taskId);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const stopTimer = async (taskId: string) => {
    if (!supabase) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.timerStartedAt) return;

    const startTime = new Date(task.timerStartedAt).getTime();
    const endTime = new Date().getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const newActualHours = (task.actualHours || 0) + durationHours;

    try {
      const { error } = await supabase.from('tasks').update({
        is_timer_running: false,
        timer_started_at: null,
        actual_hours: newActualHours,
        updated_at: new Date().toISOString()
      }).eq('id', taskId);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const addComment = async (taskId: string, text: string) => {
    // Mock implementation for now as we don't have a comments table yet
    console.log('Adding comment to task', taskId, text);
    await fetchData();
  };

  const addSubtask = async (taskId: string, title: string) => {
    // Mock implementation for now
    console.log('Adding subtask to task', taskId, title);
    await fetchData();
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    // Mock implementation for now
    console.log('Toggling subtask', subtaskId, 'in task', taskId);
    await fetchData();
  };

  // Boards CRUD
  const addBoard = async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('boards').insert([{
        name: board.name,
        description: board.description,
        project_id: board.projectId,
        columns: board.columns
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding board:', error);
    }
  };

  const updateBoard = async (id: string, board: Partial<Board>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('boards').update({
        name: board.name,
        description: board.description,
        project_id: board.projectId,
        columns: board.columns,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const deleteBoard = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  // Docs CRUD
  const addDoc = async (doc: Omit<ProjectDoc, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('project_docs').insert([{
        title: doc.title,
        content: doc.content,
        author_id: doc.authorId,
        board_id: doc.boardId,
        tags: doc.tags
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding doc:', error);
    }
  };

  const updateDoc = async (id: string, doc: Partial<ProjectDoc>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('project_docs').update({
        title: doc.title,
        content: doc.content,
        board_id: doc.boardId,
        tags: doc.tags,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating doc:', error);
    }
  };

  const deleteDoc = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('project_docs').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting doc:', error);
    }
  };

  // Trainings CRUD
  const addTraining = async (training: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('trainings').insert([{
        title: training.title,
        description: training.description,
        content: training.content,
        author_id: training.authorId,
        duration: training.duration,
        category: training.category,
        video_url: training.videoUrl
      }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding training:', error);
    }
  };

  const updateTraining = async (id: string, training: Partial<Training>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('trainings').update({
        title: training.title,
        description: training.description,
        content: training.content,
        duration: training.duration,
        category: training.category,
        video_url: training.videoUrl,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating training:', error);
    }
  };

  const deleteTraining = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('trainings').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  return (
    <TaskContext.Provider value={{
      workspaces,
      projects,
      tasks,
      boards,
      docs,
      trainings,
      isLoading,
      addWorkspace,
      updateWorkspace,
      deleteWorkspace,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      startTimer,
      stopTimer,
      addComment,
      addSubtask,
      toggleSubtask,
      addBoard,
      updateBoard,
      deleteBoard,
      addDoc,
      updateDoc,
      deleteDoc,
      addTraining,
      updateTraining,
      deleteTraining,
      refreshData: fetchData
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
