const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProblem = async ({ topics, rating, suggestion }) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.7,  // Reduced for more predictable JSON output
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Create a comprehensive, detailed prompt for Gemini
    const prompt = `You are an expert competitive programming problem creator with deep knowledge of algorithms, data structures, and problem-solving techniques. Your task is to generate a UNIQUE, COMPLETE, and INTERESTING competitive programming problem.

**Problem Generation Requirements:**

**TOPICS:** ${topics.join(', ')}
**DIFFICULTY RATING:** ${rating} (Codeforces rating scale: 800=Beginner, 1000-1200=Easy, 1400-1600=Medium, 1800-2000=Hard, 2000+=Expert)
${suggestion ? `**CUSTOM STORY/THEME:** ${suggestion}` : '**STYLE:** Create a standard algorithmic problem with clear technical requirements'}

**CRITICAL INSTRUCTIONS:**

1. **UNIQUENESS:** Create an ORIGINAL problem that doesn't copy existing problems. Use creative scenarios, unique constraints, or interesting twists. Make it memorable and distinct.

2. **COMPLETENESS:** The problem must be fully solvable with:
   - Clear, unambiguous problem statement
   - Well-defined input/output format
   - Realistic constraints matching the difficulty level
   - Edge cases properly handled

3. **DIFFICULTY ALIGNMENT:** 
   - Rating ${rating}: Ensure the algorithmic complexity, mathematical concepts, and implementation difficulty match this rating level
   - Use appropriate data structures and algorithms for ${rating} level
   - ${parseInt(rating) <= 1000 ? 'Keep it straightforward with basic concepts' : parseInt(rating) <= 1400 ? 'Include moderate algorithmic thinking' : parseInt(rating) <= 1800 ? 'Require advanced techniques and optimizations' : 'Demand expert-level insights and complex implementations'}

4. **TOPIC INTEGRATION:** Naturally incorporate all selected topics: ${topics.join(', ')}. The solution should clearly require understanding of these topics.

5. **INTERESTING ELEMENTS:**
   ${suggestion ? '- Integrate the custom story/theme creatively into the problem context' : '- Add an engaging narrative or real-world scenario'}
   - Include interesting mathematical properties or patterns
   - Create non-trivial examples that demonstrate key insights
   - Make the problem intellectually satisfying to solve

**OUTPUT FORMAT (JSON):**
Respond with a valid JSON object with this EXACT structure:

CRITICAL: 
- Respond ONLY with valid JSON - no extra text before or after
- All strings must be properly escaped for JSON
- Use \\n for newlines within string values, not literal line breaks
- Escape all special characters: use \\" for quotes, \\\\ for backslashes
- Do NOT include any markdown formatting, code blocks, or explanatory text
- Ensure the JSON is complete and properly closed
- Remove any trailing commas before closing brackets
- Each string value must be complete and properly terminated with a quote
- If a value gets too long, summarize - do not exceed token limits mid-string

{
  "title": "Creative Problem Title (should be catchy and hint at the concept)",
  "description": "Complete problem statement in 3-5 paragraphs:\\n\\nParagraph 1: Story/context and problem setup\\n\\nParagraph 2-3: Detailed problem description, what needs to be computed/solved\\n\\nParagraph 4: Input format specification\\n\\nParagraph 5: Output format specification\\n\\nMake it engaging, clear, and technically precise. Use \\n\\n for paragraph breaks.",
  
  "examples": [
    {
      "input": "Exact input format as specified",
      "output": "Expected output",
      "explanation": "Detailed step-by-step explanation of why this is the answer, showing the algorithm/logic"
    },
    // Provide 3-5 diverse examples covering: basic case, edge case, medium complexity, and tricky case
  ],
  
  "constraints": "List all constraints clearly:\\n• Input size constraints (e.g., 1 ≤ n ≤ 10^5)\\n• Value constraints (e.g., 1 ≤ arr[i] ≤ 10^9)\\n• Time limit: [X] seconds\\n• Memory limit: [X] MB\\n• Any special constraints specific to the problem\\n\\nEnsure constraints are realistic for ${rating} rating and allow the intended solution to pass.",
  
  "hints": [
    "Subtle hint 1 pointing toward a key observation (keep under 150 chars)",
    "Hint 2 suggesting the right approach or data structure (keep under 150 chars)",
    "Hint 3 addressing a common pitfall or optimization (keep under 150 chars)"
  ],
  
  "tags": ["List", "All", "Relevant", "Algorithm/Data Structure", "Tags"],
  
  "difficulty": "${rating}",
  
  "timeComplexity": "Expected optimal solution time complexity (e.g., O(n log n))",
  
  "spaceComplexity": "Expected optimal solution space complexity (e.g., O(n))",
  
  "testCaseCount": "Number between 5-10 based on complexity",
  
  "approach": "Brief 2-3 sentence description of the intended solution approach without giving away complete implementation (keep under 300 chars).",
  
  "keyInsights": [
    "Critical insight 1 that leads to the solution (keep concise, under 200 chars)",
    "Critical insight 2 about optimization or correctness (keep concise, under 200 chars)",
    "Any mathematical property or pattern to observe (keep concise, under 200 chars)"
  ]
}

**QUALITY CHECKLIST:**
✓ Problem is original and creative
✓ Difficulty matches rating ${rating}
✓ All topics ${topics.join(', ')} are naturally integrated
✓ Examples are diverse and educational
✓ Constraints are realistic and well-balanced
✓ Problem statement is crystal clear and unambiguous
✓ Solution approach exists and matches stated complexity
✓ Problem is interesting and intellectually engaging
${suggestion ? '✓ Custom story/theme is naturally woven into the problem' : '✓ Problem has engaging narrative context'}

FINAL REMINDER: 
- Output ONLY valid, parseable JSON
- Start with { and end with }
- No markdown formatting
- No additional text before or after the JSON
- Keep all string values concise to avoid truncation
- Ensure all quotes are properly escaped
- Test your JSON mentally before outputting

Generate the problem now as a single, valid JSON object.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            examples: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  input: { type: "string" },
                  output: { type: "string" },
                  explanation: { type: "string" }
                },
                required: ["input", "output", "explanation"]
              }
            },
            constraints: { type: "string" },
            hints: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
            difficulty: { type: "string" },
            timeComplexity: { type: "string" },
            spaceComplexity: { type: "string" },
            testCaseCount: { type: "string" },
            approach: { type: "string" },
            keyInsights: { type: "array", items: { type: "string" } }
          },
          required: ["title", "description", "examples", "constraints", "timeComplexity", "spaceComplexity"]
        }
      }
    });
    const response = await result.response;
    const text = response.text();

    console.log('Raw AI response (first 500 chars):', text.substring(0, 500));
    console.log('Raw AI response (last 500 chars):', text.substring(Math.max(0, text.length - 500)));

    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/```\n?$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/```\n?$/, '');
    }

    jsonText = jsonText.trim();
    
    // Find the last closing brace
    const lastBraceIndex = jsonText.lastIndexOf('}');
    if (lastBraceIndex !== -1 && lastBraceIndex < jsonText.length - 1) {
      jsonText = jsonText.substring(0, lastBraceIndex + 1);
    }

    let problemData;
    try {
      problemData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Error position:', parseError.message);
      console.error('Full raw response length:', text.length);
      console.error('Cleaned JSON (first 1000 chars):', jsonText.substring(0, 1000));
      console.error('Cleaned JSON (last 500 chars):', jsonText.substring(Math.max(0, jsonText.length - 500)));
      
      // Try more aggressive cleaning
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          let cleanJson = jsonMatch[0].trim();
          
          // Remove markdown if present
          cleanJson = cleanJson.replace(/^```json\n?/, '').replace(/```\n?$/, '');
          cleanJson = cleanJson.trim();
          
          const lastBrace = cleanJson.lastIndexOf('}');
          if (lastBrace !== -1 && lastBrace < cleanJson.length - 1) {
            cleanJson = cleanJson.substring(0, lastBrace + 1);
          }
          
          console.log('Attempting fallback parse with cleaned JSON (first 500 chars):', cleanJson.substring(0, 500));
          problemData = JSON.parse(cleanJson);
        } catch (fallbackError) {
          console.error('Fallback parse failed:', fallbackError);
          
          // Last resort: try using JSON5 approach - be very lenient
          try {
            let fixedJson = jsonMatch[0].trim();
            fixedJson = fixedJson.replace(/^```json\n?/, '').replace(/```\n?$/, '');
            
            // Remove trailing commas
            fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
            
            // Find and truncate at last complete closing brace
            const lastBrace = fixedJson.lastIndexOf('}');
            if (lastBrace !== -1) {
              fixedJson = fixedJson.substring(0, lastBrace + 1);
            }
            
            console.log('Attempting final fallback parse (first 500 chars):', fixedJson.substring(0, 500));
            problemData = JSON.parse(fixedJson);
          } catch (finalError) {
            console.error('All parsing attempts failed:', finalError);
            // Save the problematic JSON to help debug
            console.error('=== FULL PROBLEMATIC JSON (for debugging) ===');
            console.error(jsonText);
            console.error('=== END OF PROBLEMATIC JSON ===');
            throw new Error('Failed to parse AI response. The response contains invalid JSON format. Please try again.');
          }
        }
      } else {
        throw new Error('No valid JSON found in AI response. Please try again.');
      }
    }

    // Validate required fields
    if (!problemData.title || !problemData.description || !problemData.examples) {
      throw new Error('Generated problem is missing required fields');
    }

    return problemData;

  } catch (error) {
    console.error('Error generating problem with Gemini:', error);
    throw new Error('Failed to generate problem: ' + error.message);
  }
};

const generateSolution = async ({ problemTitle, problemDescription, examples, constraints, timeComplexity, spaceComplexity, topics, rating }) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Ensure safe string handling
    const safeDescription = (problemDescription || '').substring(0, 600);
    const safeConstraints = (constraints || '').substring(0, 200);
    const safeExamples = Array.isArray(examples) ? examples.slice(0, 2) : [];

    // Create a concise prompt to avoid truncation
    const prompt = `Generate solution for: ${problemTitle}

Problem: ${safeDescription}

Examples:
${safeExamples.map((ex, i) => `${i + 1}. Input: ${ex.input}\nOutput: ${ex.output}`).join('\n')}

Constraints: ${safeConstraints}

IMPORTANT: Provide complete, working code in ALL THREE languages. Each code block must be complete and runnable.

Format (use exact headers):

### 1. Algorithm Explanation
[2-3 paragraphs explaining the approach]

### 2. Python Solution
\`\`\`python
[Complete runnable Python code]
\`\`\`

### 3. C++ Solution
\`\`\`cpp
[Complete runnable C++ code]
\`\`\`

### 4. Java Solution
\`\`\`java
[Complete runnable Java code]
\`\`\`

### 5. Key Points
- Point 1
- Point 2
- Point 3

### 6. Edge Cases
- Case 1
- Case 2
- Case 3

START NOW:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    
    // Check for blocking
    if (response.promptFeedback?.blockReason) {
      console.error('Solution generation blocked:', response.promptFeedback.blockReason);
      throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
    }
    
    const text = response.text();
    console.log('Solution response length:', text.length);
    console.log('Solution response (first 500 chars):', text.substring(0, 500));
    console.log('Solution response (last 500 chars):', text.substring(Math.max(0, text.length - 500)));
    
    if (!text || text.trim().length === 0) {
      console.error('Empty solution response');
      throw new Error('AI returned empty response. Please try again.');
    }
    
    // Check if response seems truncated (should have at least 3 code blocks)
    const codeBlockCount = (text.match(/```/g) || []).length / 2;
    if (codeBlockCount < 3) {
      console.warn('Response may be truncated - found only', codeBlockCount, 'code blocks');
      console.log('Full response:', text);
      throw new Error('AI response appears incomplete. Please try again.');
    }

    // Parse the text response manually
    const solutionData = parseSolutionFromText(text, timeComplexity, spaceComplexity);
    
    // Validate required fields with more detailed error messages
    if (!solutionData.algorithmExplanation || solutionData.algorithmExplanation.length < 20) {
      console.error('Missing or too short algorithm explanation:', solutionData.algorithmExplanation);
      throw new Error('Generated solution has invalid algorithm explanation');
    }
    
    if (!solutionData.codes || solutionData.codes.length === 0) {
      console.error('No code implementations found in response');
      console.error('Full response text:', text);
      throw new Error('Generated solution has no code implementations. Please try again.');
    }

    console.log('Successfully parsed solution with', solutionData.codes.length, 'code implementations');
    
    return solutionData;

  } catch (error) {
    console.error('Error generating solution with Gemini:', error);
    throw new Error('Failed to generate solution: ' + error.message);
  }
};

