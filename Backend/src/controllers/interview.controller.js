import {PDFParse} from 'pdf-parse'
import {generateInterviewReport , generateResumePdf} from '../services/ai.services.js'
import interviewReportModel from '../models/interviewReport.model.js'

/**
 * @description Controller to generate interview report based on user self description, resume and job description
 */
export const generateInterviewReportController = async(req,res) => {

    const resumeContent = new PDFParse(req.file.buffer)
    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
    if (interviewReportByAi.error) {
        return res.status(500).json(interviewReportByAi);
    }
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    return res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId
 */
export const getInterviewReportByIdController = async(req,res) => {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})
    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description Controller to get all interview report of logged in user
 */
export const getAllInterview = async(req,res) => {
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    return res.status(200).json({
        message:"Interview reports fetched successfully",
        interviewReports
    })
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description, resume and job description
 */
export const generateResumePdfController = async(req,res) => {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    const {resume, jobDescription, selfDescription} = interviewReport
    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}