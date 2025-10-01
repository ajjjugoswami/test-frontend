import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
   Chip,
} from '@mui/material';
import {
  Code,
  Eye,
  Download,
  Copy,
  ExternalLink,
  RefreshCw,
  Save,
  Edit3,
} from 'lucide-react';
import { GeneratedHTML } from '../types/htmlGenerator';

interface CodeEditorPreviewProps {
  html: GeneratedHTML;
  onDownload?: (html: GeneratedHTML) => void;
  onCopyCode?: (code: string) => void;
  onHtmlChange?: (newHtml: string) => void;
}

const CodeEditorPreview: React.FC<CodeEditorPreviewProps> = ({
  html,
  onDownload,
  onCopyCode,
  onHtmlChange,
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [editedHtml, setEditedHtml] = useState(html.html);
  const [hasChanges, setHasChanges] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  const currentHtml = hasChanges ? editedHtml : html.html;

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(currentHtml);
        doc.close();
      }
    }
  };

  React.useEffect(() => {
    if (activeView === 'preview') {
      updatePreview();
    }
  }, [currentHtml, activeView]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentHtml);
      onCopyCode?.(currentHtml);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${html.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (hasChanges) {
      const updatedHtml = { ...html, html: editedHtml };
      onDownload?.(updatedHtml);
    } else {
      onDownload?.(html);
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(currentHtml);
      newWindow.document.close();
    }
  };

  const handleSaveChanges = () => {
    onHtmlChange?.(editedHtml);
    setHasChanges(false);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedHtml(value);
      setHasChanges(value !== html.html);
    }
  };

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
    updatePreview();
  };

  const onEditorMount = (editor: any) => {
    editorRef.current = editor;
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {html.name}
            </Typography>
            {hasChanges && (
              <Chip 
                label="Modified" 
                size="small" 
                color="warning" 
                variant="outlined"
                icon={<Edit3 size={12} />}
              />
            )}
          </Box>
          
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* View Toggle Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
            <Tooltip title="Preview">
              <IconButton 
                size="small" 
                onClick={() => setActiveView('preview')}
                sx={{ 
                  backgroundColor: activeView === 'preview' ? '#e3f2fd' : 'transparent',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Code Editor">
              <IconButton 
                size="small" 
                onClick={() => setActiveView('code')}
                sx={{ 
                  backgroundColor: activeView === 'code' ? '#e3f2fd' : 'transparent',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Code size={16} />
              </IconButton>
            </Tooltip>
          </Box>

          {hasChanges && (
            <Tooltip title="Save Changes">
              <Button
                variant="contained"
                size="small"
                startIcon={<Save size={14} />}
                onClick={handleSaveChanges}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
            </Tooltip>
          )}
          
          <Tooltip title="Refresh Preview">
            <IconButton size="small" onClick={refreshPreview}>
              <RefreshCw size={16} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Open in New Tab">
            <IconButton size="small" onClick={handleOpenInNewTab}>
              <ExternalLink size={16} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={copySuccess ? "Copied!" : "Copy HTML Code"}>
            <IconButton size="small" onClick={handleCopyCode}>
              {copySuccess ? <span style={{ color: 'green' }}>✓</span> : <Copy size={16} />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<Download size={14} />}
            onClick={handleDownload}
            sx={{ ml: 1 }}
          >
            Download HTML
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeView === 'code' ? (
          // Code Editor View
          <Box sx={{ height: '100%' }}>
            <Editor
              height="100%"
              defaultLanguage="html"
              value={editedHtml}
              onChange={handleEditorChange}
              onMount={onEditorMount}
              theme="vs"
              options={{
                fontSize: 14,
                lineHeight: 20,
                wordWrap: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: true,
                folding: true,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorBlinking: 'blink',
                cursorStyle: 'line',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
              }}
            />
          </Box>
        ) : (
          // Live Preview View
          <Box sx={{ 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff'
          }}>
            <Box sx={{ 
              p: 1, 
              backgroundColor: '#f5f5f5', 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Eye size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>
                Live Preview
              </Typography>
              {hasChanges && (
                <Typography variant="caption" sx={{ color: '#ed6c02', fontStyle: 'italic' }}>
                  (showing your edits)
                </Typography>
              )}
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <iframe
                key={previewKey}
                ref={iframeRef}
                title={`${html.name} Preview`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'white'
                }}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer Info */}
      <Box sx={{ 
        p: 1, 
        backgroundColor: '#f5f5f5', 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          {html.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {currentHtml.length} characters • {currentHtml.split('\n').length} lines
          {hasChanges && ' • Modified'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeEditorPreview;