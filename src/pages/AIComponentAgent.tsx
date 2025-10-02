import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Upload,
  Link as LinkIcon,
  FileText as Description,
  Sparkles as AutoAwesome,
  X as Clear,
  History,
  Settings
} from 'lucide-react';
import {
  HTMLInput,
  HTMLRequirements,
  GeneratedHTML,
  HTMLGeneratorConfig,
  GenerationProgress
} from '../types/htmlGenerator';
import HTMLGenerator from '../services/htmlGenerator';
import CodeEditorPreview from '../components/CodeEditorPreview';
import { AI_PROVIDERS, getModelsByProvider, isProviderConfigured } from '../constants/aiProviders';
 
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`input-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 1.5 }}>{children}</Box>}
    </div>
  );
}

/**
 * Main AI Agent interface for generating React components
 */
const AIComponentAgent: React.FC = () => {
  // Core state
  const [activeTab, setActiveTab] = useState(0);
  const [generatedHTML, setGeneratedHTML] = useState<GeneratedHTML | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Input states
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [textDescription, setTextDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);

  // Component configuration
  const [componentName, setComponentName] = useState('MyComponent');
  const [componentRequirements, setComponentRequirements] = useState<HTMLRequirements>({
    name: 'MyComponent',
    framework: 'vanilla',
    reactFramework: 'styled-components',
    responsive: true,
    animations: false,
    interactive: false
  });

  // AI configuration
  const [aiConfig, setAiConfig] = useState<HTMLGeneratorConfig>({
    provider: 'google',
    model: 'gemini-2.0-flash-exp',
    temperature: 0.7,
    maxTokens: 4000,
    framework: 'vanilla'
  });

  // Services - will be recreated when config changes
  // Figma service would be initialized here when needed

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const handleRequirementChange = useCallback((index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  }, [requirements]);

  const addRequirement = useCallback(() => {
    setRequirements([...requirements, '']);
  }, [requirements]);

  const removeRequirement = useCallback((index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  }, [requirements]);

  const generateHTML = useCallback(async () => {
    if (!componentName.trim()) {
      setError('Please enter a component name');
      return;
    }

    let input: HTMLInput;

    // Prepare input based on active tab
    switch (activeTab) {
      case 0: // Figma
        if (!figmaUrl.trim()) {
          setError('Please enter a Figma URL');
          return;
        }
        input = { type: 'figma', url: figmaUrl, description: `Figma design: ${figmaUrl}` };
        break;

      case 1: // Image
        if (!selectedImage) {
          setError('Please select an image');
          return;
        }
        input = { type: 'image', file: selectedImage, description: imageDescription };
        break;

      case 2: // Text
        if (!textDescription.trim()) {
          setError('Please enter a description');
          return;
        }
        input = {
          type: 'text',
          description: textDescription,
          requirements: requirements.filter(r => r.trim())
        };
        break;

      default:
        setError('Invalid input type');
        return;
    }

    const currentRequirements = { ...componentRequirements, name: componentName };

    try {
      setIsGenerating(true);
      setError(null);
      setProgress({ phase: 'starting', message: 'Starting HTML generation...', progress: 0 });

      // Set up progress callback
      const progressCallback = (phase: string, message: string, progress: number) => {
        setProgress({ phase, message, progress });
      };

      const generatorWithProgress = new HTMLGenerator({
        ...aiConfig,
        onProgress: progressCallback
      });

      // Generate HTML
      const html = await generatorWithProgress.generateHTML(input, currentRequirements);
      setGeneratedHTML(html);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [
    activeTab,
    componentName,
    figmaUrl,
    figmaToken,
    selectedImage,
    imageDescription,
    textDescription,
    requirements,
    componentRequirements,
    aiConfig
  ]);

  const handleSaveHTML = useCallback((html: GeneratedHTML) => {
    console.log('Saving HTML:', html.name);
    // HTML download logic is handled in the preview component
  }, []);

  const resetForm = useCallback(() => {
    setFigmaUrl('');
    setSelectedImage(null);
    setImageDescription('');
    setTextDescription('');
    setRequirements(['']);
    setGeneratedHTML(null);
    setError(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ 
        px: 2, 
        py: 1.5, 
        borderBottom: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
            AI Component Generator
          </Typography>
         
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={resetForm} 
            title="Clear All"
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <Clear size={20} />
          </IconButton>
          <IconButton 
            title="View History"
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <History size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Paper 
          elevation={0} 
          sx={{ 
            width: 340,
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2.5, flex: 1, overflow: 'auto' }}>
           
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                mb: 2,
                '& .MuiTabs-root': {
                  borderRadius: '8px',
                },
                '& .MuiTabs-indicator': {
                  height: 2,
                  borderRadius: '2px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  minHeight: 40,
                  minWidth: 0,
                  flex: 1,
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#667eea',
                  },
                  '&:hover': {
                    color: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  }
                }
              }}
            >
              <Tab icon={<LinkIcon size={16} />} label="Figma" />
              <Tab icon={<Upload size={16} />} label="Image" />
              <Tab icon={<Description size={16} />} label="Text" />
              <Tab icon={<Settings size={16} />} label="Config" />
            </Tabs>

              {/* Figma Input */}
              <TabPanel value={activeTab} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Figma URL"
                    placeholder="https://www.figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: '#667eea',
                        }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Figma Access Token (Optional)"
                    placeholder="For detailed analysis"
                    value={figmaToken}
                    onChange={(e) => setFigmaToken(e.target.value)}
                    helperText="Get token from Figma Settings > Account > Personal access tokens"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: '#667eea',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#64748b',
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </TabPanel>

              {/* Image Input */}
              <TabPanel value={activeTab} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Upload size={20} />}
                    onClick={() => fileInputRef.current?.click()}
                    fullWidth
                    sx={{
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#667eea',
                        color: '#667eea',
                        backgroundColor: '#f1f5f9',
                      }
                    }}
                  >
                    {selectedImage ? selectedImage.name : 'Upload Image'}
                  </Button>
                  {selectedImage && (
                    <Paper sx={{ 
                      p: 2.5, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      boxShadow: 'none'
                    }}>
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {selectedImage.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Additional Description (Optional)"
                    placeholder="Describe specific aspects of the design..."
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: '#667eea',
                        }
                      }
                    }}
                  />
                </Box>
              </TabPanel>

              {/* Text Input */}
              <TabPanel value={activeTab} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Component Description"
                    placeholder="Describe the component you want to create..."
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: '#667eea',
                        }
                      }
                    }}
                  />
                  
                  <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 600, mt: 1 }}>
                    Additional Requirements:
                  </Typography>
                  {requirements.map((req, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter requirement..."
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '6px',
                            backgroundColor: '#f8fafc',
                            fontSize: '0.875rem',
                            '& fieldset': {
                              borderColor: '#e2e8f0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#667eea',
                              borderWidth: '2px',
                            },
                          }
                        }}
                      />
                      {requirements.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeRequirement(index)}
                          sx={{
                            color: '#64748b',
                            '&:hover': {
                              color: '#dc2626',
                              backgroundColor: '#fef2f2'
                            }
                          }}
                        >
                          <Clear size={16} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    size="small"
                    onClick={addRequirement}
                    sx={{ 
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#667eea',
                      '&:hover': {
                        backgroundColor: '#f1f5f9'
                      }
                    }}
                  >
                    Add Requirement
                  </Button>
                </Box>
              </TabPanel>

              {/* Configuration Tab */}
              <TabPanel value={activeTab} index={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Component Name"
                    value={componentName}
                    onChange={(e) => {
                      const name = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                      setComponentName(name);
                      setComponentRequirements(prev => ({ ...prev, name }));
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: '#667eea',
                        }
                      }
                    }}
                  />
                  
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 1, mb: 0.5 }}>
                    AI Configuration
                  </Typography>
                  
                  <FormControl fullWidth size="small">
                  
                    <Select
                      value={aiConfig.provider}
                      onChange={(e) => {
                        const newProvider = e.target.value as 'google' | 'perplexity';
                        const availableModels = getModelsByProvider(newProvider);
                        const defaultModel = availableModels.length > 0 ? availableModels[0].id : '';
                        setAiConfig(prev => ({
                          ...prev,
                          provider: newProvider,
                          model: defaultModel
                        }));
                      }}
                      sx={{
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      }}
                    >
                      {AI_PROVIDERS.map(provider => (
                        <MenuItem 
                          key={provider.id} 
                          value={provider.id}
                          disabled={!isProviderConfigured(provider.id)}
                        >
                          {provider.name} {!isProviderConfigured(provider.id) && '(Not Configured)'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small">
                    
                    <Select
                      value={aiConfig.model}
                      onChange={(e) => setAiConfig(prev => ({
                        ...prev,
                        model: e.target.value
                      }))}
                      sx={{
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      }}
                    >
                      {getModelsByProvider(aiConfig.provider).map(model => (
                        <MenuItem key={model.id} value={model.id}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {model.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {model.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 1, mb: 0.5 }}>
                    HTML Framework
                  </Typography>
                  
                  <FormControl fullWidth size="small">
                    
                    <Select
                      value={componentRequirements.framework}
                      onChange={(e) => setComponentRequirements(prev => ({
                        ...prev,
                        framework: e.target.value as any
                      }))}
                      sx={{
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      }}
                    >
                      <MenuItem value="vanilla">Vanilla HTML/CSS/JS</MenuItem>
                      <MenuItem value="bootstrap">Bootstrap 5</MenuItem>
                      <MenuItem value="tailwind">Tailwind CSS</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 2, mb: 0.5 }}>
                    React Framework
                  </Typography>
                  
                  <FormControl fullWidth size="small">
                    <Select
                      value={componentRequirements.reactFramework}
                      onChange={(e) => setComponentRequirements(prev => ({
                        ...prev,
                        reactFramework: e.target.value as any
                      }))}
                      sx={{
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      }}
                    >
                      <MenuItem value="styled-components">Styled Components</MenuItem>
                      <MenuItem value="mui">Material-UI (MUI)</MenuItem>
                      <MenuItem value="antd">Ant Design</MenuItem>
                      <MenuItem value="tailwind">Tailwind CSS</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 1, mb: 0.5 }}>
                    HTML Features
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, pl: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={componentRequirements.responsive}
                          onChange={(e) => setComponentRequirements(prev => ({
                            ...prev,
                            responsive: e.target.checked
                          }))}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              '&.Mui-checked': {
                                color: '#667eea',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: '#667eea',
                                  opacity: 0.7,
                                },
                              },
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#cbd5e1',
                            },
                          }}
                        />
                      }
                      label="Responsive Design"
                      sx={{ '& .MuiFormControlLabel-label': { color: '#64748b', fontWeight: 500, fontSize: '0.875rem' } }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={componentRequirements.animations}
                          onChange={(e) => setComponentRequirements(prev => ({
                            ...prev,
                            animations: e.target.checked
                          }))}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              '&.Mui-checked': {
                                color: '#667eea',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: '#667eea',
                                  opacity: 0.7,
                                },
                              },
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#cbd5e1',
                            },
                          }}
                        />
                      }
                      label="Animations & Transitions"
                      sx={{ '& .MuiFormControlLabel-label': { color: '#64748b', fontWeight: 500, fontSize: '0.875rem' } }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={componentRequirements.interactive}
                          onChange={(e) => setComponentRequirements(prev => ({
                            ...prev,
                            interactive: e.target.checked
                          }))}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              '&.Mui-checked': {
                                color: '#667eea',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: '#667eea',
                                  opacity: 0.7,
                                },
                              },
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#cbd5e1',
                            },
                          }}
                        />
                      }
                      label="JavaScript Interactions"
                      sx={{ '& .MuiFormControlLabel-label': { color: '#64748b', fontWeight: 500, fontSize: '0.875rem' } }}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 2, mb: 0.5 }}>
                    API Status
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, pl: 1 }}>
                    {AI_PROVIDERS.map(provider => (
                      <Box key={provider.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: isProviderConfigured(provider.id) ? '#10b981' : '#ef4444',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {provider.name}: {isProviderConfigured(provider.id) ? 'Configured' : 'Not Configured'}
                        </Typography>
                      </Box>
                    ))}
                    
                    {!isProviderConfigured('google') && !isProviderConfigured('perplexity') && (
                      <Alert severity="warning" sx={{ mt: 1, fontSize: '0.75rem' }}>
                        <Typography variant="caption">
                          No AI providers configured. Please add VITE_GOOGLE_API_KEY or VITE_PERPLEXITY_API_KEY to your .env file.
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            </Box>
            
            {/* Generate Button at Bottom - Hidden on Config tab */}
            {activeTab !== 3 && (
              <Box sx={{ p: 2.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoAwesome size={20} />}
                  onClick={generateHTML}
                  disabled={isGenerating}
                  fullWidth
                sx={{ 
                  py: 1.2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 3px 10px 0 rgba(102, 126, 234, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.35)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: '#cbd5e1',
                    color: '#94a3b8'
                  }
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate HTML'}
              </Button>
              
              {/* Generation Progress */}
              {(isGenerating || progress) && (
                <Box sx={{ 
                  mt: 2,
                  p: 2,
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Typography variant="caption" gutterBottom sx={{ color: '#64748b', fontWeight: 500, display: 'block' }}>
                    {progress?.message || 'Initializing...'}
                  </Typography>
                  <LinearProgress 
                    variant={progress ? 'determinate' : 'indeterminate'}
                    value={progress?.progress || 0}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#667eea',
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Error Display */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: '6px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    fontSize: '0.8rem',
                    '& .MuiAlert-icon': {
                      color: '#dc2626'
                    },
                    '& .MuiAlert-message': {
                      color: '#991b1b'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
            )}
          </Box>
        </Paper>
        
        {/* Main Preview Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {generatedHTML ? (
            <CodeEditorPreview
              html={generatedHTML}
              reactFramework={componentRequirements.reactFramework}
              onDownload={handleSaveHTML}
              onCopyCode={(code) => console.log('Code copied:', code)}
              onHtmlChange={(newHtml) => {
                setGeneratedHTML(prev => prev ? { ...prev, html: newHtml } : null);
              }}
              isGenerating={isGenerating}
            />
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary',
              flexDirection: 'column',
              gap: 2
            }}>
              <AutoAwesome size={48} style={{ opacity: 0.3 }} />
              <Typography variant="h6">Generate HTML to see preview</Typography>
              <Typography variant="body2">Choose an input method and click Generate HTML</Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const testHTML: GeneratedHTML = {
                    id: 'test-sample',
                    name: 'SampleCard',
                    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Card Component</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            transform: translateY(0);
            transition: all 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .card h1 {
            color: #333;
            margin: 0 0 10px 0;
            font-size: 2rem;
        }
        .card p {
            color: #666;
            margin: 0 0 25px 0;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0 10px;
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
            background: transparent;
            border: 2px solid #667eea;
            color: #667eea;
        }
        .btn-secondary:hover {
            background: #667eea;
            color: white;
        }
        @media (max-width: 480px) {
            .card {
                margin: 20px;
                padding: 20px;
            }
            .btn {
                display: block;
                margin: 10px 0;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 Hello World!</h1>
        <p>This is a beautiful sample card component with modern styling, hover effects, and responsive design. Click the buttons to test interactions!</p>
        <button class="btn" onclick="showAlert()">Click Me!</button>
        <button class="btn btn-secondary" onclick="changeColor()">Change Color</button>
    </div>

    <script>
        function showAlert() {
            alert('Hello from the sample HTML component! 🎉');
        }
        
        function changeColor() {
            const card = document.querySelector('.card');
            const colors = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = randomColor;
        }
    </script>
</body>
</html>`,
                    description: 'A beautiful sample card component with animations and interactions',
                    features: ['Responsive Design', 'CSS Animations', 'JavaScript Interactions', 'Modern Styling', 'Hover Effects'],
                    createdAt: new Date(),
                    metadata: {
                      inputType: 'text',
                      originalInput: { type: 'text', description: 'Create a sample card component' },
                      aiModel: 'Sample Generator',
                      generationTime: 0
                    }
                  };
                  setGeneratedHTML(testHTML);
                }}
                sx={{ mt: 2 }}
              >
                Try Sample HTML
              </Button>

            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AIComponentAgent;