const generateTestcases = async ({ problemTitle, problemDescription, examples, constraints, inputFormat, outputFormat }) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    // Ensure all inputs are strings
    const safeDescription = (problemDescription || '').substring(0, 800);
    const safeConstraints = (constraints || '').substring(0, 400);
    const safeExamples = Array.isArray(examples) ? examples.slice(0, 2) : [];

    const prompt = `Generate 10-15 test cases for this problem. Just provide input and output pairs.

**Problem:** ${problemTitle}

**Description:** ${safeDescription}

**Example:**
${safeExamples.map((ex, i) => `Input: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}

**Constraints:** ${safeConstraints}

Generate 10-15 diverse test cases covering:
- Basic cases (simple inputs)
- Edge cases (boundary values)
- Large cases (maximum constraints)

Provide ONLY input and output pairs. Match the exact format from examples.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    
    // Check for blocking
    if (response.promptFeedback?.blockReason) {
      console.error('Testcase generation blocked:', response.promptFeedback.blockReason);
      throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
    }
    
    const text = response.text();
    console.log('Testcase raw response length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));
    
    if (!text || text.trim().length === 0) {
      console.error('Empty testcase response');
      throw new Error('AI returned empty response. Please try again.');
    }

    // Parse the raw text response and format it ourselves
    const testcases = parseTestcasesFromText(text);
    
    if (!testcases || testcases.length < 5) {
      console.log('Only parsed', testcases.length, 'testcases, expected at least 5');
      throw new Error(`Only generated ${testcases.length} complete testcases. Please try again.`);
    }

    console.log('Successfully parsed', testcases.length, 'complete testcases');
    
    return { testcases };

  } catch (error) {
    console.error('Error generating testcases with Gemini:', error);
    throw new Error('Failed to generate testcases: ' + error.message);
  }
};

