import { Request, Response } from "express";
import express from 'express';
import BaseController from "../controller/BaseController";

//const commonRouter = express.Router();

const router = async (req: Request, res: Response): Promise<any> => {
    const param = req.path.split("/");
    if(param.length < 3) {
        return res.status(400).send("invalid url");
    }

    const controllerName = param[1].toLocaleLowerCase().trim();
    const controller: BaseController = global._controller[controllerName];
    if(controller==null || controller==undefined) {
        return res.status(400).send("invalid url");
    }

    let method = param[2];
    if(param.length > 3)
    {
        for(let i=3; i<param.length; i++)
        {
            let name = param[i].toLowerCase();
            let firstCharact = name[0].toUpperCase();
            name = firstCharact + name.substring(1, name.length);
            method += name;
        }
    }
    
    await callMethod(controller, method, req, res);
}

const callMethod = async (controller: BaseController, methodName: string, req: Request, res: Response): Promise<void> => {
    if (typeof controller[methodName] === 'function') {
        await controller[methodName].call(controller, req, res); // Call method with specified context
    } else {
        res.status(400).send("invalid url");
    }
}

export default router;