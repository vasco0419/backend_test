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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
class UserController extends BaseController_1.default {
    getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const id = req["id"];
            try {
                const userInfo = yield User_1.default.findOne({ where: { id: id } });
                res.send(userInfo);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method.toLowerCase() != "post") {
                return res.status(500).send({ message: 'Reject method' });
            }
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const id = req["id"];
            const post_id = req.body["post_id"];
            const title = req.body["title"];
            const description = req.body["description"];
            const fileName = req.body["fileName"];
            try {
                const post = yield Post_1.default.findOne({ where: { id: post_id } });
                if (post == null) {
                    yield Post_1.default.create({
                        user_id: id,
                        title: title,
                        description: description,
                        recommend: 0,
                        image_path: fileName
                    });
                }
                else {
                    post.title = title;
                    post.description = description;
                    if (fileName != "")
                        post.image_path = fileName;
                    post.update([]);
                    post.save();
                }
                res.send({ message: 'success' });
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    getPostList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const sql = `SELECT tbl_a.*, tbl_b.name AS user_name FROM tbl_post AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id`;
            try {
                const postList = yield this.m_entity.selectQueryList(sql);
                res.send(postList);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    getPostInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const user_id = req["id"];
            const post_id = req.query["post_id"];
            const sql = `SELECT tbl_a.*, tbl_b.name AS user_name FROM tbl_post AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id WHERE tbl_a.id = ${post_id}`;
            try {
                const post = yield this.m_entity.selectQueryInfo(sql);
                res.send(post);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    setPostRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const user_id = req["id"];
            const post_id = req.query["post_id"];
            try {
                const post = yield Post_1.default.findOne({ where: { id: post_id } });
                if (post != null && post.user_id != user_id) {
                    if (post.read_users == null || post.read_users.includes(`[${user_id}]`) == false) {
                        if (post.read_users == null)
                            post.read_users = "";
                        post.read_count++;
                        post.read_users = post.read_users + `[${user_id}]`;
                        yield post.update(["read_count", "read_users"]);
                        yield post.save();
                    }
                }
                res.send(post);
            }
            catch (error) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    setPostRecommend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const user_id = req["id"];
            const post_id = req.body["post_id"];
            try {
                const post = yield Post_1.default.findOne({ where: { id: post_id } });
                if (post != null) {
                    if (post.recom_users != null && post.recom_users.includes(`[${user_id}]`)) {
                        post.recom_count--;
                        post.recom_users = post.recom_users.replace(`[${user_id}]`, "");
                    }
                    else {
                        if (post.recom_users == null)
                            post.recom_users = "";
                        post.recom_count++;
                        post.recom_users = post.recom_users + `[${user_id}]`;
                    }
                    yield post.update(["recom_count", "recom_users"]);
                    yield post.save();
                }
                res.send(post);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    setPostReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const user_id = req["id"];
            const post_id = req.body["post_id"];
            try {
                const post = yield Post_1.default.findOne({ where: { id: post_id } });
                if (post != null) {
                    if (post.report_users != null && post.report_users.includes(`[${user_id}]`)) {
                        post.report_count--;
                        post.report_users = post.report_users.replace(`[${user_id}]`, "");
                    }
                    else {
                        if (post.report_users == null)
                            post.report_users = "";
                        post.report_count++;
                        post.report_users = post.report_users + `[${user_id}]`;
                    }
                    yield post.update(["report_count", "report_users"]);
                    yield post.save();
                }
                res.send(post);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const post_id = req.query["post_id"];
            try {
                const post = yield Post_1.default.findOne({ where: { id: post_id } });
                if (post == null) {
                    return res.status(401).send({ message: "Invalid post id" });
                }
                yield post.destroy();
                res.send({ message: "success" });
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    getCommentList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const post_id = req.query["post_id"];
            const sql = `SELECT tbl_a.*, tbl_b.name AS user_name, tbl_c.title AS post_title FROM tbl_comment AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id LEFT JOIN tbl_post AS tbl_c ON tbl_a.post_id = tbl_c.id WHERE post_id = ${post_id}`;
            try {
                const postList = yield this.m_entity.selectQueryList(sql);
                res.send(postList);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    getCommentInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const comment_id = req.query["comment_id"];
            const sql = `SELECT tbl_a.*, tbl_b.name AS user_name, tbl_c.title AS post_title FROM tbl_comment AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id LEFT JOIN tbl_post AS tbl_c ON tbl_a.post_id = tbl_c.id WHERE tbl_a.id = ${comment_id}`;
            try {
                const post = yield this.m_entity.selectQueryInfo(sql);
                res.send(post);
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    saveComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method.toLowerCase() != "post") {
                return res.status(500).send({ message: 'Reject method' });
            }
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const user_id = req["id"];
            const comment_id = req.body["comment_id"];
            const post_id = req.body["post_id"];
            const description = req.body["description"];
            try {
                const comment = yield Comment_1.default.findOne({ where: { id: comment_id } });
                if (comment == null) {
                    yield Comment_1.default.create({
                        user_id: user_id,
                        post_id: post_id,
                        description: description,
                    });
                }
                else {
                    comment.description = description;
                    comment.update(["description"]);
                    comment.save();
                }
                res.send({ message: 'success' });
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req["role"] !== "user") {
                res.status(400).send({ message: 'Invalid token' });
                return;
            }
            const comment_id = req.query["comment_id"];
            try {
                const comment = yield Comment_1.default.findOne({ where: { id: comment_id } });
                if (comment == null) {
                    return res.status(401).send({ message: "Invalid comment id" });
                }
                yield comment.destroy();
                res.send({ message: "success" });
            }
            catch (_a) {
                res.status(500).send({ message: "Interal server error" });
            }
        });
    }
}
exports.default = UserController;
