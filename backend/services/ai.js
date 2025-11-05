const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProblem = async ({ topics, rating, suggestion }) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
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
- Do NOT include any markdown formatting, code blocks, or explanatory text
- Ensure the JSON is complete and properly closed
- Remove any trailing commas before closing brackets

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
    "Subtle hint 1 pointing toward a key observation",
    "Hint 2 suggesting the right approach or data structure",
    "Hint 3 addressing a common pitfall or optimization"
  ],
  
  "tags": ["List", "All", "Relevant", "Algorithm/Data Structure", "Tags"],
  
  "difficulty": "${rating}",
  
  "timeComplexity": "Expected optimal solution time complexity (e.g., O(n log n))",
  
  "spaceComplexity": "Expected optimal solution space complexity (e.g., O(n))",
  
  "testCaseCount": "Number between 5-10 based on complexity",
  
  "approach": "Brief 2-3 sentence description of the intended solution approach without giving away complete implementation. Guide thinking in the right direction.",
  
  "keyInsights": [
    "Critical insight 1 that leads to the solution",
    "Critical insight 2 about optimization or correctness",
    "Any mathematical property or pattern to observe"
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

FINAL REMINDER: Output ONLY the JSON object. No markdown, no code blocks, no additional text. Just pure, valid JSON starting with { and ending with }.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle cases where Gemini adds markdown formatting)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    // Also remove any trailing markdown or non-JSON content
    jsonText = jsonText.trim();
    
    // Find the last closing brace to trim any trailing content
    const lastBraceIndex = jsonText.lastIndexOf('}');
    if (lastBraceIndex !== -1 && lastBraceIndex < jsonText.length - 1) {
      jsonText = jsonText.substring(0, lastBraceIndex + 1);
    }

    let problemData;
    try {
      problemData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Problematic JSON text (first 1000 chars):', jsonText.substring(0, 1000));
      console.error('Problematic JSON text (last 500 chars):', jsonText.substring(Math.max(0, jsonText.length - 500)));
      
      // Try to extract JSON object using regex as fallback
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          // Clean the matched JSON more aggressively
          let cleanJson = jsonMatch[0]
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          
          // Find last closing brace
          const lastBrace = cleanJson.lastIndexOf('}');
          if (lastBrace !== -1 && lastBrace < cleanJson.length - 1) {
            cleanJson = cleanJson.substring(0, lastBrace + 1);
          }
          
          problemData = JSON.parse(cleanJson);
        } catch (fallbackError) {
          console.error('Fallback parse also failed:', fallbackError);
          
          // Last resort: try to fix common JSON issues
          try {
            // Remove any trailing commas before closing brackets/braces
            let fixedJson = jsonMatch[0]
              .replace(/```json\n?/g, '')
              .replace(/```\n?/g, '')
              .replace(/,(\s*[}\]])/g, '$1')
              .trim();
            
            const lastBrace = fixedJson.lastIndexOf('}');
            if (lastBrace !== -1) {
              fixedJson = fixedJson.substring(0, lastBrace + 1);
            }
            
            problemData = JSON.parse(fixedJson);
          } catch (finalError) {
            console.error('All parsing attempts failed:', finalError);
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

module.exports = {
  generateProblem
};
