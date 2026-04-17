import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from 'puppeteer'
import { ResponseException } from "pdf-parse";

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});
/**
 * @description Generate interview report
 */
let count = 0;
export async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // safer
    contents: `
You are an AI that ONLY returns valid JSON.

Generate an interview report using the following schema EXACTLY:

{
  "matchScore": number (0-100),
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ],
  "title": string
}

STRICT RULES:
- Return ONLY JSON (no explanation, no text)
- Use double quotes ONLY
- Do NOT use markdown (no \`\`\`)
- Do NOT skip any field
- Ensure correct data types
- matchScore must be between 0 and 100
- preparationPlan should have at least 3 days
- Each array should contain at least 4 items

Now generate the report using:

Resume: ${resume}

Self Description: ${selfDescription}

Job Description: ${jobDescription}
`,
    config: {
      responseMimeType: "application/json",
    },
  });

  const cleaned = response.text.replace(/```json|```/g, "");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.log("❌ JSON parse failed");
    throw err;
  }

  const result = interviewReportSchema.safeParse(parsed);
  if (!result.success) {
    console.log("❌ Validation error:", result.error?.issues || "Unknown error");
    return {
      error: "Invalid AI response",
      raw: parsed,
    };
  }

  return result.data;
}


/**
 * @description Generate ResumePDF from HTML generated perviously 
 */
export async function generatePdfFromHTML(htmlContent){
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.setContent(htmlContent,{waitUntil:"networkidle2"})

  const pdfBuffer = await page.pdf({format: "A4", margin:{
    top:"20mm",
    bottom: "20mm",
    left: "15mm",
    right: "15mm",
  },});
  await browser.close()
  return pdfBuffer
}
/**
 * @description generateResumeHTML
 */
export async function generateResumePdf({
  resume, selfDescription, jobDescription
}){
  const resumePdfSchema = z.object({
      html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
  })
  const prompt = `Generate resume for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
                    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                    The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                    you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                    The resume should not be so lengthy, it should ideally be strictly 1 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                  `
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model:"gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      }
    })
    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHTML(jsonContent.html)
    return pdfBuffer
}
