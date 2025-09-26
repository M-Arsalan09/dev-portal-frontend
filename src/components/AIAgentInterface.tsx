import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Brain, 
  Send, 
  Upload,
  Sparkles,
  MessageCircle,
  Search,
  Users,
  CheckCircle,
  X,
  Bot,
  FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { AnalyzeProjectRequest, AgentResponse } from '../types/api';

interface QueryChatProps {
  onQuery: (query: string) => Promise<AgentResponse>;
}

const QueryChat: React.FC<QueryChatProps> = ({ onQuery }) => {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;

    const userMessage = { type: 'user' as const, content: currentQuery, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      const response = await onQuery(currentQuery);
      const aiMessage = { 
        type: 'ai' as const, 
        content: response.response || 'Sorry, I couldn\'t process your request.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        type: 'ai' as const, 
        content: 'Sorry, there was an error processing your request.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setCurrentQuery('');
      setIsLoading(false);
    }
  };

  // const quickQuestions = [
  //   "Explain how AI works in a few words",
  //   "What are the latest trends in web development?",
  //   "How can I improve team productivity?",
  //   "What skills are most in demand for developers?"
  // ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Chat Assistant</h2>
              <p className="text-white/80 text-sm">Ask questions about development, technologies, or team management</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto mb-4 space-y-4 bg-black/20 rounded-lg p-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Brain className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/80">Start a conversation with the AI assistant</p>
            </motion.div>
          )}
          
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                <div className="text-sm text-white prose prose-invert max-w-none prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-code:text-white prose-pre:text-white">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <p className="text-xs opacity-70 mt-1 text-white">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 text-white border border-white/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Questions
      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-white/70 text-sm mb-2">Quick questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuery(question)}
                className="text-left p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )} */}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          value={currentQuery}
          onChange={(e) => setCurrentQuery(e.target.value)}
          placeholder="Ask the AI assistant anything..."
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          disabled={!currentQuery.trim() || isLoading}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

interface ProjectAnalysisProps {
  onAnalyze: (data: AnalyzeProjectRequest) => Promise<AgentResponse>;
}

const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({ onAnalyze }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnalyzeProjectRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AgentResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async (data: AnalyzeProjectRequest) => {
    setIsLoading(true);
    try {
      const analysisData = {
        ...data,
        project_file: selectedFile || undefined
      };
      
      const result = await onAnalyze(analysisData);
      setAnalysisResult(result);
      toast.success('Project analysis completed!');
    } catch (error) {
      console.error('Error analyzing project:', error);
      toast.error('Failed to analyze project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setSelectedFile(file);
      } else {
        toast.error('Please select a PDF or DOCX file');
        e.target.value = '';
      }
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    reset();
    setSelectedFile(null);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Project Analysis</h2>
            <p className="text-white/80 text-sm">Analyze project requirements and get developer recommendations</p>
          </div>
        </div>
        {analysisResult && (
          <button
            onClick={clearAnalysis}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {!analysisResult ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Project Name</label>
            <input
              {...register('project_name', { required: 'Project name is required' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter project name"
            />
            {errors.project_name && <p className="text-red-400 text-sm mt-1">{errors.project_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Project Description</label>
            <textarea
              {...register('project_description')}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe your project requirements, features, and goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Upload Project Document (Optional)</label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="project-file"
              />
              <label
                htmlFor="project-file"
                className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70 text-sm">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF or DOCX file'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Required Skills (Optional)</label>
              <input
                {...register('required_skills')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., ['Python', 'React', 'Node.js']"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Project Categories (Optional)</label>
              <input
                {...register('project_categories')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., ['Web Development', 'AI/ML']"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Project</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Analysis Status */}
          <div className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-green-400 font-medium">Analysis Complete</h3>
              <p className="text-green-300 text-sm">Project requirements analyzed successfully</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-bold text-lg mb-2">{analysisResult.project_name}</h3>
            {analysisResult.project_description && (
              <p className="text-white/80 text-sm mb-4">{analysisResult.project_description}</p>
            )}
            
            
            {/* Required Skills */}
            {analysisResult.required_skills && analysisResult.required_skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Categories */}
            {analysisResult.project_categories && analysisResult.project_categories.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Project Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.project_categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Developer Analysis */}
          {analysisResult.analysis && (
  <div className="bg-white/5 rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-3">
      <Users className="w-5 h-5 text-white" />
      <h4 className="text-white font-medium">Developer Recommendations</h4>
      {analysisResult.total_developers_analyzed && (
        <span className="text-white/80 text-sm">
          ({analysisResult.total_developers_analyzed} developers analyzed)
        </span>
      )}
    </div>

    {/* wrap in div for styling */}
    <div className="prose prose-invert max-w-none text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-code:text-white prose-pre:text-white prose-li:text-white prose-ul:text-white prose-ol:text-white text-sm">
      <ReactMarkdown>{analysisResult.analysis}</ReactMarkdown>
    </div>
  </div>
)}

          {/* Model Info */}
          {analysisResult.model && (
          <div className="text-center text-white/70 text-xs">
            Powered by {analysisResult.model}
          </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const AIAgentInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'analysis'>('analysis');

  const handleQuery = async (query: string): Promise<AgentResponse> => {
    try {
      const response = await apiService.queryAgent({ query });
      return response;
    } catch (error) {
      console.error('Error querying agent:', error);
      throw error;
    }
  };

  const handleProjectAnalysis = async (data: AnalyzeProjectRequest): Promise<AgentResponse> => {
    try {
      const response = await apiService.analyzeProject(data);
      return response;
    } catch (error) {
      console.error('Error analyzing project:', error);
      throw error;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 min-h-full">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI Agent</h1>
            <p className="text-white/80">Intelligent project analysis and team recommendations</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/20">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('agent')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'agent'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>AI Agent</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'analysis'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Project Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'agent' && (
          <motion.div
            key="agent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <QueryChat onQuery={handleQuery} />
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <ProjectAnalysis onAnalyze={handleProjectAnalysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentInterface;