// Helper function to parse testcases from raw AI text
function parseTestcasesFromText(text) {
  const testcases = [];
  
  // Split by common delimiters to find test cases
  const lines = text.split('\n');
  let currentInput = '';
  let currentOutput = '';
  let isReadingInput = false;
  let isReadingOutput = false;
  let testcaseCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines when not reading
    if (!line && !isReadingInput && !isReadingOutput) {
      continue;
    }
    
    // Detect input markers
    if (line.match(/^(Test\s*Case\s*\d+|Input\s*\d*|TC\s*\d+):/i) || 
        line.match(/^Input:/i)) {
      // Save previous testcase if it's complete (has both input and output)
      if (currentInput && currentOutput) {
        const type = testcaseCount < 3 ? 'basic' : 
                     testcaseCount < 7 ? 'edge' : 'large';
        testcases.push({
          type,
          input: currentInput.trim(),
          output: currentOutput.trim()
        });
        testcaseCount++;
      }
      
      // Start new testcase
      currentInput = '';
      currentOutput = '';
      isReadingInput = true;
      isReadingOutput = false;
      
      // Check if input is on same line
      const inputMatch = line.match(/Input:\s*(.+)/i);
      if (inputMatch) {
        currentInput = inputMatch[1];
      }
      continue;
    }
    
    // Detect output markers
    if (line.match(/^Output:/i)) {
      isReadingInput = false;
      isReadingOutput = true;
      
      // Check if output is on same line
      const outputMatch = line.match(/Output:\s*(.+)/i);
      if (outputMatch) {
        currentOutput = outputMatch[1];
      }
      continue;
    }
    
    // Read multi-line input/output
    if (isReadingInput && line.length > 0 && !line.match(/^(Output|Test|TC|---|\*\*)/i)) {
      currentInput += (currentInput ? '\n' : '') + line;
    }
    
    if (isReadingOutput && line.length > 0 && !line.match(/^(Input|Test|TC|---|\*\*)/i)) {
      currentOutput += (currentOutput ? '\n' : '') + line;
    }
  }
  
  // Add last testcase ONLY if it has both input AND output
  if (currentInput && currentOutput) {
    const type = testcaseCount < 3 ? 'basic' : 
                 testcaseCount < 7 ? 'edge' : 'large';
    testcases.push({
      type,
      input: currentInput.trim(),
      output: currentOutput.trim()
    });
  } else if (currentInput && !currentOutput) {
    console.log('Skipping incomplete testcase (missing output)');
  }
  
  return testcases;
}

