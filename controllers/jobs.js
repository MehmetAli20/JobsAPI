const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req,res) => {
    const usersAllJobs = await Job.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({usersAllJobs,count:usersAllJobs.length})
}

const getJob = async (req,res) => { 

    const {user:{userId},params:{id:jobId}} = req

    const choosenJob = await Job.findOne({_id:jobId,createdBy:userId})

    if(!choosenJob){
        throw new NotFoundError(`No job found with id ${jobId} and no user found ${userId}`)
    }

    res.status(StatusCodes.OK).json({choosenJob})
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res) => {
    const {body:{company,position},user:{userId},params:{id:jobId}} = req

    if(!company || !position || company ==='' || position ===''){
        throw new BadRequestError('Please provide company name and position.')
    }
    
    const updatedJob = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})

    if(!updatedJob){
        throw new NotFoundError(`No job found with id ${jobId} and no user found ${userId}`)
    }

    res.status(StatusCodes.CREATED).json({updatedJob})
}

const deleteJob = async (req,res) => {
    const {user:{userId},params:{id:jobId}} = req
    const removeJob = await Job.findByIdAndRemove({_id:jobId,createdBy:userId})
    if(!removeJob){
        throw new NotFoundError(`No job found with id ${jobId} and no user found ${userId}`)
    }
    res.status(StatusCodes.OK).send('DELETED SUCCESSFULLY')
}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}