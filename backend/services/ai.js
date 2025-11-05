const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProblem = async ({ topics, rating, suggestion }) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

{
  "title": "Creative Problem Title (should be catchy and hint at the concept)",
  "description": "Complete problem statement in 3-5 paragraphs:
    - Paragraph 1: Story/context and problem setup
    - Paragraph 2-3: Detailed problem description, what needs to be computed/solved
    - Paragraph 4: Input format specification
    - Paragraph 5: Output format specification
    
    Make it engaging, clear, and technically precise. Use proper formatting with line breaks between paragraphs.",
  
  "examples": [
    {
      "input": "Exact input format as specified",
      "output": "Expected output",
      "explanation": "Detailed step-by-step explanation of why this is the answer, showing the algorithm/logic"
    },
    // Provide 3-5 diverse examples covering: basic case, edge case, medium complexity, and tricky case
  ],
  
  "constraints": "List all constraints clearly:
• Input size constraints (e.g., 1 ≤ n ≤ 10^5)
• Value constraints (e.g., 1 ≤ arr[i] ≤ 10^9)
• Time limit: [X] seconds
• Memory limit: [X] MB
• Any special constraints specific to the problem
  
Ensure constraints are realistic for ${rating} rating and allow the intended solution to pass.",
  
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

Generate the problem now. Respond ONLY with the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle cases where Gemini adds markdown formatting)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const problemData = JSON.parse(jsonText);

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
