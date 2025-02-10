"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//const commonRouter = express.Router();
const router = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const param = req.path.split("/");
    if (param.length < 3) {
        return res.status(400).send("invalid url");
    }
    const controllerName = param[1].toLocaleLowerCase().trim();
    const controller = global._controller[controllerName];
    if (controller == null || controller == undefined) {
        return res.status(400).send("invalid url");
    }
    let method = param[2];
    if (param.length > 3) {
        for (let i = 3; i < param.length; i++) {
            let name = param[i].toLowerCase();
            let firstCharact = name[0].toUpperCase();
            name = firstCharact + name.substring(1, name.length);
            method += name;
        }
    }
    yield callMethod(controller, method, req, res);
});
const callMethod = (controller, methodName, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof controller[methodName] === 'function') {
        yield controller[methodName].call(controller, req, res); // Call method with specified context
    }
    else {
        res.status(400).send("invalid url");
    }
});
exports.default = router;
