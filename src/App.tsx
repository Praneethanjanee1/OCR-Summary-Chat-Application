import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OCRUpload } from './components/OCRUpload';
import { QASection } from './components/QASection';
import { useOCR } from './hooks/useOCR';
import { MessageSquare, ArrowRight, Upload as UploadIcon, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showQASection, setShowQASection] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { text, summary, error, loading, processImage, reset: resetOCR } = useOCR();
  const summaryRef = useRef<HTMLDivElement>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout>();

  const handleImageUpload = async (file: File) => {
    if (file.size > 0) {
      await processImage(file);
      // Scroll to summary when loaded
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const toggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };

  // Reset states when starting a new upload
  const handleNewUpload = () => {
    // Reset all states
    setShowQASection(false);
    setShowFullSummary(false);
    
    // Reset OCR state using the reset function
    resetOCR();
    
    // Show notification
    setShowNotification(true);
    
    // Hide notification after 5 seconds
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    
    // Scroll to upload section
    setTimeout(() => {
      const uploadSection = document.getElementById('upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (showQASection && text) {
    return (
      <Layout>
        <QASection context={text} onBack={() => setShowQASection(false)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[95rem] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="text-center py-20 md:py-28 lg:py-36">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <motion.div 
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-8 border border-blue-100 shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="flex h-2.5 w-2.5 mr-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-semibold">AI-Powered Document Processing</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Smarter Document Analysis
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your documents into actionable insights with our AI-powered OCR and analysis tools. Extract text, generate summaries, and get instant answers from your documents.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              {/* <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <UploadIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <span className="text-lg">Upload Document</span>
              </motion.button> */}
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"              >
                <span className="text-lg">Learn More</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            }}
            whileHover={{
              y: -5,
              boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.2)',
              transition: { duration: 0.3 }
            }}
            transition={{ 
              delay: 0.3, 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
              boxShadow: { duration: 0.5 }
            }}
            className="mt-20 md:mt-28 relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/25 via-purple-600/25 to-pink-600/25 rounded-4xl blur-2xl -z-10"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl overflow-hidden relative"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative z-10">
              {/* Document Analysis Section */}
              <div className="p-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <div className="flex space-x-2.5 p-3.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm"></div>
                </div>
              </div>
              
              <div className="p-8 sm:p-10">
                <div className="text-center mb-10">
                  <motion.div 
                    className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-white rounded-2xl mb-6 shadow-xl"
                    animate={{ 
                      boxShadow: [
                        '0 8px 20px 0 rgba(99, 102, 241, 0.3)',
                        '0 12px 32px 0 rgba(99, 102, 241, 0.4)',
                        '0 8px 20px 0 rgba(99, 102, 241, 0.3)'
                      ]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <MessageSquare className="w-10 h-10 text-blue-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">Document Analysis in Action</h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">Upload a document to see the magic happen! Our AI will extract text and provide insights instantly.</p>
                  
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-md mx-auto mt-8">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }}
                    />
                  </div>
                </div>
                
                {/* Upload Section */}
                <div className="mt-12 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden border-0 relative z-10">
                    <div className="p-6 sm:p-8">
                      <OCRUpload onUpload={handleImageUpload} isLoading={loading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-5xl mx-auto">
        
        {!text && !loading && !error && (
          <div id="upload-section" className="py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              
              <div id="features" className="pt-12">
              
              <div className="text-center max-w-4xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                <p className="text-xl text-gray-600">Everything you need to work with documents more effectively</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
                {[
                  {
                    icon: <UploadIcon className="w-6 h-6 text-blue-600" />,
                    title: 'Smart Upload',
                    description: 'Drag & drop or take a photo of any document. We support images, PDFs, and more with advanced OCR technology.',
                    color: 'bg-white',
                    hoverBg: 'hover:bg-blue-50',
                    border: 'border-gray-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    delay: 0.1
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6 text-green-600" />,
                    title: 'AI Analysis',
                    description: 'Get instant summaries, key points, and actionable insights from any document with our advanced AI models.',
                    color: 'bg-white',
                    hoverBg: 'hover:bg-green-50',
                    border: 'border-gray-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    delay: 0.2
                  },
                  {
                    icon: <ArrowRight className="w-6 h-6 text-purple-600" />,
                    title: 'Ask Questions',
                    description: 'Chat with your documents in natural language to find specific information instantly.',
                    color: 'bg-white',
                    hoverBg: 'hover:bg-purple-50',
                    border: 'border-gray-200',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-600',
                    delay: 0.3
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: feature.delay, duration: 0.5 }}
                    className={`group ${feature.color} ${feature.hoverBg} border ${feature.border} rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300`}
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {React.cloneElement(feature.icon, { className: `w-6 h-6 ${feature.iconColor}` })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
                  <div className="w-full max-w-5xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your documents?</h3>
                    <p className="text-blue-100 text-lg mb-8">Join thousands of users who save hours every week with our AI-powered document analysis.</p>
                    <button
                      onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center mx-auto"
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-lg font-medium text-gray-700">Processing your document</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8 shadow-sm"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleNewUpload}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <UploadIcon className="-ml-1 mr-2 h-4 w-4" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {text && summary && !loading && (
            <motion.div 
              ref={summaryRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div className="w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden border border-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="p-6 md:p-8">
                  <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Document Summary</h2>
                      <p className="text-gray-500 mt-1">AI-generated insights from your document</p>
                    </div>
                    <button
                      onClick={handleNewUpload}
                      className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                    >
                      <UploadIcon className="w-4 h-4" />
                      <span>New Document</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-inner border border-blue-100/50 transition-all duration-300 hover:shadow-lg hover:border-blue-200/70 hover:scale-[1.01]"
                      whileHover={{ 
                        y: -3,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
                          <div className="prose prose-blue max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                              {summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="mt-8 pt-6 border-t border-gray-100/50">
                      <button
                        onClick={() => setShowQASection(true)}
                        className="group w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <MessageSquare className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                        Chat with Document
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                      
                      <p className="mt-3 text-center text-sm text-gray-500">
                        Ask questions or get more insights about your document
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </Layout>
  );
}

export default App;