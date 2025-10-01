import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedHTML, HTMLInput, HTMLRequirements, HTMLGeneratorConfig } from '../types/htmlGenerator';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');

class HTMLGenerator {
  private config: HTMLGeneratorConfig;

  constructor(config?: Partial<HTMLGeneratorConfig>) {
    this.config = {
      model: 'gemini-2.0-flash-exp',
      temperature: 0.7,
      maxTokens: 4000,
      framework: 'vanilla',
      ...config,
    };
  }

  private updateProgress(phase: string, message: string, progress: number): void {
    this.config.onProgress?.(phase, message, progress);
  }

  private isConfigured(): boolean {
    return Boolean(import.meta.env.VITE_GOOGLE_API_KEY);
  }

  async generateHTML(
    input: HTMLInput,
    requirements: HTMLRequirements
  ): Promise<GeneratedHTML> {
    if (!this.isConfigured()) {
      throw new Error('AI service is not configured. Please set your Google AI API key.');
    }

    const startTime = Date.now();

    try {
      this.updateProgress('analyzing', 'Analyzing input...', 10);
      
      // Analyze the input and create context
      const context = await this.analyzeInput(input);
      
      this.updateProgress('generating', 'Generating HTML code...', 40);
      
      // Generate the HTML code
      const generatedHTML = await this.generateCode(context, requirements);
      
      this.updateProgress('complete', 'HTML generated successfully!', 100);
      
      const generationTime = Date.now() - startTime;
      
      return {
        id: this.generateId(),
        name: requirements.name,
        html: generatedHTML,
        description: input.description,
        features: this.extractFeatures(generatedHTML, requirements),
        createdAt: new Date(),
        metadata: {
          inputType: input.type,
          originalInput: input,
          aiModel: this.config.model,
          generationTime,
        }
      };
      
    } catch (error) {
      this.updateProgress('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
      throw error;
    }
  }

  private async analyzeInput(input: HTMLInput): Promise<string> {
    switch (input.type) {
      case 'figma':
        return this.analyzeFigmaInput(input as HTMLInput & { type: 'figma' });
      case 'image':
        return this.analyzeImageInput(input as HTMLInput & { type: 'image' });
      case 'text':
        return this.analyzeTextInput(input as HTMLInput & { type: 'text' });
      default:
        throw new Error(`Unsupported input type: ${(input as any).type}`);
    }
  }

  private async analyzeFigmaInput(input: HTMLInput & { type: 'figma' }): Promise<string> {
    const figmaId = this.extractFigmaId(input.url || '');
    return `Figma design with ID: ${figmaId}. Create an HTML page based on this Figma design. ${input.description}`;
  }

  private async analyzeImageInput(input: HTMLInput & { type: 'image' }): Promise<string> {
    const model = genAI.getGenerativeModel({ model: this.config.model });
    
    // Convert file to base64
    const base64Data = await this.fileToBase64(input.file!);
    
    const prompt = `Analyze this UI/design image and describe the layout, components, and visual elements in detail for HTML/CSS recreation. Focus on:
    1. Overall layout structure and sections
    2. Visual styling (colors, typography, spacing, shadows)
    3. Interactive elements (buttons, forms, navigation)
    4. Images and media elements
    5. Any animations or hover effects visible
    
    Additional context: ${input.description || 'No additional description provided'}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: input.file!.type,
          data: base64Data,
        },
      },
    ]);

    return result.response.text();
  }

  private async analyzeTextInput(input: HTMLInput & { type: 'text' }): Promise<string> {
    const requirements = input.requirements?.join('\n- ') || '';
    return `${input.description}\n\nAdditional requirements:\n- ${requirements}`;
  }

  private async generateCode(context: string, requirements: HTMLRequirements): Promise<string> {
    const model = genAI.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const frameworkInstructions = this.getFrameworkInstructions(requirements.framework);

    const prompt = `You are an expert web developer. Create a complete, standalone HTML file based on the following requirements:

CONTEXT:
${context}

REQUIREMENTS:
- Page/Component name: ${requirements.name}
- Framework: ${requirements.framework}
- Responsive design: ${requirements.responsive}
- Include animations: ${requirements.animations}
- Interactive elements: ${requirements.interactive}

TECHNICAL REQUIREMENTS:
- Create ONE complete HTML file with everything inline
- Include ALL CSS in <style> tags in the <head>
- Include ALL JavaScript in <script> tags (if needed)
- Use semantic HTML5 elements
- Ensure the page is fully functional and self-contained
- Add proper meta tags for responsive design
${requirements.responsive ? '- Implement responsive design with CSS media queries' : ''}
${requirements.animations ? '- Include smooth CSS animations and transitions' : ''}
${requirements.interactive ? '- Add JavaScript for interactive functionality' : ''}

FRAMEWORK INSTRUCTIONS:
${frameworkInstructions}

IMPORTANT: 
- Return ONLY the complete HTML code, no explanations
- Everything must be in ONE file (no external dependencies except CDN links if absolutely necessary)
- Use modern HTML5, CSS3, and vanilla JavaScript
- Ensure the code is clean, well-commented, and production-ready
- Add proper doctype, lang attribute, and meta tags

Generate the complete HTML file:`;

    const result = await model.generateContent(prompt);
    let htmlCode = result.response.text();
    
    // Clean up the response
    htmlCode = htmlCode.replace(/```html\n?/g, '').replace(/```/g, '').trim();
    
    // Ensure it starts with <!DOCTYPE html>
    if (!htmlCode.toLowerCase().startsWith('<!doctype html>')) {
      if (htmlCode.toLowerCase().startsWith('<html')) {
        htmlCode = '<!DOCTYPE html>\n' + htmlCode;
      }
    }
    
    return htmlCode;
  }

  private getFrameworkInstructions(framework: HTMLRequirements['framework']): string {
    switch (framework) {
      case 'bootstrap':
        return `- Use Bootstrap 5 CSS framework via CDN
- Include Bootstrap CSS: <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
- Include Bootstrap JS if needed: <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
- Use Bootstrap classes for layout, components, and utilities
- Follow Bootstrap design system and component patterns`;
      
      case 'tailwind':
        return `- Use Tailwind CSS via CDN
- Include Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- Use Tailwind utility classes for all styling
- Follow Tailwind design principles and responsive patterns
- Use Tailwind's color palette and spacing system`;
      
      case 'vanilla':
      default:
        return `- Use pure HTML, CSS, and JavaScript (no external frameworks)
- Write custom CSS with modern features (Grid, Flexbox, CSS Variables)
- Use CSS custom properties for theming
- Implement responsive design with CSS media queries
- Keep all code self-contained and framework-free`;
    }
  }

  private extractFeatures(html: string, requirements: HTMLRequirements): string[] {
    const features: string[] = [];
    
    // Analyze the HTML to extract features
    if (html.includes('<nav') || html.includes('navigation')) features.push('Navigation');
    if (html.includes('<form') || html.includes('input')) features.push('Forms');
    if (html.includes('<button') || html.includes('onclick')) features.push('Interactive Elements');
    if (html.includes('@media') || html.includes('responsive')) features.push('Responsive Design');
    if (html.includes('animation') || html.includes('transition')) features.push('Animations');
    if (html.includes('<img') || html.includes('background-image')) features.push('Images');
    if (html.includes('grid') || html.includes('flexbox') || html.includes('flex')) features.push('Modern Layout');
    if (html.includes('addEventListener') || html.includes('function')) features.push('JavaScript Functionality');
    
    // Add requirement-based features
    if (requirements.responsive) features.push('Mobile Responsive');
    if (requirements.animations) features.push('CSS Animations');
    if (requirements.interactive) features.push('User Interactions');
    
    return [...new Set(features)]; // Remove duplicates
  }

  private extractFigmaId(url: string): string {
    const match = url.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : 'unknown';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default HTMLGenerator;