// Helper function to parse solution from raw AI text
// Helper function to format and clean text (LaTeX, markdown, etc.)
function formatText(text) {
  if (!text) return '';
  
  return text
    // Convert LaTeX math notation to plain text/Unicode
    .replace(/\$([^$]+)\$/g, (match, p1) => {
      // Handle exponents: 10^9 -> 10⁹
      let formatted = p1.replace(/(\d+)\^(\d+)/g, (m, base, exp) => {
        const superscripts = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        return base + exp.split('').map(d => superscripts[d] || d).join('');
      });
      // Handle common math symbols
      formatted = formatted.replace(/\\times/g, '×').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥');
      return formatted;
    })
    // Clean up mixed formatting patterns like: **text:**, `text`
    .replace(/\*\*\s*([^*]+?)\s*:\s*\*\*,?\s*/g, '$1: ')
    .replace(/\*\*\s*([^*]+?)\s*\*\*\s*:\s*/g, '**$1**: ')
    // Clean backtick spacing
    .replace(/`\s+([^`]+?)\s+`/g, '`$1`')
    // Normalize multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSolutionFromText(text, timeComplexity, spaceComplexity) {
  const result = {
    algorithmExplanation: '',
    codes: [],
    timeComplexity: timeComplexity || 'Not specified',
    spaceComplexity: spaceComplexity || 'Not specified',
    keyPoints: [],
    edgeCases: []
  };
  
  console.log('Parsing solution text, length:', text.length);
  
  // Extract algorithm explanation - try multiple patterns
  let explanationMatch = text.match(/###?\s*\d+\.\s*\*\*?Algorithm Explanation\*\*?\s*[\:\-]?\s*\n\n?([\s\S]*?)(?=\n\s*###?\s*\d+\.|```|$)/i);
  if (!explanationMatch) {
    explanationMatch = text.match(/\*\*Algorithm Explanation\*\*\s*[\:\-]?\s*\n\n?([\s\S]*?)(?=\n\s*\*\*|```|$)/i);
  }
  if (!explanationMatch) {
    // Try numbered section: "1. Algorithm Explanation"
    explanationMatch = text.match(/\d+\.\s*Algorithm Explanation\s*[\:\-]?\s*\n\n?([\s\S]*?)(?=\n\s*\d+\.|```|$)/i);
  }
  
  if (explanationMatch) {
    result.algorithmExplanation = formatText(explanationMatch[1].trim());
    console.log('Found algorithm explanation, length:', result.algorithmExplanation.length);
  } else {
    // Fallback: extract any substantial text before first code block
    const beforeCode = text.split('```')[0];
    if (beforeCode && beforeCode.length > 100) {
      // Remove common headers/markers
      let cleaned = beforeCode.replace(/^###?\s*\d+\.\s*/gm, '').trim();
      result.algorithmExplanation = formatText(cleaned.substring(0, 800)); // Cap at 800 chars
      console.log('Using fallback explanation from text before code blocks');
    } else {
      // Last resort: use a generic explanation
      result.algorithmExplanation = 'This solution implements the required algorithm based on the problem constraints and complexity requirements.';
      console.log('Using generic explanation as fallback');
    }
  }
  
  // Extract code blocks with more flexible regex
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;
  const codeMap = { python: false, cpp: false, java: false };
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    let lang = (match[1] || '').toLowerCase().trim();
    const code = match[2].trim();
    
    // Skip empty code blocks
    if (!code || code.length < 10) {
      continue;
    }
    
    // Infer language if not specified
    if (!lang) {
      if (code.includes('def ') || code.includes('import ')) {
        lang = 'python';
      } else if (code.includes('#include') || code.includes('std::')) {
        lang = 'cpp';
      } else if (code.includes('public class') || code.includes('public static void')) {
        lang = 'java';
      }
    }
    
    console.log('Found code block, language:', lang, 'length:', code.length);
    
    if ((lang === 'python' || lang === 'py') && !codeMap.python) {
      result.codes.push({ language: 'python', code });
      codeMap.python = true;
    } else if ((lang === 'cpp' || lang === 'c++' || lang === 'c') && !codeMap.cpp) {
      result.codes.push({ language: 'cpp', code });
      codeMap.cpp = true;
    } else if (lang === 'java' && !codeMap.java) {
      result.codes.push({ language: 'java', code });
      codeMap.java = true;
    }
  }
  
  console.log('Extracted', result.codes.length, 'code blocks');
  
  // Extract key points - try multiple patterns
  let keyPointsMatch = text.match(/###?\s*\d+\.\s*\*\*?Key Points\*\*?\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*###?\s*\d+\.|$)/i);
  if (!keyPointsMatch) {
    keyPointsMatch = text.match(/\*\*Key Points\*\*\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*\*\*|$)/i);
  }
  if (!keyPointsMatch) {
    keyPointsMatch = text.match(/\d+\.\s*Key Points\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*\d+\.|$)/i);
  }
  
  if (keyPointsMatch) {
    const points = keyPointsMatch[1].split('\n').filter(line => line.trim().match(/^[-\*•\d]/));
    result.keyPoints = points
      .map(p => formatText(p.trim().replace(/^[-\*•\d]+[\.\)]\s*/, '')))
      .filter(p => p.length > 0)
      .slice(0, 3);
  }
  
  // Extract edge cases - try multiple patterns
  let edgeCasesMatch = text.match(/###?\s*\d+\.\s*\*\*?Edge Cases\*\*?\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*###?\s*\d+\.|$)/i);
  if (!edgeCasesMatch) {
    edgeCasesMatch = text.match(/\*\*Edge Cases\*\*\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*\*\*|$)/i);
  }
  if (!edgeCasesMatch) {
    edgeCasesMatch = text.match(/\d+\.\s*Edge Cases\s*[\:\-]?\s*\n([\s\S]*?)(?=\n\s*\d+\.|$)/i);
  }
  
  if (edgeCasesMatch) {
    const cases = edgeCasesMatch[1].split('\n').filter(line => line.trim().match(/^[-\*•\d]/));
    result.edgeCases = cases
      .map(c => formatText(c.trim().replace(/^[-\*•\d]+[\.\)]\s*/, '')))
      .filter(c => c.length > 0)
      .slice(0, 3);
  }
  
  // Ensure we have at least something in key points and edge cases
  if (result.keyPoints.length === 0) {
    result.keyPoints = [
      'Implement the core algorithm efficiently',
      'Handle edge cases properly',
      'Optimize time and space complexity'
    ];
  }
  
  if (result.edgeCases.length === 0) {
    result.edgeCases = [
      'Empty input',
      'Single element',
      'Maximum constraints'
    ];
  }
  
  // Pad to exactly 3 items if needed
  while (result.keyPoints.length < 3) {
    result.keyPoints.push('Review problem constraints carefully');
  }
  while (result.edgeCases.length < 3) {
    result.edgeCases.push('Test with boundary values');
  }
  
  console.log('Final parsed solution:', {
    hasExplanation: !!result.algorithmExplanation,
    explanationLength: result.algorithmExplanation.length,
    codeCount: result.codes.length,
    keyPointsCount: result.keyPoints.length,
    edgeCasesCount: result.edgeCases.length
  });
  
  return result;
}

module.exports = {
  generateProblem,
  generateSolution,
  generateTestcases
};
