import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { projectsApi } from '@/api/projects';

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await projectsApi.getById(projectId!);
      setProject(response.project);
    } catch (error: any) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Project not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{project.name}</h1>
          <span className="text-sm text-gray-400">Project ID: {projectId}</span>
        </div>
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
          Export Video
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-white font-semibold mb-4">Nodes</h2>
          <div className="space-y-2">
            <div className="bg-gray-700 text-white p-3 rounded cursor-move hover:bg-gray-600 transition-colors">
              Scene Node
            </div>
            <div className="bg-gray-700 text-white p-3 rounded cursor-move hover:bg-gray-600 transition-colors">
              Audio Node
            </div>
            <div className="bg-gray-700 text-white p-3 rounded cursor-move hover:bg-gray-600 transition-colors">
              Manim Node
            </div>
            <div className="bg-gray-700 text-white p-3 rounded cursor-move hover:bg-gray-600 transition-colors">
              Transition Node
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Canvas Area - Node Editor Coming Soon
          </div>
        </main>

        {/* Right Sidebar - Inspector */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-white font-semibold mb-4">Properties</h2>
          <div className="text-gray-400 text-sm">Select a node to view properties</div>
        </aside>
      </div>
    </div>
  );
}
